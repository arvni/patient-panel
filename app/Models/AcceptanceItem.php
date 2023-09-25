<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcceptanceItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        "server_id",
        "test",
        "status",
        "timeline",
        "report",
    ];

    protected $casts = [
        "timeline" => "json"
    ];

    public function Acceptance()
    {
        return $this->belongsTo(Acceptance::class);
    }
}
