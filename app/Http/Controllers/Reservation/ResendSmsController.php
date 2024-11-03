<?php

namespace App\Http\Controllers;

use App\Jobs\SendVerificationSMS;
use App\Models\Reservation;
use App\Services\CheckMobile;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;


class ResendSmsController extends Controller
{
    /**
     * Handle the incoming request.
     * @throws ValidationException
     */
    public function __invoke(Reservation $reservation, Request $request)
    {
        $reservation->load("Customer");
        CheckMobile::check($reservation->Customer->mobile);

        SendVerificationSMS::dispatch($reservation->Customer->mobile);
        return redirect()->route("verify", $reservation);
    }
}
