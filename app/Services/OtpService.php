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
        $verificationRequest = VerificationRequest::where("mobile", $mobile)->first();
        if (!$verificationRequest)
            return false;
        return OtpManager::verify($mobile, $code, $verificationRequest->trackingCode);
    }


}
