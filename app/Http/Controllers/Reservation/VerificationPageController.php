<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Services\ShowResend;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VerificationPageController extends Controller
{
    /**
     * Handle the incoming request.
     * @param Reservation $reservation
     * @return RedirectResponse|Response
     */
    public function __invoke(Reservation $reservation)
    {
        if ($reservation->verified_at)
            return redirect()->route("reservations.show", $reservation);

        $reservation->load("Customer");
        return Inertia::render("Verify", [
            "mobile" => $reservation->Customer->mobile,
            "showResendSMS" => ShowResend::check($reservation->Customer->mobile),
            "id" => $reservation->id
        ]);
    }

}
