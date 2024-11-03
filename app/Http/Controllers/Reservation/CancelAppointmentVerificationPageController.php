<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Services\ShowResend;
use Inertia\Inertia;

class CancelAppointmentVerificationPageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Reservation $reservation)
    {
        $reservation->load("Customer");
        return Inertia::render("VerifyCancelAppointment", [
            "mobile" => $reservation->Customer->mobile,
            "showResendSMS" => ShowResend::check($reservation->Customer->mobile),
            "id" => $reservation->id
        ]);
    }
}
