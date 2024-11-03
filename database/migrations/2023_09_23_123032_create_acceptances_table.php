<?php

use App\Models\Customer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('acceptances', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignIdFor(Customer::class)->constrained()->cascadeOnDelete();
            $table->unsignedInteger("server_id")->unique();
            $table->string("status");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acceptances');
    }
};
