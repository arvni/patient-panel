<?php

namespace App\Rules;

use App\Models\AvailableTime;
use App\Models\Doctor;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class AvailableTimeUniqueness implements DataAwareRule, ValidationRule
{
    /**
     * All the data under validation.
     *
     * @var array<string, mixed>
     */
    protected array $data = [];

    /**
     * Run the validation rule.
     *
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->hasAnotherAvailableTime()) {
            $fail("Doctor has another available time that has conflict with this ");
        }
    }

    public function setData(array $data)
    {
        $this->data = [...$data, "availableTime" => request()->route()->parameter("availableTime")];
    }

    private function hasAnotherAvailableTime()
    {
        $doctor = Doctor::where("id", $this->data["doctor"]["id"])->first();
        $date = Carbon::parse($this->data["date"])->toDate();
        $start = Carbon::parse($this->data["started_at"])->toTimeString();
        $end = Carbon::parse($this->data["ended_at"])->toTimeString();
        $query = $doctor
            ->AvailableTimes()
            ->whereDate("date", "=", $date)
            ->where(function ($qu)use($start,$end){
                $qu->where(function ($q) use ($start, $end) {
                    $q->where(function ($qu) use ($start, $end) {
                        $qu->where("ended_at", ">", $start)
                            ->where("ended_at", "<=", $end);
                    })
                        ->orWhere(function ($qu) use ($start, $end) {
                            $qu->where("started_at", ">=", $start)
                                ->where("started_at", "<", $end);
                        });
                })
                    ->orWhere(function ($q) use ($start,$end){
                        $q->where("started_at", "<=", $start)
                            ->where("ended_at", ">=", $end);
                    });
            });
        if (!empty($this->data["availableTime"]))
            $query->whereNot("id", $this->data["availableTime"]["id"]);
        return $query->count();
    }
}
