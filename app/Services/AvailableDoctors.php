<?php
namespace App\Services;

use App\Interfaces\TimeRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class AvailableDoctors
{
    protected TimeRepositoryInterface $timeRepository;

    public function __construct(TimeRepositoryInterface $timeRepository)
    {
        $this->timeRepository = $timeRepository;
    }

    public function listDoctors($date)
    {
        $queryData = [
            "date" => [Carbon::parse($date)->startOfDay(), Carbon::parse($date)->endOfDay()],
            "disabled" => false,
            "with"=>["Doctor"],
            "orderBy" => [
                "field" => "started_at",
                "type" => "asc"
            ]
        ];
        $times = $this->timeRepository->getAllTimes($queryData);

        return [...$this->getDoctors($times)];
    }

    private function getDoctors(Collection $collection)
    {
        return $collection
            ->pluck(["doctor"])
            ->unique(function ( $item) {
                return $item->id;
            });

    }

}
