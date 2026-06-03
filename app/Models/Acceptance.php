<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acceptance extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        "server_id",
        "national_id",
        "status",
        "created_at",
        "updated_at",
    ];

    public function acceptanceItems()
    {
        return $this->hasMany(AcceptanceItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
