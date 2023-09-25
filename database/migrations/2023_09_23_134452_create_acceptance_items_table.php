<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('acceptance_items', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("server_id");
            $table->foreignUuid("acceptance_id")->references("id")->on("acceptances")->cascadeOnDelete();
            $table->string("test");
            $table->enum("status", ["registering", "sampling", "processing", "reported"]);
            $table->json("timeline");
            $table->text("report")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acceptance_items');
    }
};
