<?php

namespace App\Services;

use App\Interfaces\TimeRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Http;

class RoomsService
{
    public static $APP_ID = "6616fb5b851999c9150332a7";
    public static $APP_Key = "qeJuJusuRuraEuTe9eRuSeeudupaauPese7a";
    public static $server = "https://api.enablex.io/video";
    public static $addRoom = "/v2/rooms/";

    public static function listRooms()
    {
        return Http::withBasicAuth(self::$APP_ID,self::$APP_Key)->get(self::$server.self::$addRoom)->json("rooms");
    }

    public static function addRoom($data)
    {
        return Http::withBasicAuth(self::$APP_ID,self::$APP_Key)->post(self::$server.self::$addRoom,$data)->json()["room"];
    }

    public static function getRoom($roomId)
    {
        return Http::withBasicAuth(self::$APP_ID,self::$APP_Key)->get(self::$server.self::$addRoom.$roomId)->json();
    }

    public static function joinRoom($roomId,$data)
    {
        return Http::withBasicAuth(self::$APP_ID,self::$APP_Key)
            ->post(self::$server.self::$addRoom.$roomId."/tokens",$data)
            ->json("token");
    }

    public static function getRoomUsers($roomId)
    {
        return Http::withBasicAuth(self::$APP_ID,self::$APP_Key)->get(self::$server.self::$addRoom.$roomId."/users")->json();
    }

    public static function updateRoom()
    {

    }


    public static function deleteRoom($roomId)
    {

    }
}
