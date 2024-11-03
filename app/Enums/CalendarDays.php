<?php

namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum CalendarDays: int
{
    use InteractWithEnum;

    case sunday = 0;
    case monday = 1;
    case tuesday = 2;
    case wednesday = 3;
    case thursday = 4;
    case friday = 5;
    case saturday = 6;
}
