<?php

namespace App\Jobs;

use App\Models\VerificationRequest;
use App\Services\OtpService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Mockery\Exception;
use Salehhashemi\OtpManager\Facade\OtpManager;

class SendVerificationSMS implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The mobile number to send OTP to.
     */
    public $mobile;

    /**
     * Create a new job instance.
     */
    public function __construct($mobile)
    {
        $this->mobile = $mobile;
        $this->onConnection('sync'); // Force synchronous execution
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $verificationRequest = VerificationRequest::whereMobile($this->mobile)->first();
            $expiresAt = now()->addMinutes(10); // OTP expires in 10 minutes

            if (!$verificationRequest) {
                $code = OtpManager::send($this->mobile);
                VerificationRequest::create([
                    "mobile" => $this->mobile,
                    "trackingCode" => $code->trackingCode,
                    "expires_at" => $expiresAt,
                    "failed_attempts" => 0
                ]);
            }
            else {
                $code = OtpManager::sendAndRetryCheck($this->mobile);
                $verificationRequest->update([
                    "counter" => $verificationRequest->counter + 1,
                    "trackingCode" => $code->trackingCode,
                    "locked" => false, // Unlock account when new OTP is requested
                    "expires_at" => $expiresAt,
                    "failed_attempts" => 0 // Reset failed attempts on new OTP
                ]);
            }
            OtpService::senOtp( $this->mobile,$code->code);
        } catch (Exception $exception) {
            $this->fail($exception->getMessage());
        }
    }
}
