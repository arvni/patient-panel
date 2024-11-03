<?php

namespace App\Rules;

use App\Services\ConvertMobileNumberService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Translation\PotentiallyTranslatedString;

class CheckMobileExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
            $mobile=ConvertMobileNumberService::convert($value);
            $validator=Validator::make(["mobile"=>$mobile],["mobile"=>"exists:customers,mobile"]);
            if ($validator->fails())
                $fail(__("messages.mobileNotFound"));
    }
}
