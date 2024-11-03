<?php

namespace App\Notifications\SMSProviders;

use Illuminate\Support\Facades\Log;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;

class Twilio
{

    public static function whatsapp($mobile, $contentSid, $contentVariables)
    {
        try {
            $twilio = new Client(config("services.twilio.sid"), config("services.twilio.token"));
            $message = $twilio->messages
                ->create("whatsapp:$mobile", // to
                    array(
                        "from" => config("services.twilio.whatsappNo"),
                        "contentSid" => $contentSid,
                        "contentVariables" => $contentVariables,
                        "messagingServiceSid" => config("services.twilio.whatsappSid"))
                );
            Log::notice($message->sid, $message->toArray());
        } catch (TwilioException $exception) {
            Log::error($exception->getMessage(), [config("services.twilio.whatsappSid"),]);
        }
    }

    public static function sms($mobile, $message)
    {
        try {
            $twilio = new Client(config("services.twilio.sid"), config("services.twilio.token"));
            $message = $twilio->messages
                ->create($mobile, // to
                    array(
                        "from" => config("services.twilio.smsSid"),
                        "body" => $message)
                );
            Log::notice($message->sid, $message->toArray());
        } catch (TwilioException $exception) {
            Log::error($exception->getMessage());
        }
    }
}
