<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'mobile',
        'last_login',
        'last_otp_request',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_login' => 'datetime',
        'last_opt_request' => 'datetime',
    ];

    public function Reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function Tranactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function Payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function WhatsappMessages()
    {
        return $this->hasMany(WhatsappMessage::class);
    }

    public function Files()
    {
        return $this->hasMany(File::class);
    }
    public function Acceptances()
    {
        return $this->hasMany(Acceptance::class);
    }
}
