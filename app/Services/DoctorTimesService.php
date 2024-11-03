<?php

namespace App\Services;

use App\Interfaces\TimeRepositoryInterface;
use App\Models\Doctor;
use Carbon\Carbon;

class DoctorTimesService
{
    protected TimeRepositoryInterface $timeRepository;

    public function __construct(TimeRepositoryInterface $timeRepository)
    {
        $this->timeRepository = $timeRepository;
    }

    public function list(Doctor $doctor, array $requestData)
    {
        $queryData["date"] = [
            Carbon::parse($requestData["date"])->startOfDay(),
            Carbon::parse($requestData["date"])->endOfDay(),
        ];
        $queryData["doctor"] = ["id" => $doctor->id];
        return $this->timeRepository->getAllTimes($queryData);
    }

}
