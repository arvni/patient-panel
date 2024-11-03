<?php


namespace App\Repositories;

use App\Enums\ReservationType;
use App\Interfaces\TimeRepositoryInterface;
use App\Models\Time;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class TimeRepository implements TimeRepositoryInterface
{

    /**
     * @var Builder
     */
    private Builder $query;

    private int $SessionTime = 30;

    public function __construct(Time $time)
    {
        $this->query = $time->newQuery();
    }

    /**
     * @param array $queryData
     * @return Builder[]|Collection
     */
    public function getAllTimes(array $queryData = [])
    {
        $this->query
            ->withAggregate("Doctor", "title")
            ->withAggregate("Reservation", "verified_at");

        if (isset($queryData["doctor"])) {
            $this->query->where("doctor_id", $queryData["doctor"]["id"]);
        }

        if (isset($queryData["date"])) {
            $this->query->whereBetween("started_at", $queryData["date"]);
        }

        if (isset($queryData["type"])) {
            if ((int)$queryData["type"] === ReservationType::IN_PERSON->value)
                $this->query->whereNot("is_online", true);
        }

        if (isset($queryData["orderBy"])) {
            $this->query->orderBy($queryData["orderBy"]["field"], $queryData["orderBy"]["type"]);
        }
        return $this->query->get();
    }


    /**
     * @param $id
     * @return Time
     */
    public function getTimeById($id): Time
    {
        return Time::where("id", $id)->with(["Doctor", "Reservation.Customer", "Reservation.Transaction"])->first();
    }

    /**
     * @param Time $time
     * @return bool|null
     */
    public function deleteTime(Time $time): ?bool
    {
        $this->deleteRelatedTimes($time);
        return $time->delete();
    }

    /**
     * @param array $timeDetails
     * @return Time
     */
    public function createTime(array $timeDetails): Time
    {
        $time = $this->query->make([
            ...$timeDetails,
            "date" => Carbon::parse($timeDetails["date"])->toDate()
        ]);
        $time->Doctor()->Associate($timeDetails["doctor"]["id"]);
        $time->save();
        $this->createOrUpdateTimes($time);
        return $time;
    }

    /**
     * @param Time $time
     * @param array $newDetails
     * @return bool
     */
    public function updateTime(Time $time, array $newDetails)
    {
        $oldDate = $time->date;
        $oldStartedAt = Carbon::parse($time->date . " " . $time->started_at);
        $oldEndedAt = Carbon::parse($time->date . " " . $time->ended_at);
        $time->fill($newDetails);
        if ($time->isDirty()) {
            $time->update();
            $this->createOrUpdateTimes($time, $oldDate, $oldStartedAt, $oldEndedAt);
        }
        return $time;
    }

    private function createOrUpdateTimes(Time $time, $oldStartedAt = null, $oldEndedAt = null)
    {
        $doctor = $time->Doctor;
        if (count(func_get_args()) > 1) {
            $this->deleteRelatedTimes($doctor, $time, $oldStartedAt, $oldEndedAt);
        }
        $date = Carbon::parse($time->date)->format("Y-m-d");

        $start = Carbon::parse($date . " " . $time->started_at);
        $tmp = $start->clone()->addMinutes($this->SessionTime);
        $end = Carbon::parse($date . " " . $time->ended_at);
        while ($tmp <= $end) {
            $newTime = new Time([
                "title" => $start->format("h:i") . " " . $tmp->format("h:i"),
                "started_at" => $start,
                "ended_at" => $tmp,
            ]);
            $newTime->Doctor()->associate($doctor->id);
            $newTime->save();
            $start = $tmp;
            $tmp = $start->clone()->addMinutes($this->SessionTime);
        }
    }

    private function deleteRelatedTimes($time, $oldStartedAt = null, $oldEndedAt = null)
    {
        $doctor = $time->Doctor;
        if (count(func_get_args()) < 2) {
            $oldStartedAt = Carbon::parse($time->date . " " . $time->started_at);
            $oldEndedAt = Carbon::parse($time->date . " " . $time->ended_at);
        }
        Time::whereHas("Doctor", function ($q) use ($doctor) {
            $q->where("id", $doctor->id);
        })
            ->where(function ($q) use ($oldEndedAt, $oldStartedAt) {
                $q->whereBetween("started_at", [$oldStartedAt, $oldEndedAt])
                    ->orWhereBetween("ended_at", [$oldStartedAt, $oldEndedAt]);
            })
            ->delete();
    }
}
