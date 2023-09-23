<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
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
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get("/test",function (){

    $twilio = new Client(config("TWILIO_ACCOUNT_SID"), config("TWILIO_AUTH_TOKEN"));

//    $verification = $twilio
//        ->verify
//        ->v2
//        ->services("TWILIO_SERVICE_SID")
//        ->verifications
//        ->create("+96878454640", "sms");

//    $verification_check = $twilio->verify->v2->services("VA9f0cdd9233f490d782c2d18394dababd")
//        ->verificationChecks
//        ->create([
//                "to" => "+96878454640",
//                "code" => "329598"
//            ]
//        );
//    dd($verification->toArray());

});

require __DIR__.'/auth.php';
