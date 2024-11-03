<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAvailableTimeRequest;
use App\Http\Requests\UpdateAvailableTimeRequst;
use App\Interfaces\AvailableTimeRepositoryInterface;
use App\Models\AvailableTime;
use App\Services\AvailableTimeService;
use App\Services\ConvertCalendarRequestToQueryData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailableTimeController extends Controller
{
    protected AvailableTimeRepositoryInterface $availableTimeRepository;
    protected AvailableTimeService $availableTimeService;

    public function __construct(AvailableTimeRepositoryInterface $availableTimeRepository, AvailableTimeService $availableTimeService)
    {
        $this->availableTimeRepository = $availableTimeRepository;
        $this->availableTimeService = $availableTimeService;
    }

    public function index(Request $request)
    {
        $requestData = ConvertCalendarRequestToQueryData::prepareRequest($request);
        $queryData = ConvertCalendarRequestToQueryData::convert($requestData);
        $availableTimes = $this->availableTimeService->listsAvailableTimes($queryData);
        return Inertia::render("Admin/AvailableTime/Index", ["availableTimes" => $availableTimes, "request" => $requestData]);
    }

    public function store(StoreAvailableTimeRequest $request)
    {
        $this->availableTimeRepository->createAvailableTime($request->all());
        return back()->with(["status" => __("messages.successfullyAdded", ["type" => "Available Time", "title" => ""])]);
    }

    public function update(AvailableTime $availableTime, UpdateAvailableTimeRequst $request)
    {
        if ($this->availableTimeRepository->updateAvailableTime($availableTime, $request->all()))
            return back()->with(["status" => __("messages.successfullyUpdated", ["type" => "Available Time", "title" => ""])]);
        else
            return back()->withErrors(["doctor" => "Doctor at this date and time has a reserved time"]);
    }

    public function destroy(AvailableTime $availableTime)
    {
        if ($this->availableTimeRepository->deleteAvailableTime($availableTime))
            return redirect()->back()->with(["status" => __("messages.successfullyDeleted", ["type" => "Available Time", "title" => ""])]);
        else
            return back()->withErrors(["doctor" => "Doctor at this date and time has a reserved time"]);
    }

}
