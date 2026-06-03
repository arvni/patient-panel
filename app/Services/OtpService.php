<?php

namespace App\Services;

use App\Enums\ReservationType;
use App\Models\VerificationRequest;
use App\Notifications\SMSProviders\Twilio;
use Salehhashemi\OtpManager\Facade\OtpManager;
use Twilio\Rest\Client;

class OtpService
{
    public string $serviceSid, $token, $sid;

    public function __construct()
    {
        $this->sid = config("services.twilio.sid");
        $this->token = config("services.twilio.token");
        $this->serviceSid = config("services.twilio.serviceSid");
    }


    public static function senOtp($mobile, $code)
    {
        return (new self())->sentByOmanTel($mobile, $code);
    }

    /**
     * @param $mobile
     * @param $code
     * @return bool|null
     */
    public static function checkOtp($mobile, $code): ?bool
    {
        return (new self())->checkOtpByOmanTel($mobile, $code);
    }

    protected function sentByTwilio($mobile)
    {
        $twilio = new Client($this->sid, $this->token);
        $twilio->verify->v2->services($this->serviceSid)
            ->verifications
            ->create("+968" . $mobile, "sms");
        return true;
    }

    protected function checkOtpByTwilio($mobile, $code)
    {
        $twilio = new Client($this->sid, $this->token);
        $result = $twilio->verify->v2->services($this->serviceSid)
            ->verificationChecks
            ->create([
                    "to" => "+968" . $mobile,
                    "code" => $code
                ]
            );
        return $result->valid;
    }

    protected function sentByOmanTel($mobile, $code)
    {
        SendSmsByOmanTel::send($mobile, __("auth.sms", ["code" => $code]));
        Twilio::whatsapp("+968" . $mobile,
            config("services.twilio.whatsappOTP"),
            json_encode([
                "1" => "$code",
            ]));
        return true;
    }


    protected function checkOtpByOmanTel($mobile, $code)
    {
        \Log::info("OTP Verification Attempt", [
            'mobile' => $mobile,
            'code_length' => strlen($code),
        ]);

        $verificationRequest = VerificationRequest::where("mobile", $mobile)->first();

        if (!$verificationRequest) {
            \Log::error("OTP Verification Failed: No verification request found for mobile: " . $mobile);
            return false;
        }

        \Log::info("Verification Request Found", [
            'mobile' => $mobile,
            'trackingCode' => $verificationRequest->trackingCode,
            'expires_at' => $verificationRequest->expires_at,
            'failed_attempts' => $verificationRequest->failed_attempts ?? 0,
            'locked' => $verificationRequest->locked
        ]);

        // Check if OTP has expired
        if ($verificationRequest->expires_at && now()->greaterThan($verificationRequest->expires_at)) {
            \Log::warning("OTP Verification Failed: OTP expired for mobile: " . $mobile . " (expired at: " . $verificationRequest->expires_at . ")");
            return false;
        }

        // Check if account is locked due to too many failed attempts
        if ($verificationRequest->locked || ($verificationRequest->failed_attempts ?? 0) >= 5) {
            \Log::warning("OTP Verification Failed: Account locked for mobile: " . $mobile . " (failed_attempts: " . $verificationRequest->failed_attempts . ")");
            return false;
        }

        // Verify OTP with the OtpManager
        $isValid = OtpManager::verify($mobile, $code, $verificationRequest->trackingCode);

        if (!$isValid) {
            \Log::warning("OTP Verification Failed: Invalid OTP code for mobile: " . $mobile . " (attempt: " . (($verificationRequest->failed_attempts ?? 0) + 1) . ")");
        } else {
            \Log::info("OTP Verification Success: Valid OTP for mobile: " . $mobile);
        }

        // Increment failed attempts if OTP is invalid
        if (!$isValid) {
            $verificationRequest->increment('failed_attempts');

            // Lock account after 5 failed attempts
            if (($verificationRequest->failed_attempts ?? 0) >= 5) {
                $verificationRequest->update(['locked' => true]);
            }
        } else {
            // Reset counter and failed attempts on successful verification
            $verificationRequest->update([
                'counter' => 0,
                'failed_attempts' => 0
            ]);
        }

        return $isValid;
    }


}
