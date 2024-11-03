<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TimeResource;
use App\Models\Doctor;
use App\Services\DoctorTimesService;
use Illuminate\Http\Request;

class ListDoctorTimesController extends Controller
{
    protected DoctorTimesService $doctorTimesService;
    public function __construct(DoctorTimesService $doctorTimesService)
    {
        $this->doctorTimesService=$doctorTimesService;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Doctor $doctor,Request $request)
    {
        $times=$this->doctorTimesService->list($doctor,$request->all());
        return TimeResource::collection($times);
    }
}
