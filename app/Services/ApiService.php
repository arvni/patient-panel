<?php

namespace App\Services;

use App\Models\Customer;
use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ApiService
{

    protected static function get($url): PromiseInterface|Response
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
            $response = Http::post( config("api.server_url") .config("api.login_path"), [
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

    public static function getReport($id): PromiseInterface|Response
    {
        $url=Str::replace("{acceptance}",$id,config("api.report_path") . $id);
        return self::get($url);
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
