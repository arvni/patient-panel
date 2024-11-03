<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
    'twilio' => [
        'sid' => env("TWILIO_ACCOUNT_SID"),
        'token' => env("TWILIO_AUTH_TOKEN"),
        'serviceSid' => env("TWILIO_SERVICE_SID"),
        "whatsappSid"=>env("TWILIO_WHATSAPP_SERVICE_SID"),
        "whatsappNo"=>env("TWILIO_WHATSAPP_NO"),
        "whatsappApprovedContentWithJoinSid" => env("TWILIO_APPROVED_CONTENT_WITH_JOIN_SID"),
        "whatsappApprovedContentSid" => env("TWILIO_APPROVED_CONTENT_SID"),
        "whatsappOTP" => env("TWILIO_OTP"),
        "whatsappPaymentInfo" => env("TWILIO_PAYMENT_INFO"),
    ],
    "omanTel" => [
        "url" => env("OMAN_TEL_SEND_MESSAGE_URL"),
        "username" => env("OMAN_TEL_USERNAME"),
        "password" => env("OMAN_TEL_PASSWORD")
    ],
    "paypal" => [
        "client_id" => env("PAYPAL_CLIENT_ID"),
        "secret" => env("PAYPAL_SECRET")
    ]

];
