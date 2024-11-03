<?php

use App\Http\Controllers\Api\ListDoctorDays;
use App\Http\Controllers\Api\ListDoctorsController;
use App\Http\Controllers\Api\ListDoctorTimesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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


Route::get("/doctors", ListDoctorsController::class)->name("doctors.list");
Route::get("/doctors/{doctor}/days", ListDoctorDays::class)->name("doctors.days");
Route::get("/doctors/{doctor}/times", ListDoctorTimesController::class)->name("doctors.times");


Route::any("/whatsapp/delivery", function (Request $request) {
    Log::info("delivery message", $request->all());
    return "message Status updated";
});
Route::any("/whatsapp/", function (Request $request) {
    Log::info("input message", $request->all());
    $files = [];
    $medias = [];
    $customer = \App\Models\Customer::where("mobile", substr($request->get("WaId"), 3))->first();
    if (!$customer)
        $customer = \App\Models\Customer::create(["mobile" => substr($request->get("WaId"), 3), "name" => $request->get("ProfileName")]);


    $message = \App\Models\WhatsappMessage::make([
        "MessageSid" => $request->get("MessageSid"),
        "body" => $request->get("Body"),
        "medias" => $files,
        "status" => $request->get("SmsStatus"),
        "media_urls" => $medias
    ]);
    $message->Customer()->associate($customer->id);
    $message->save();

    for ($i = 0; $i < $request->get("NumMedia"); $i++) {
        $filename = "/customers/$customer->id/files/" . Str::random();
        Storage::put(
            $filename,
            Http::withBasicAuth(config("services.twilio.sid"), config("services.twilio.token"))
                ->get($request->get("MediaUrl$i")));
        $path = storage_path("app" . $filename);
        $newFilename = $path . "." . File::guessExtension($path);
        rename($path, $newFilename);
        $medias = $request->get("MediaUrl$i");
        $file = \App\Models\File::make([
            "path" => $newFilename
        ]);
        $file->Customer()->associate($customer);
        $file->related()->associate($message);
        $file->save();
    }
    $message->update(["media_urls"=>$medias]);

    return "message Added";
});
