<?php


namespace App\Repositories;

use App\Interfaces\AvailableTimeRepositoryInterface;
use App\Models\AvailableTime;

use App\Models\Time;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class AvailableTimeRepository implements AvailableTimeRepositoryInterface
{

    /**
     * @var Builder
     */
    private Builder $query;

    private const Session_Time = 30;


    public function __construct(AvailableTime $availableTime)
    {
        $this->query = $availableTime->newQuery();
    }

    /**
     * @param array $queryData
     * @return Builder[]|Collection
     */
    public function getAllAvailableTimes(array $queryData = [])
    {
        $this->query->with(["doctor"]);

        $this->applyFilter($queryData);
        return $this->query->get();
    }

    /**
     * @param array $queryData
     * @return int
     */
    public function countAvailableTimes(array $queryData = [])
    {
        $this->query->with(["doctor"]);
        $this->applyFilter($queryData);
        return $this->query->count();
    }


    /**
     * @param AvailableTime $availableTime
     * @return AvailableTime
     */
    public function getAvailableTimeById(AvailableTime $availableTime): AvailableTime
    {
        return $availableTime;
    }

    private function applyFilter($queryData)
    {
        if (isset($queryData["doctor"])) {
            $this->query->where("doctor_id", $queryData["doctor"]["id"]);
        }

        if (isset($queryData["date"])) {
            $this->query->whereBetween("date", $queryData["date"]);
        }

        if (isset($queryData["orderBy"])) {
            $this->query->orderBy($queryData["orderBy"]["field"], $queryData["orderBy"]["type"]);
        }
    }

    /**
     * @param AvailableTime $availableTime
     * @return bool|null
     */
    public function deleteAvailableTime(AvailableTime $availableTime): ?bool
    {
        if ($this->checkNumberOfReservedTimes($availableTime) > 0)
            return false;

        $this->deleteRelatedTimes($availableTime);
        return $availableTime->delete();
    }

    /**
     * @param array $availableTimeDetails
     * @return AvailableTime
     */
    public function createAvailableTime(array $availableTimeDetails): AvailableTime
    {
        $availableTime = $this->query->make([
            ...$availableTimeDetails,
            "date" => Carbon::parse($availableTimeDetails["date"])->toDate()
        ]);
        $availableTime->Doctor()->Associate($availableTimeDetails["doctor"]["id"]);
        $availableTime->save();
        $this->createOrUpdateTimes($availableTime);
        return $availableTime;
    }

    /**
     * @param AvailableTime $availableTime
     * @param array $newDetails
     * @return bool
     */
    public function updateAvailableTime(AvailableTime $availableTime, array $newDetails): bool
    {
        $oldDate = Carbon::parse($availableTime->date)->startOfDay();
        $newDate = Carbon::parse($newDetails["date"])->startOfDay();
        if ($oldDate->ne($newDate) && $this->checkNumberOfReservedTimes($availableTime)) {
            return false;
        }

        $oldStartedAt = Carbon::parse($availableTime->date . " " . $availableTime->started_at);
        $oldEndedAt = Carbon::parse($availableTime->date . " " . $availableTime->ended_at);
        $availableTime->fill([
            ...$newDetails,
            "date" => Carbon::parse($newDetails["date"])->format("Y-m-d")
        ]);
        if ($availableTime->isDirty()) {
            if ($this->checkNumberOfReservedTimes($availableTime, $oldStartedAt, $oldEndedAt) !== $this->checkNumberOfReservedTimes($availableTime)) {
                return false;
            }
            $this->createOrUpdateTimes($availableTime);
            return $availableTime->update();
        }
		$availableTime->Times()->update(["disabled" => !$availableTime->is_active]);
        return true;
    }

    public function toggleAvailableTime(AvailableTime $availableTime)
    {
        $availableTime->update(["is_active" => !$availableTime->is_active]);
        $availableTime->Times()->update(["disabled" => !$availableTime->is_active]);
    }

    private function createOrUpdateTimes(AvailableTime $availableTime): void
    {
        $date = Carbon::parse($availableTime->date)->format("Y-m-d");
        $startedAt = Carbon::parse($date . " " . $availableTime->started_at);
        $endedAt = Carbon::parse($date . " " . $availableTime->ended_at);
        if ($availableTime->Times()->count())
            $availableTime
                ->Times()
                ->whereNotBetween("started_at", [$startedAt, $endedAt->clone()->addMinutes(-1)])
                ->whereNotBetween("ended_at", [$startedAt->clone()->addMinute(), $endedAt])
                ->delete();
        $this->createTimes($availableTime, $startedAt, $endedAt);
    }


    private function createTimes(AvailableTime $availableTime, Carbon $start, Carbon $end): void
    {
        $tmp = $start->clone()->addMinutes(self::Session_Time);
        while ($tmp <= $end) {
            if ($this->isTimeSlotAvailable($availableTime, $start, $tmp)) {
                $this->createTime($availableTime, $start, $tmp);
            }
            $start = $tmp;
            $tmp = $start->clone()->addMinutes(self::Session_Time);
        }
        if ($availableTime->only_online)
        $availableTime->Times()->update(["is_online"=>$availableTime->only_online]);
    }

    private function deleteRelatedTimes(AvailableTime $availableTime, $oldStartedAt = null, $oldEndedAt = null)
    {
        if (count(func_get_args()) < 2) {
            $oldStartedAt = Carbon::parse($availableTime->date . " " . $availableTime->started_at);
            $oldEndedAt = Carbon::parse($availableTime->date . " " . $availableTime->ended_at);
        }
        $availableTime->Times()->where(function ($q) use ($oldEndedAt, $oldStartedAt) {
            $q->whereBetween("started_at", [$oldStartedAt, $oldEndedAt])
                ->orWhereBetween("ended_at", [$oldStartedAt, $oldEndedAt]);
        })
            ->delete();
    }

    public function checkNumberOfReservedTimes(AvailableTime $availableTime, Carbon $newStartedAt = null, Carbon $newEndedAt = null)
    {
        $query = $availableTime->ReservedTimes();
        if (count(func_get_args()) < 2) {
            $newStartedAt = Carbon::parse($availableTime->date . " " . $availableTime->started_at);
            $newEndedAt = Carbon::parse($availableTime->date . " " . $availableTime->ended_at);
        }
        $query->where(function ($q) use ($newEndedAt, $newStartedAt) {
            $q->where(function ($qu) use ($newStartedAt, $newEndedAt) {
                $qu->where("started_at", ">=", $newStartedAt)
                    ->where("started_at", "<", $newEndedAt);
            })
                ->where(function ($qu) use ($newStartedAt, $newEndedAt) {
                    $qu->where("ended_at", ">", $newStartedAt)
                        ->where("ended_at", "<=", $newEndedAt);
                });
        });
        return $query->count();
    }

    private function isTimeSlotAvailable(AvailableTime $availableTime, Carbon $start, Carbon $end): bool
    {
        return $availableTime
                ->Times()
                ->where(function ($q) use ($start, $end) {
                    $q->where(function ($query) use ($start, $end) {
                        $query->where("started_at", ">=", $start)
                            ->where("started_at", "<", $end);
                    })->where(function ($query) use ($start, $end) {
                        $query->where("ended_at", ">", $start)
                            ->where("ended_at", "<=", $end);
                    });
                })
                ->count() < 1;
    }

    private function createTime(AvailableTime $availableTime, Carbon $start, Carbon $end): void
    {
        $newTime = new Time([
            "title" => $start->format("h:i") . "-" . $end->format("h:i"),
            "started_at" => $start,
            "ended_at" => $end,
        ]);

        $newTime->doctor()->associate($availableTime->doctor_id);
        $newTime->availableTime()->associate($availableTime->id);
        $newTime->save();
    }


}
