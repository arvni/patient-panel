<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Services\OtpService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use App\Notifications\SendApprovedReservation;

class VerifyAppointmentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Reservation $reservation, Request $request)
    {
        try {
            $reservation->load(["Customer","Time"]);
            OtpService::checkOtp($reservation->Customer->mobile, $request->get("code"));
            $reservation->touch("verified_at");
            $reservation->save();
            $reservation->Time->update(["disabled" => true]);
			$reservation->Customer->notify(new SendApprovedReservation($reservation));
            return redirect()->route("reservations.show", $reservation);
        } catch (Exception $exception) {
            return back()->withErrors(["mobile" => $exception->getMessage()]);
        }
    }
}
