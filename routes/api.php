<?php

use App\Http\Controllers\Api\ListDoctorDays;
use App\Http\Controllers\Api\ListDoctorsController;
use App\Http\Controllers\Api\ListDoctorTimesController;
use App\Http\Controllers\Api\WhatsAppWebhookController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\AppointmentController;
use App\Http\Controllers\Api\V1\LabResultController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API V1 Routes for Mobile App
Route::prefix('v1')->group(function () {
    // Health check endpoint
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'service' => 'Patient Panel API'
        ]);
    });

    // Public authentication routes
    Route::post('/auth/request-otp', [AuthController::class, 'requestOtp']);
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth endpoints
        Route::get('/auth/user', [AuthController::class, 'user']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Appointments
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
        Route::get('/appointments/{appointment}/calendar', [AppointmentController::class, 'calendar']);
        Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);

        // Reservations (web-compatible format for mobile app)
        Route::post('/reservations', [\App\Http\Controllers\Api\V1\ReservationController::class, 'store']);

        // Lab Results
        Route::get('/lab-results', [LabResultController::class, 'index']);
        Route::get('/lab-results/{acceptance}', [LabResultController::class, 'show']);
        Route::get('/lab-results/{acceptance}/items/{item}', [LabResultController::class, 'showItem']);
        Route::get('/lab-results/{acceptance}/items/{item}/download', [LabResultController::class, 'downloadReport']);

        // Doctors (for booking appointments)
        Route::get('/doctors', ListDoctorsController::class);
        Route::get('/doctors/{doctor}/days', ListDoctorDays::class);
        Route::get('/doctors/{doctor}/times', ListDoctorTimesController::class);
    });
});

// Legacy Doctor API endpoints (for web app)
Route::get("/doctors", ListDoctorsController::class)->name("doctors.list");
Route::get("/doctors/{doctor}/days", ListDoctorDays::class)->name("doctors.days");
Route::get("/doctors/{doctor}/times", ListDoctorTimesController::class)->name("doctors.times");

// WhatsApp webhook endpoints
Route::any("/whatsapp/delivery", [WhatsAppWebhookController::class, 'handleDelivery']);
Route::any("/whatsapp/", [WhatsAppWebhookController::class, 'handleMessage']);
