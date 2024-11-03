<?php

namespace App\Http\Controllers\Reservation;

use App\Enums\ReservationType;
use App\Enums\TransactionType;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Notifications\SendApprovedReservation;
use App\Notifications\SendPaymentInformation;
//use App\Services\MicrosoftTeamRoomsService;
use App\Services\RoomsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Jubaer\Zoom\Facades\Zoom;

class PaymentCallbackController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Reservation $reservation, Request $request)
    {
        $reservation->load(["Customer", "Time.Doctor", "Time", "Transaction"]);
        if ($reservation->Transaction)
            return redirect()
                ->route("reservations.show", $reservation);

        if ($reservation->type === ReservationType::ONLINE) {
            $room = $this->zoomRoom($reservation);
            $reservation->information = [
                "room" => $room
            ];
            $transaction = $reservation
                ->Transaction()
                ->make([
                    "type" => TransactionType::DEBIT,
                    "amount" => 30
                ]);
            $transaction
                ->Customer()
                ->associate($reservation->Customer->id);
            $transaction->save();
        }
        $reservation->verified_at = Carbon::now();
        $reservation->save();
        $reservation->Time->update(["disabled" => true]);
        $reservation->Customer->notify(new SendApprovedReservation($reservation));

        $reservation->Customer->notify(new SendPaymentInformation($reservation));
        return redirect()->route("reservations.show", $reservation);
    }

/*
    protected function microsoftTeamRoom($reservation)
    {
        $data = [
            'subject' => $reservation->id,
            'start' => [
                'dateTime' => Carbon::parse($reservation->Time->started_at, "Asia/Muscat")->format("Y-m-d\TH:i:s"),
                'timeZone' => 'Asia/Muscat',
            ],
            'end' => [
                'dateTime' => Carbon::parse($reservation->Time->started_at, "Asia/Muscat")->format("Y-m-d\TH:i:s"),
                'timeZone' => 'Asia/Muscat',
            ]];
        return MicrosoftTeamRoomsService::addRoom($data);
    }*/

    protected function zoomRoom(Reservation $reservation)
    {
        return Zoom::createMeeting([
            "topic" => $reservation->id,
            "type" => 2, // 1 => instant, 2 => scheduled, 3 => recurring with no fixed time, 8 => recurring with fixed time
            "duration" => 60, // in minutes
            "timezone" => 'Asia/Muscat', // set your timezone
            //"password" => 'set your password',
            "start_time" => Carbon::parse($reservation->started_at), // set your start time
            //"template_id" => 'set your template id', // set your template id  Ex: "Dv4YdINdTk+Z5RToadh5ug==" from https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingtemplates
            //"pre_schedule" => false,  // set true if you want to create a pre-scheduled meeting
            "schedule_for" => $reservation->Time->Doctor->email, // set your schedule for
            "settings" => [
                'join_before_host' => false, // if you want to join before host set true otherwise set false
                'host_video' => true, // if you want to start video when host join set true otherwise set false
                'participant_video' => true, // if you want to start video when participants join set true otherwise set false
                'mute_upon_entry' => false, // if you want to mute participants when they join the meeting set true otherwise set false
                'waiting_room' => false, // if you want to use waiting room for participants set true otherwise set false
                'audio' => 'both', // values are 'both', 'telephony', 'voip'. default is both.
                'auto_recording' => 'none', // values are 'none', 'local', 'cloud'. default is none.
                'approval_type' => 0, // 0 => Automatically Approve, 1 => Manually Approve, 2 => No Registration Required
            ],

        ]);
    }
/*
    protected function enableXRoom($reservation)
    {
        return RoomsService::addRoom([
            "name" => "Topic or Room Title",
            "owner_ref" => $reservation->id,
            "settings" => [
                "description" => "Descriptive text",
                "mode" => "group",
                "scheduled" => false,
                "scheduled_time" => Carbon::parse($reservation->Time->started_at, "Asia/Muscat")->format("Y-m-d H:i:s"),
                "adhoc" => false,
                "duration" => 30,
                "moderators" => "1",
                "participants" => "2",
                "auto_recording" => false,
                "quality" => "SD"
            ],
            "sip" => [
                "enabled" => false
            ]
            ,
            "data" => [
                "custom_key" => ""
            ]
        ]);
    }
*/

}
