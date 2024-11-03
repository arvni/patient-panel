<?php

namespace App\Rules;

use App\Models\VerificationRequest;
use App\Services\ConvertMobileNumberService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class CheckMobileLocked implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $verificationRequest=VerificationRequest::whereMobile(ConvertMobileNumberService::convert($value))->first();
        if (optional($verificationRequest)->locked)
            $fail(__("messages.mobileLocked"));
    }
}
