<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acceptance extends Model
{
    use HasFactory, HasUuids;

    // Patients only ever see two states; the lab's internal stages (sampling,
    // waiting for payment, waiting for publishing...) all read as "processing".
    public const PROCESSING = "processing";
    public const REPORTED = "reported";

    public static function patientStatus(?string $labStatus): string
    {
        return strtolower(trim((string) $labStatus)) === self::REPORTED ? self::REPORTED : self::PROCESSING;
    }

    public static function isCancelled(?string $labStatus): bool
    {
        return in_array(strtolower(trim((string) $labStatus)), ["canceled", "cancelled"], true);
    }

    protected $fillable = [
        "server_id",
        "national_id",
        "status",
        "created_at",
        "updated_at",
    ];

    // Rows stored before statuses were mapped still hold lab stages.
    public function getStatusAttribute($value): string
    {
        return self::patientStatus($value);
    }

    public function acceptanceItems()
    {
        return $this->hasMany(AcceptanceItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
