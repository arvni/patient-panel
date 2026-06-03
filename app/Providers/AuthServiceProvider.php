<?php

namespace App\Providers;

use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [

    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Gate to check if user can request a new OTP (2 minute cooldown)
        Gate::define('requestForNewOTP', function (?Customer $user) {
            if (!$user || !$user->last_otp_request) {
                return true;
            }

            // Allow if 2 minutes have passed since last request
            return Carbon::parse($user->last_otp_request)->addMinutes(2)->lessThan(Carbon::now());
        });
    }
}
