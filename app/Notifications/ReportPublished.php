<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReportPublished extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @param Report $report
     */
    public function __construct(public Report $report)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', SMS::class, Whatsapp::class];
    }


    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $test = $this->report->AcceptanceItem->Method->Test;
        return [
            $notifiable->phone,
            "message" => "Hi $notifiable->fullName, Your $test->name Test Report is Ready You can Download it by our Webapp. https://patient.biongenetic.com"
        ];
    }

    public function toSMS($notifiable)
    {
        $test = $this->report->AcceptanceItem->Method->Test;
        return [
            env("ACTIVATE_APP") ? $notifiable->phone : "+96895499196",
            "Hi $notifiable->fullName, Your $test->name Test Report is Ready You can Download it by our Webapp. https://patient.biongenetic.com",
            $this->id
        ];
    }

    public function toWhatsapp($notifiable)
    {
        $test = $this->report->AcceptanceItem->Method->Test;
        return [
            env("ACTIVATE_APP") ? $notifiable->phone : "+96895499196",
            "Hi $notifiable->fullName, Your $test->name Test Report is Ready You can Download it by our Webapp"
        ];
    }
}
