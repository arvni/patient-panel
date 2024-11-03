<?php
namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum CalendarNavigateType:int
{
    use InteractWithEnum;
    case TODAY=0;
    case PREV=-1;
    case NEXT=1;
}
