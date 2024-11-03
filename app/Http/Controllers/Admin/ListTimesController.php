<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ConvertCalendarRequestToQueryData;
use App\Services\TimeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListTimesController extends Controller
{
    protected $timeService;

    public function __construct(TimeService $timeService)
    {
        $this->timeService = $timeService;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $requestData = ConvertCalendarRequestToQueryData::prepareRequest($request);
        $queryDate = ConvertCalendarRequestToQueryData::convert($requestData);
        $times = $this->timeService->getAll($queryDate);
        return Inertia::render("Admin/Time/Index", ["times" => $times, "request" => $requestData]);
    }
}
