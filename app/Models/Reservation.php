<?php

namespace App\Models;

use App\Enums\ReservationType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Reservation extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        "type",
        "verified_at",
        "information"
    ];

    protected $casts = [
        "type" => ReservationType::class,
        "information" => "json"
    ];

    protected $appends = [
        "verified"
    ];

    public function getVerifiedAttribute()
    {
        return boolval($this->verified_at);
    }

    public function Time()
    {
        return $this->belongsTo(Time::class);
    }

    public function Doctor()
    {
        return $this->hasOneThrough(Doctor::class, Time::class, "id", "id", "time_id", "doctor_id");
    }


    public function Transaction()
    {
        return $this->morphOne(Transaction::class, "related");
    }

    public function Customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function scopeVerified($query)
    {
        return $query->whereNotNull("verified_at");
    }

    public function scopeNotVerified($query)
    {
        return $query->whereNull("verified_at");
    }

    public function scopeSearch($q, $field, $search)
    {
        return $q->where("$field", "like", "%$search%");
    }
}
