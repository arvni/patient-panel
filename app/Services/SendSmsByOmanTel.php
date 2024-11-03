<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Mockery\Exception;

class SendSmsByOmanTel
{
    public static function send($mobile, $message, $pushDateTime = "")
    {
        $data = [
            "mobile" => $mobile,
            "message" => $message,
        ];
        if ($pushDateTime)
            $data["pushDateTime"] = $pushDateTime;
        try {
            $response = ApiService::sendSms($data);
            Log::info($response);
        } catch (Exception $exception) {
            Log::error($exception->getMessage(), $exception->getTrace());
        }
    }
}

