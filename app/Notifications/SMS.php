<?php

namespace App\Notifications;


use App\Notifications\SMSProviders\Twilio;
use App\Services\SendSmsByOmanTel;
use Illuminate\Notifications\Notification;

class SMS
{
    protected $mobile;
    protected $message;

    public function send($notifiable, Notification $notification): void
    {
        list($mobile, $message) = $notification->toSMS($notifiable);
        $this->mobile = $mobile;
        $this->message = $message;
//        Twilio::sms($mobile, $message);
        SendSmsByOmanTel::send($mobile,$message);
    }
}
