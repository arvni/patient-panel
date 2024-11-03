<?php

namespace App\Notifications;

use App\Enums\ReservationType;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendApprovedReservation extends Notification
{
    use Queueable;

    public Reservation $reservation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [SMS::class, Whatsapp::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    public function toSMS($notifiable)
    {
        $this->reservation->load(["Time", "Time.Doctor:title,id,image", "Time.Reservation", "Time.Reservation.Transaction", "Time.Reservation.Customer"]);
        $time = $this->reservation->Time->started_at;
        $date = Carbon::parse($time)->setTimezone("Asia/Muscat")->isoFormat("MMMM D, Y");
        $link = $this->reservation->type == ReservationType::ONLINE ? $this->reservation->information["room"]["data"]["join_url"] : "";
        return [
            $notifiable->mobile,
            __("messages.appointmentSuccessfully", [
                "name" => $this->reservation->Time->Reservation->Customer->name,
                "time" =>  $this->reservation->Time->title,
                "date" => $date,
                "doctor" => $this->reservation->Time->Doctor->title,
                "type" => $this->reservation->type->name,
                "online" => $this->reservation->type == ReservationType::ONLINE ? "To join your online consultation, click the link below.\n It will be activated 15 minutes before your appointment time. \n $link" : ""
            ])
        ];
    }

    public function toWhatsapp($notifiable)
    {
        return [
            "+968" . $notifiable->mobile,
            $this->reservation->type == ReservationType::ONLINE ?config("services.twilio.whatsappApprovedContentWithJoinSid"):config("services.twilio.whatsappApprovedContentSid"),
            [
                "1" => $notifiable->name,
                "2" => $this->reservation->type == ReservationType::ONLINE ? $this->reservation->information["room"]["data"]["join_url"] : ""
            ]
        ];
    }
}
