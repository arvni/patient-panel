<?php
namespace App\Services;

use App\Enums\CalendarView;
use App\Interfaces\TimeRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class TimeService
{
    protected TimeRepositoryInterface $timeRepository;
    public function __construct(TimeRepositoryInterface $timeRepository)
    {
        $this->timeRepository=$timeRepository;
    }

    public function getAll(array $requestData)
    {
        $availableTimes = $this->timeRepository->getAllTimes($requestData);
        return $this->convertToEvent($availableTimes);
    }


    private function convertToEvent(Collection $collection)
    {
        return $collection->map(fn($time) => [
            "title" => $time->doctor_title,
            "started" => $time->started_at,
            "ended" => $time->ended_at,
            "id" => $time->id,
            "is_online" => $time->is_online,
            "className" =>implode(" ",[$time->reservation_verified_at?"reserved":"",$time->is_online?"online":""])
        ])->toArray();
    }

}
