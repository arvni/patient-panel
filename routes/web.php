<?php

use App\Http\Controllers\AcceptanceController;
use App\Http\Controllers\Reservation\PaymentCallbackController;
use App\Http\Controllers\Reservation\PaymentController;
use App\Http\Controllers\Reservation\ReservationController;
use App\Http\Controllers\ShowAcceptanceItemReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (auth("customer")->user())
        return redirect()->route("acceptances.index");
    return redirect()->route("login");
});


Route::middleware('auth:customer')->group(function () {
    Route::get("/dashboard", [AcceptanceController::class, "index"])->name("acceptances.index");
    Route::get("/tests/{acceptance}", [AcceptanceController::class, "show"])->name("acceptances.show");
    Route::get("tests/{acceptance}/acceptance-items/{acceptanceItem}/report", [AcceptanceController::class, "report"])->name("acceptanceItems.report");
    Route::get("tests/{acceptance}/acceptance-items/{acceptanceItem}", ShowAcceptanceItemReportController::class)->name("acceptanceItems.show");
    Route::resource("reservations", ReservationController::class);
    Route::post("reservations/{reservation}/payment", PaymentController::class)
        ->middleware("throttle:10,6")
        ->name("reservations.payment");

    Route::any("reservations/{reservation}/payment", PaymentCallbackController::class)
        ->name("reservations.payment.callback");
});


require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
