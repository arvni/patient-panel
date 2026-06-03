<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'failed' => 'Invalid OTP code. Please check and try again.',
    'failed_multiple' => 'Invalid OTP code. You have :attempts attempts remaining before your account is locked.',
    'password' => 'The provided password is incorrect.',
    'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',
    'sms' => 'Your '.config("app.name").' OTP is :code. Valid for 10 minutes.',
    'wrong_number' => 'Invalid phone number format.',
    'wrong_number1' => 'Invalid phone number format. Please use format: 968XXXXXXXX'

];
