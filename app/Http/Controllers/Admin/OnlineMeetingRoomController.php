<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Services\RoomsService;
use Inertia\Inertia;

class OnlineMeetingRoomController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Reservation $reservation)
    {
        $room=$reservation->information["room"];
        $token = RoomsService::joinRoom($room["room_id"], [
            "name" => auth()->user()->name,
            "role" => "Moderator",
            "user_ref" => "moderator-".auth()->user()->id
        ]);
        return Inertia::render("Admin/Room/Client", ["token" => $token]);
//        $jwtToken=TwilioRoomService::joinRoom($reservation->information["room"]["sid"],"participant-".auth()->user()->id);
//        return Inertia::render("Room/Twilio", ["roomName" => $reservation->id, "accessToken" => $jwtToken]);
    }
}
