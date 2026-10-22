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
        return Http::withToken(self::getApiToken())->timeout(180)->get(config("api.server_url") . $url);
    }


    protected static function post($url, $data = [])
    {
        return Http::withToken(self::getApiToken())->timeout(180)->post(config("api.server_url") . $url, $data);
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
            } else {
                abort(401);
            }
        }
        return $token;
    }

    public static function getReport($id): PromiseInterface|Response
    {
        $url = config("api.report_path") . $id;
        return self::get($url);
    }

    /**
     * Which of these acceptance items have a clinical comment, asked with HEAD so no file is sent.
     * Remembered for 10 minutes; an unanswered check counts as "no comment" and is asked again next time.
     *
     * @param array<int|string> $ids lab acceptance item ids
     * @return array<string, bool>
     */
    public static function hasClinicalComments(array $ids): array
    {
        $result = [];
        $missing = [];
        foreach ($ids as $id) {
            $known = Cache::get("clinicalComment.$id");
            if ($known === null)
                $missing[] = (string) $id;
            else
                $result[(string) $id] = $known;
        }
        if (!$missing)
            return $result;

        $token = self::getApiToken();
        $responses = Http::pool(fn($pool) => array_map(
            fn($id) => $pool->as($id)->withToken($token)->timeout(15)
                ->head(config("api.server_url") . config("api.report_path") . $id . "/clinical-comment"),
            $missing
        ));
        foreach ($missing as $id) {
            $response = $responses[$id] ?? null;
            $answered = $response instanceof Response && in_array($response->status(), [200, 404], true);
            $result[$id] = $answered && $response->status() === 200;
            if ($answered)
                Cache::put("clinicalComment.$id", $result[$id], now()->addMinutes(10));
        }
        return $result;
    }

    /** The report's clinical comment, a separate file in the LIS; 404 when there is none. */
    public static function getClinicalComment($id): PromiseInterface|Response
    {
        return self::get(config("api.report_path") . $id . "/clinical-comment");
    }

    public static function getAcceptances(Customer $user, string $nationalId)
    {
        // National ID is mandatory: results are never fetched by phone alone.
        $url = config("api.acceptances_path") . $user->mobile . "?national_id=" . urlencode($nationalId);
        return self::get($url);
    }

    public static function sendSms($data)
    {
        return self::post(config("api.send_sms"), $data);
    }

}
