<?php

namespace App\Services;

use App\Enums\ReservationType;
use App\Interfaces\TimeRepositoryInterface;
use App\Models\Doctor;
use App\Models\Time;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class AvailableDaysService
{
    protected TimeRepositoryInterface $timeRepository;

    public function __construct(TimeRepositoryInterface $timeRepository)
    {
        $this->timeRepository = $timeRepository;
    }

    public function listFutureDays(Doctor $doctor, $reservationType = null)
    {
        $now = Carbon::now("Asia/Muscat")->startOfDay();
        $end = $now->clone()->addDays(6)->endOfDay();

        $times = $this->getTimesWithinRange($doctor, $now, $end);
//        dd($times->toArray());
        $availableDays = $doctor->default_time_table ? $this->getAvailableDays($doctor->default_time_table) : [];

        $startTime = "09:00:00";
        $endTime = "17:00";
        $sessionLength = 30;
        $currentDateTime = $this->convertToDateTime($now, $startTime);

        return $this->generateOutput($currentDateTime, $end, $endTime, $startTime, $availableDays, $times, $sessionLength, $reservationType);
    }

    protected function getTimesWithinRange(Doctor $doctor, Carbon $start, Carbon $end): Collection
    {
        return Time::query()
            ->whereBetween("started_at", [$start, $end])
            ->whereHas("doctor", function ($query) use ($doctor) {
                $query->where("id", $doctor->id);
            })
            ->get();
    }

    protected function getAvailableDays(array $defaultDays): array
    {
        return collect($defaultDays)->reduce(function ($result, $daySchedule) {
            if (count($daySchedule)) {
                $result[$daySchedule[0]["day"]] = $daySchedule;
            }
            return $result;
        }, []);
    }

    protected function convertToDateTime(Carbon $date, string $time): Carbon
    {
        return Carbon::parse($date->format("Y-m-d") . " " . $time,"Asia/Muscat");
    }

    protected function checkDoctorDayTime(Carbon $day, string $time, array $availableDays, Collection $times, int $sessionLength, $type): bool
    {
        foreach ($availableDays[$day->weekday()] as $availableDay) {
            $sessionStart = Carbon::parse($time,"Asia/Muscat")->addMinute();
            $availableStart = Carbon::parse($availableDay["started_at"],"Asia/Muscat");
            $availableEnd = Carbon::parse($availableDay["ended_at"],"Asia/Muscat");
            if ($sessionStart->between($availableStart, $availableEnd)) {
                if (isset($availableDay["only_online"]) && $availableDay["only_online"] && $type == ReservationType::IN_PERSON->value) {
                    return true;
                }
                return $times->whereBetween("started_at", [$day->clone()->setTimezone("UTC")->subMinutes(2), $day->clone()->setTimezone("UTC")->addMinutes(2)])->isNotEmpty();
            }
        }
        return true;
    }

    protected function generateOutput(Carbon $currentDateTime, Carbon $end, string $endTime, string $startTime, array $availableDays, Collection $times, int $sessionLength, $type): array
    {
        $output = [];

        while ($currentDateTime->lt($this->convertToDateTime($end, $endTime))) {
            if ($currentDateTime->weekday() == 5) {
                $currentDateTime = $this->convertToDateTime($currentDateTime->clone()->addDay(), $startTime);
                continue;
            }
            $dayKey = $currentDateTime->format("D, d M");
            $startDateTime = $currentDateTime->clone();
            $endDateTime = $startDateTime->clone()->addMinutes($sessionLength);

            $output[$dayKey][] = [
                "id" => Str::random(),
                "title" => $startDateTime->format("H:i"),
                "started_at" => $startDateTime,
                "ended_at" => $endDateTime,
                "disabled" => !Arr::has($availableDays, $startDateTime->weekday()) || $this->checkDoctorDayTime($startDateTime, $startDateTime->format("H:i"), $availableDays, $times, $sessionLength, $type) || $startDateTime->lte(Carbon::now("Asia/Muscat"))
            ];

            $currentDateTime->addMinutes($sessionLength);

            if ($currentDateTime->gte($this->convertToDateTime($currentDateTime, $endTime))) {
                $currentDateTime = $this->convertToDateTime($currentDateTime->clone()->addDay(), $startTime);
            }
        }

        return $output;
    }
}
