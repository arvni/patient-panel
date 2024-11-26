<?php

use App\Http\Controllers\Auth\OTPRequestController;
use App\Http\Controllers\Auth\VerifyOTPRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {

    Route::get('verify', [VerifyOTPRequestController::class, 'create'])
                ->name('verify');

    Route::post('verify', [VerifyOTPRequestController::class, 'store']);

    Route::get('login', [OTPRequestController::class,"create"])->name("login");
    Route::post('login', [OTPRequestController::class, 'store']);

});

Route::any('logout', [VerifyOTPRequestController::class, 'destroy'])
                ->name('logout');
