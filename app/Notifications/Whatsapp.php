<?php

namespace App\Notifications;


use App\Notifications\SMSProviders\Twilio;
use Illuminate\Notifications\Notification;

class Whatsapp
{
    public function send($notifiable, Notification $notification): void
    {
        list($mobile, $messageSid, $variables) = $notification->toWhatsapp($notifiable);
        Twilio::whatsapp($mobile, $messageSid, json_encode($variables));
    }
}
