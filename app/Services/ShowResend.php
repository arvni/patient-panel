<?php

namespace App\Services;

use App\Models\VerificationRequest;
use Carbon\Carbon;

class ShowResend
{

    public static function check($mobile): bool
    {
        $verificationRequest = VerificationRequest::whereMobile($mobile)->first();
        return !$verificationRequest || Carbon::parse($verificationRequest->updated_at)->addMinutes(2)->isBefore(now());
    }

}
