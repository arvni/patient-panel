<?php

namespace App\Services;

use App\Enums\CalendarView;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ConvertCalendarRequestToQueryData
{
    public static function convert(array $requestData)
    {
        $queryData = [];
        if (isset($requestData["doctor"])) {
            $queryData["doctor"] = $requestData["doctor"];
        }
        $queryData["date"] = self::convertDate($requestData);
        return $queryData;
    }

    public static function convertDate(array $requestData): array
    {
        $date = Carbon::parse($requestData["date"] ?? "");
        if ($requestData["view"] !== "agenda") {
            $queryData = [$date->clone()->startOf($requestData["view"]), $date->clone()->endOf($requestData["view"])];
        } else
            $queryData = [$date, $date->clone()->addMonth(),];
        return $queryData;
    }

    public static function prepareRequest(Request $request)
    {
        $requestData = $request->all();
        $res = [
            "date" => Carbon::parse($requestData["date"] ?? "")->format("Y-m-d"),
            "view" => CalendarView::get($requestData["view"] ?? "month")];
        if (isset($requestData["doctor"])) {
            $res["doctor"] = $requestData["doctor"];
        }
        return $res;
    }

}
