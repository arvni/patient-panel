<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Services\AvailableTimeService;
use App\Services\ConvertCalendarRequestToQueryData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorAvailableTimesController extends Controller
{
    protected AvailableTimeService $availableTimeService;

    public function __construct(AvailableTimeService $availableTimeService)
    {
        $this->availableTimeService = $availableTimeService;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Doctor $doctor, Request $request)
    {
        $request->merge(["doctor" => $doctor->toArray()]);
        $requestData = ConvertCalendarRequestToQueryData::prepareRequest($request);
        $queryData=ConvertCalendarRequestToQueryData::convert($requestData);
        $availableTimes = $this->availableTimeService->listsAvailableTimes($queryData);
        return Inertia::render("Admin/AvailableTime/Index", [
            "availableTimes" => $availableTimes,
            "request" => $requestData,
            "doctor" => $doctor->toArray()
        ]);
    }
}
