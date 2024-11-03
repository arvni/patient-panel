<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TimeResource;
use App\Interfaces\TimeRepositoryInterface;

class GetTimeController extends Controller
{
    protected TimeRepositoryInterface $timeRepository;

    public function __construct(TimeRepositoryInterface $timeRepository)
    {
        $this->timeRepository = $timeRepository;
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke($id)
    {
        $time=$this->timeRepository->getTimeById($id);
        return new TimeResource($time);
    }
}
