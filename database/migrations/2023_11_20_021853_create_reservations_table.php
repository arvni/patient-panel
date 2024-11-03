<?php

use App\Models\Customer;
use App\Models\Time;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid("id")->primary()->index()->unique();
            $table->foreignIdFor(Customer::class)->constrained();
            $table->foreignIdFor(Time::class)->nullable()->constrained();
            $table->integer("type")->default(1);
            $table->json("information")->nullable();
            $table->timestamp("verified_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
