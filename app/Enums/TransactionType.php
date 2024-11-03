<?php

namespace App\Enums;

enum TransactionType: string
{
    case CREDIT = "1";
    case DEBIT = "-1";
}
