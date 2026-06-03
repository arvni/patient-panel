<?php

namespace App\Models;

use App\Enums\TransactionType;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        "amount",
        "type"
    ];

    protected $casts = [
        "type" => TransactionType::class
    ];

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value, "Asia/Muscat")->format("Y-m-d H:i:s");
    }

    public function related()
    {
        return $this->morphTo();
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
