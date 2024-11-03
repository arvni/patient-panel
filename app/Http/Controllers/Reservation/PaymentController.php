<?php

namespace App\Http\Controllers\Reservation;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Exception;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Reservation $reservation, Request $request)
    {
        $reservation->load("Customer","Transaction","Time");
        if ($reservation->Transaction)
            return redirect("reservations.show",$reservation);
        try {
            $reservation->Customer->Payments()->create(["amount"=>$reservation->Time->price]);
            return redirect()->route("reservations.payment.callback", $reservation);
        } catch (Exception $exception) {
            return back()->withErrors($exception->getMessage());
        }
    }
}
