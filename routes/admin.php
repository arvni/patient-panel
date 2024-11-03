<?php

use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\Auth\NewPasswordController;
use App\Http\Controllers\Admin\Auth\PasswordController;
use App\Http\Controllers\Admin\Auth\PasswordResetLinkController;
use App\Http\Controllers\Admin\AvailableTimeController;
use App\Http\Controllers\Admin\DoctorAvailableTimesController;
use App\Http\Controllers\Admin\FileController;
use App\Http\Controllers\Admin\GetFutureReserved;
use App\Http\Controllers\Admin\GetTimeController;
use App\Http\Controllers\Admin\ListTimesController;
use App\Http\Controllers\Admin\OnlineMeetingRoomController;
use App\Http\Controllers\Admin\ReservationController;
use App\Http\Controllers\Admin\ToggleAvailableTimeController;
use App\Http\Controllers\Admin\UploadAvatarController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DoctorController;
use App\Http\Controllers\Admin\ChangePasswordController;
use Illuminate\Support\Facades\Route;

Route::name("admin.")
    ->prefix("admin")
    ->group(function () {

        Route::middleware('guest')->group(function () {

            Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');

            Route::post('login', [AuthenticatedSessionController::class, 'store']);

            Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
                ->name('password.request');

            Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
                ->name('password.email');

            Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
                ->name('password.reset');

            Route::post('reset-password', [NewPasswordController::class, 'store'])
                ->name('password.store');
        });

        Route::middleware('auth:web')->group(function () {
            Route::put('password', [PasswordController::class, 'update'])->name('password.update');

            Route::any('logout', [AuthenticatedSessionController::class, 'destroy'])
                ->name('logout');
            Route::get("/reservations/count", GetFutureReserved::class)
                ->name("reservations.count");
            Route::get("/", DashboardController::class)
                ->name("dashboard");
            Route::get("/reservations/{reservation}/meeting", OnlineMeetingRoomController::class)
                ->name("reservations.meeting");
            Route::resource("/reservations", ReservationController::class);
            Route::resource("doctors", DoctorController::class);
            Route::get("doctors/{doctor}/available-times", DoctorAvailableTimesController::class)
                ->name("doctors.availableTimes");
            Route::get("times", ListTimesController::class)
                ->name("times.index");
            Route::get("/times/{id}", GetTimeController::class)
                ->name("times.show");
            Route::get("available-times", [AvailableTimeController::class, "index"])
                ->name("availableTimes.index");
            Route::post("available-times", [AvailableTimeController::class, "store"])
                ->name("availableTimes.store");
            Route::get("available-times/{availableTime}", [AvailableTimeController::class, "show"])
                ->name("availableTimes.show");
            Route::put("available-times/{availableTime}/toggle", ToggleAvailableTimeController::class)
                ->name("availableTimes.toggle");
            Route::put("available-times/{availableTime}", [AvailableTimeController::class, "update"])
                ->name("availableTimes.update");
            Route::delete("available-times/{availableTime}", [AvailableTimeController::class, "destroy"])
                ->name("availableTimes.destroy");
            Route::resource("users", UserController::class)->except(["edit", "create"]);
            Route::put("/change-password/{user}", ChangePasswordController::class)
                ->name("users.updatePassword");
            Route::post('/documents/avatar', UploadAvatarController::class)
                ->name('uploadImage');
            Route::get("/files/{file}",[FileController::class,"download"])
                ->name("download");

        });
    });
