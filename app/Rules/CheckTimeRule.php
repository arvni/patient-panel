<?php

namespace App\Rules;

use App\Models\Time;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class CheckTimeRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $time = Time::whereId($value["id"])->withCount("Reservation")->first();
        if (!$time || $time->disabled || $time->rservation_count)
            $fail("The time you selected has already been reserved.please select another time");
    }
}
