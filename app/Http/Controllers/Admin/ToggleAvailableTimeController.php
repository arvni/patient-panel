<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Interfaces\AvailableTimeRepositoryInterface;
use App\Models\AvailableTime;

class ToggleAvailableTimeController extends Controller
{

    protected AvailableTimeRepositoryInterface $availableTimeRepository;

    public function __construct(AvailableTimeRepositoryInterface $availableTimeRepository)
    {
        $this->availableTimeRepository = $availableTimeRepository;
    }
    /**
     * Handle the incoming request.
     */
    public function __invoke(AvailableTime $availableTime)
    {
        if ($this->availableTimeRepository->checkNumberOfReservedTimes($availableTime)>0)
            return back()->withErrors(["availableTime"=>"You have reserved time on this range"]);
        $this->availableTimeRepository->toggleAvailableTime($availableTime);
        return back()->with(["status"=>"Successfully updated"]);
    }
}
