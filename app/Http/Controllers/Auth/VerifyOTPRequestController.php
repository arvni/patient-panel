<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Customer;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Services\OtpService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class VerifyOTPRequestController extends Controller
{
    /**
     * Display the Verify view.
     * @param Request $request
     * @return RedirectResponse|Response
     */
    public function create(Request $request)
    {
        $user = Customer::where("mobile", $request->get("mobile"))->first();
        if (!$user)
            return redirect()->route("login")->withErrors(["mobile" => __("auth.wrong_number")]);
        return Inertia::render('Auth/Verify', ['status' => session('status'), 'mobile' => $request->get("mobile"), "show_resend" => Gate::allows("requestForNewOTP", $user)]);
    }

    /**
     * Handle an incoming authentication request.
     * @param LoginRequest $request
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $user = Customer::where("mobile", $request->get("mobile"))->first();
        Auth::guard('customer')->login($user);
        $request->session()->regenerate();
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     * @param Request $request
     * @return RedirectResponse
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        Auth::guard('customer')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
