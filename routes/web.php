<?php

use App\Http\Controllers\AcceptanceController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Twilio\Rest\Client;

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
    if (auth()->user())
        return redirect()->route("acceptances.index");
    return redirect()->route("login");
});


Route::middleware('auth')->group(function () {
    Route::get("/dashboard", [AcceptanceController::class, "index"])->name("acceptances.index");
    Route::get("/tests/{acceptance}", [AcceptanceController::class, "show"])->name("acceptances.show");
    Route::get("/tests/{acceptanceItem}/report", [AcceptanceController::class, "report"])->name("acceptances.report");

});


require __DIR__ . '/auth.php';
