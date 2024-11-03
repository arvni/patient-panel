<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Services\RoomsService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UpdateMeetingRoomController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Reservation $reservation, Request $request)
    {
        $room = $reservation->information["room"];
        RoomsService::deleteRoom($room["room_id"]);
        $room = RoomsService::addRoom([
            "name" => "Topic or Room Title",
            "owner_ref" => $reservation->id,
            "settings" => [
                "description" => "Descriptive text",
                "mode" => "group",
                "scheduled" => false,
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
        $users = RoomsService::getRoomUsers($room["room_id"]);
        $reservation->information = ["room" => $room];
        $reservation->save();
        return ["users" => $users, "room" => $room];
    }
}
