<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Services\RoomsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnlineMeetingRoomController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Reservation $reservation)
    {
        $request = [
            "name" => "Topic or Room Title",
            "owner_ref" => "xyz",
            "settings" => [
                "description" => "Descriptive text",
                "mode" => "group",
                "scheduled" => true,
                "scheduled_time" => Carbon\Carbon::now()->addHours(2)->format("Y-m-d H:i:s"),
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
        ];
        $APP_ID = "6616fb5b851999c9150332a7";
        $APP_Key = "qeJuJusuRuraEuTe9eRuSeeudupaauPese7a";
        $server = "https://api.enablex.io/video";
        $addRoom = "/v2/rooms/";

        $num = cache("num", fn() => 0);
        if ($num == 0) {
            cache()->increment("num");
        } else {
            cache()->decrement("num");
        }

        $request = [
            "name" => "Topic or Room Title",
            "owner_ref" => "xyz",
            "settings" => [
                "description" => "Descriptive text",
                "mode" => "group",
                "scheduled" => true,
                "scheduled_time" => Carbon::now()->addHours(2)->format("Y-m-d H:i:s"),
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
        ];
        $APP_ID = "6616fb5b851999c9150332a7";
        $APP_Key = "qeJuJusuRuraEuTe9eRuSeeudupaauPese7a";
        $server = "https://api.enablex.io/video";
        $addRoom = "/v2/rooms/";

        $num = cache("num", fn() => 0);
        if ($num == 0) {
            cache()->increment("num");
        } else {
            cache()->decrement("num");
        }

        $room = cache()->rememberForever("room-$reservation->id", fn() => RoomsService::addRoom($addRoom));
        $token = RoomsService::joinRoom($room["room_id"], [
            "name" => $reservation->name,
            "role" => "Participant",
            "user_ref" => $reservation->id
        ]);
        $users = RoomsService::getRoomUsers($room["room_id"]);
        return Inertia::render("Room/Client", ["token" => $token, "users" => $users]);
    }
}
