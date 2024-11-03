<?php

namespace App\Http\Controllers;

use App\Http\Requests\CancelAppointmentRequest;
use App\Jobs\SendVerificationSMS;
use App\Models\Reservation;
use App\Services\ConvertMobileNumberService;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;


class SendCancelAppointmentOtpController extends Controller
{
    /**
     * Handle the incoming request.
     * @throws ValidationException
     */
    public function __invoke(CancelAppointmentRequest $request)
    {
        $mobile = ConvertMobileNumberService::convert($request->get("mobile"));
        $reservation = Reservation::whereHas("Customer", function ($q) use ($mobile) {
            $q->where("mobile", $mobile);
        })
            ->whereHas("Time", function ($q) {
                $q->whereDate("started_at", ">", Carbon::now("Asia/Muscat"));
            })
            ->first();
        if (!$reservation)
            return back()->withErrors(["mobile"=>"There is'nt any appointment with this number"]);
        SendVerificationSMS::dispatch($mobile);
        return redirect()->route("verify-cancel-appointment", $reservation);
    }
}
