<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Customer;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
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
        if (Auth::guard('web')->check()) {
            Auth::guard('web')->logout();
            \Log::info('Logged out from web guard');
        }

        if (Auth::guard('customer')->check()) {
            Auth::guard('customer')->logout();
            \Log::info('Logged out from customer guard');
        }


        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
