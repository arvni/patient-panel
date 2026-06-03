<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\OTPRequest;
use App\Jobs\SendVerificationSMS;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OTPRequestController extends Controller
{
    /**
     * Display the Verify view.
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', ['status' => session('status'),]);
    }

    /**
     * Handle the incoming request.
     * @param OTPRequest $request
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function store(OTPRequest $request)
    {
        $request->ensureIsNotRateLimited();
        $mobile = $request->getMobile();
        $user = Customer::where("mobile", $mobile)->first();
        if (!$user) {
            $user = Customer::create(["mobile" => $mobile, "last_otp_request" => Carbon::now()]);
        } else {
            if (Carbon::parse($user->last_otp_request)->addMinutes(2)->lessThan(Carbon::now()))
                $user->update(["last_otp_request" => Carbon::now()]);
            else
                return redirect()->route("verify", ["mobile" => $mobile, "last_otp_request" => $user->last_otp_request]);
        }
        SendVerificationSMS::dispatch($mobile);
        return redirect()->route("verify", ["mobile" => $mobile, "last_otp_request" => Carbon::now()]);
    }
}
