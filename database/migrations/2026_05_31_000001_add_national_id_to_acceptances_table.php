<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('acceptances', function (Blueprint $table) {
            // Which national ID (patient) this acceptance belongs to, so a
            // customer with several national IDs keeps their result sets apart.
            $table->string('national_id')->nullable()->after('customer_id')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('acceptances', function (Blueprint $table) {
            $table->dropColumn('national_id');
        });
    }
};
