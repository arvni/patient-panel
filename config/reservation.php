<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Reservation Price
    |--------------------------------------------------------------------------
    |
    | This value is the default price for reservations when no specific
    | price is set for a time slot.
    |
    */

    'default_price' => env('RESERVATION_DEFAULT_PRICE', 30),

    /*
    |--------------------------------------------------------------------------
    | Session Duration (in minutes)
    |--------------------------------------------------------------------------
    |
    | This defines the standard duration for each appointment session.
    |
    */

    'session_duration' => env('RESERVATION_SESSION_DURATION', 30),

    /*
    |--------------------------------------------------------------------------
    | OTP Rate Limiting (in minutes)
    |--------------------------------------------------------------------------
    |
    | This defines how long a customer must wait between OTP requests.
    |
    */

    'otp_rate_limit_minutes' => env('OTP_RATE_LIMIT_MINUTES', 6),

    /*
    |--------------------------------------------------------------------------
    | Payment Callback Retry Attempts
    |--------------------------------------------------------------------------
    |
    | Number of times to retry payment verification if it fails.
    |
    */

    'payment_retry_attempts' => env('PAYMENT_RETRY_ATTEMPTS', 3),

];
