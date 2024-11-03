<?php
namespace App\Services;
use App\Rules\CheckMobileLocked;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CheckMobile{

    /**
     * @param $mobile
     * @throws ValidationException
     */
    public static function check($mobile){

        $validator=Validator::make([
            "mobile"=>$mobile
        ],[
            "mobile"=>new CheckMobileLocked()
        ]);
        if ($validator->fails())
            throw ValidationException::withMessages(["mobile"=>__("messages.mobileLocked")]);

    }
}
