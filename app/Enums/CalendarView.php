<?php

namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum CalendarView
{
    use InteractWithEnum;

    case month;
    case day;
    case week;
    case agenda;

    static function get($case)
    {
        return match ($case) {
            self::day->name => "day",
            self::week->name => "week",
            self::agenda->name => "agenda",
            default => "month"
        };
    }
}
