<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerNationalId extends Model
{
    use HasFactory;

    protected $fillable = [
        "customer_id",
        "national_id",
        "name",
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
