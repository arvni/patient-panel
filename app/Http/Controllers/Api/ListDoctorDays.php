<?php

namespace App\Http\Controllers\Api;

use App\Enums\ReservationType;
use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Services\AvailableDaysService;
use Illuminate\Http\Request;

class ListDoctorDays extends Controller
{
    protected AvailableDaysService $availableDaysService;

    public function __construct(AvailableDaysService $availableDaysService)
    {
        $this->availableDaysService = $availableDaysService;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Doctor $doctor,Request $request)
    {
        $reservationType=$request->get("type");
        return response()->json(["days" => $this->availableDaysService->listFutureDays($doctor,$reservationType)]);
    }
}
