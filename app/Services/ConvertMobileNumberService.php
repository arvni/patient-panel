<?php

namespace App\Services;

class ConvertMobileNumberService
{
    public static function convert($number): string
    {
        preg_match("/^((\+|00)?968)?[279]\d{7}$/", $number, $match);
        return count($match) > 1 ? substr($match[0], strlen($match[1])) : $match[0];
    }
}
