<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\File;
use App\Models\WhatsappMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WhatsAppWebhookController extends Controller
{
    /**
     * Handle incoming WhatsApp message webhook
     */
    public function handleMessage(Request $request)
    {
        Log::info("WhatsApp incoming message", $request->all());

        $validated = $request->validate([
            'WaId' => 'required|string',
            'ProfileName' => 'nullable|string',
            'MessageSid' => 'required|string',
            'Body' => 'nullable|string',
            'SmsStatus' => 'nullable|string',
            'NumMedia' => 'nullable|integer|min:0',
        ]);

        // Extract mobile number (remove country code prefix +968)
        $mobileNumber = substr($validated['WaId'], 3);

        // Find or create customer
        $customer = Customer::firstOrCreate(
            ['mobile' => $mobileNumber],
            ['name' => $validated['ProfileName'] ?? 'WhatsApp User']
        );

        // Create WhatsApp message
        $message = WhatsappMessage::create([
            'customer_id' => $customer->id,
            'MessageSid' => $validated['MessageSid'],
            'body' => $validated['Body'] ?? '',
            'status' => $validated['SmsStatus'] ?? 'received',
            'medias' => [],
            'media_urls' => []
        ]);

        // Handle media attachments if any
        $mediaUrls = $this->handleMediaAttachments($request, $customer, $message);

        if (!empty($mediaUrls)) {
            $message->update(['media_urls' => $mediaUrls]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Message received and processed'
        ]);
    }

    /**
     * Handle delivery status webhook
     */
    public function handleDelivery(Request $request)
    {
        Log::info("WhatsApp delivery status", $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Delivery status updated'
        ]);
    }

    /**
     * Handle media attachments from WhatsApp message
     */
    private function handleMediaAttachments(Request $request, Customer $customer, WhatsappMessage $message): array
    {
        $numMedia = $request->input('NumMedia', 0);
        $mediaUrls = [];

        for ($i = 0; $i < $numMedia; $i++) {
            $mediaUrl = $request->input("MediaUrl$i");

            if (!$mediaUrl) {
                continue;
            }

            try {
                // Download media file from Twilio
                $response = Http::withBasicAuth(
                    config('services.twilio.sid'),
                    config('services.twilio.token')
                )->get($mediaUrl);

                if ($response->failed()) {
                    Log::error("Failed to download media from Twilio", [
                        'url' => $mediaUrl,
                        'status' => $response->status()
                    ]);
                    continue;
                }

                // Generate storage path
                $filename = "customers/{$customer->id}/files/" . Str::random(40);
                Storage::put($filename, $response->body());

                // Get full path and add extension
                $path = storage_path("app/{$filename}");
                $extension = $this->guessExtension($path);
                $newPath = $path . '.' . $extension;

                rename($path, $newPath);

                // Save file record
                File::create([
                    'customer_id' => $customer->id,
                    'related_type' => WhatsappMessage::class,
                    'related_id' => $message->id,
                    'path' => $newPath
                ]);

                $mediaUrls[] = $mediaUrl;
            } catch (\Exception $e) {
                Log::error("Error processing WhatsApp media", [
                    'error' => $e->getMessage(),
                    'media_url' => $mediaUrl
                ]);
            }
        }

        return $mediaUrls;
    }

    /**
     * Guess file extension from file path
     */
    private function guessExtension(string $path): string
    {
        try {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $path);
            finfo_close($finfo);

            $mimeToExt = [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/gif' => 'gif',
                'image/webp' => 'webp',
                'video/mp4' => 'mp4',
                'audio/mpeg' => 'mp3',
                'audio/ogg' => 'ogg',
                'application/pdf' => 'pdf',
                'application/msword' => 'doc',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            ];

            return $mimeToExt[$mimeType] ?? 'bin';
        } catch (\Exception $e) {
            Log::error("Error guessing file extension", ['error' => $e->getMessage()]);
            return 'bin';
        }
    }
}
