<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ApiService
{

    protected static function get($url)
    {
        return Http::withToken(self::getApiToken())->timeout(180)->get(config("api.server_url") .$url);
    }


    protected static function post($url,$data=[])
    {
        return Http::withToken(self::getApiToken())->timeout(180)->post(config("api.server_url") .$url,$data);
    }

    public static function getApiToken()
    {
        if (Cache::has("sanctumToken"))
            $token = decrypt(Cache::get("sanctumToken"));
        else {
            $response = Http::post( config("api.login_path"), [
                "email" => config("api.email"),
                "password" => config("api.password")
            ]);
            if ($response->ok()) {
                $token = $response->json("access_token");
                Cache::put("sanctumToken", encrypt($token), now()->addMinutes(120));
            }else {
                abort(401);
            }
        }
        return $token;
    }

    public static function getReport($id)
    {
        return self::get(config("api.report_path") . $id);
    }
    public static function getAcceptances(Customer $user)
    {
        return self::get(config("api.acceptances_path") . $user->mobile);
    }

    public static function sendSms($data)
    {
        return self::post(config("api.send_sms"),$data);
    }

}
