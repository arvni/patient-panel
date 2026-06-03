<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        "mobile",
        "counter",
        "locked",
        "trackingCode",
        "expires_at",
        "failed_attempts"
    ];

    protected $casts = [
        "locked" => "boolean",
        "expires_at" => "datetime"
    ];
}
