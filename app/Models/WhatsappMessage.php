<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsappMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        "MessageSid",
        "body",
        "medias",
        "status",
        "media_urls",
        "type",
    ];

    protected $casts=[
        "medias"=>"json",
        "media_urls"=>"json",
    ];
    protected  $with=[
        "Files"
    ];

    public function Customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function Files()
    {
        return $this->morphMany(File::class, "related");
    }
}
