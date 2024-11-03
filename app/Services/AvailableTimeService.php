<?php

namespace App\Services;

use App\Enums\CalendarView;
use App\Repositories\AvailableTimeRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class AvailableTimeService
{
    protected AvailableTimeRepository $availableTimeRepository;

    public function __construct(AvailableTimeRepository $availableTimeRepository)
    {
        $this->availableTimeRepository = $availableTimeRepository;
    }

    public function listsAvailableTimes(array $requestData)
    {
        $availableTimes = $this->availableTimeRepository->getAllAvailableTimes($requestData);
        return $this->convertToEvent($availableTimes);
    }


    private function convertToEvent(Collection $collection)
    {
        return $collection->map(fn($time) => [
            "title" => $time["doctor"]["title"] . "(" . $time->started_at . "-" . $time->ended_at . ")",
            "date" => $time->date,
            "only_online" => $time->only_online,
            "started" => "$time->date $time->started_at",
            "ended" => "$time->date $time->ended_at",
            "started_at" => Carbon::parse("$time->started_at")->format("H:i"),
            "ended_at" => Carbon::parse("$time->ended_at")->format("H:i"),
            "doctor" => $time["doctor"],
            "id" => $time->id,
            "className" => $time->is_active ? ($time->only_online ? "online" : "") : "disabled",
            "is_active" => $time->is_active
        ])->toArray();
    }
}
