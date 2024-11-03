<?php
return [
    "server_url" => env("SERVER_URL", ""),
    "acceptances_path" => env("ACCEPTANCES_PATH", "acceptances/"),
    "login_path" => env("LOGIN_PATH", "login/"),
    "report_path" => env("REPORT_PATH", "reports/"),
    "email" => env("API_LOGIN_EMAIL",""),
    "password" => ENV("API_LOGIN_PASSWORD",""),
    "send_sms" => env("SEND_SMS_PATH", "send-sms/"),
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
];
