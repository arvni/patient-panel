<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "subtitle",
        "specialty",
        "image",
        "default_time_table"
    ];

    protected $casts = [
        "default_time_table" => "json"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function times()
    {
        return $this->hasMany(Time::class);
    }

    public function availableTimes()
    {
        return $this->hasMany(AvailableTime::class);
    }

    public function reservations()
    {
        return $this->hasManyThrough(Reservation::class, Time::class)->with("time");
    }
}
