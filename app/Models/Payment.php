<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        "amount",
        "method",
        "status",
        "information",
    ];

    protected $casts = [
        "information" => "json"
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function transaction()
    {
        return $this->morphOne(Transaction::class, "related");
    }

}
