<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvailableTime extends Model
{
    use HasFactory;

    protected $fillable = [
        "date",
        "started_at",
        "ended_at",
        "is_active",
        "only_online"
    ];

    protected $casts = [
        "is_active" => "boolean",
        "only_online" => "boolean"
    ];

    public function scopeActive($query)
    {
        return $query->where("is_active", true);
    }

    public function scopeInPerson($query)
    {
        return $query->where("only_online", false);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function times()
    {
        return $this->hasMany(Time::class);
    }

    public function reservedTimes()
    {
        return $this->hasMany(Time::class)->whereHas("reservation", function ($q) {
            $q->verified();
        });
    }

}
