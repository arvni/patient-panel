<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Time extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "started_at",
        "ended_at",
        "disabled",
        "is_online",
        "price"
    ];

    protected $casts=[
        "disabled"=>"boolean",
        "IS_ONLINE"=>"boolean",
    ];


    public function scopeInPerson($query)
    {
        return $query->where("is_online",false);
    }

    public function Doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function AvailableTime()
    {
        return $this->belongsTo(AvailableTime::class);
    }

    public function Reservation()
    {
        return $this->hasOne(Reservation::class);
    }

    public function scopeActive($query)
    {
        return $query->where("disabled", false);
    }
}
