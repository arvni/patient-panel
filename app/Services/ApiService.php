<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ApiService
{

    protected static function get($url)
    {
        return Http::withToken(self::getApiToken())->timeout(180)->get($url);
    }


    protected static function post($url,$data=[])
    {
        return Http::withToken(self::getApiToken())->timeout(180)->post($url,$data);
    }

    public static function getApiToken()
    {
        if (Cache::has("sanctumToken"))
            $token = decrypt(Cache::get("sanctumToken"));
        else {
            $response = Http::post(config("api.server_url") . config("api.login_path"), [
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
        $url = config("api.server_url") . config("api.report_path") . $id;
        return self::get($url);
    }
    public static function getAcceptances(User $user)
    {
        $url = config("api.server_url") . config("api.acceptances_path") . $user->mobile;
        return self::get($url);
    }

    public static function sendSms($data)
    {
        $url = config("api.server_url") . config("api.send_sms");
        return self::post($url,$data);
    }

}
