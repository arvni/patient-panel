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
        "status",
        "created_at",
        "updated_at",
    ];

    public function AcceptanceItems()
    {
        return $this->hasMany(AcceptanceItem::class);
    }

    public function Customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
