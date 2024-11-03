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
     * Create a new job instance.
     */

    public $mobile;

    public function __construct($mobile)
    {
        $this->mobile = $mobile;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $verificationRequest = VerificationRequest::whereMobile($this->mobile)->first();

            if (!$verificationRequest) {
                $code = OtpManager::send($this->mobile);
                VerificationRequest::create([
                    "mobile" => $this->mobile,
                    "trackingCode" => $code->trackingCode
                ]);
            }
            else {
                $code = OtpManager::sendAndRetryCheck($this->mobile);
                $verificationRequest->update([
                    "counter" => $verificationRequest->counter + 1,
                    "trackingCode" => $code->trackingCode,
                    "locked" => $verificationRequest->counter > 2
                ]);
            }
            OtpService::senOtp( $this->mobile,$code->code);
        } catch (Exception $exception) {
            $this->fail($exception->getMessage());
        }
    }
}
