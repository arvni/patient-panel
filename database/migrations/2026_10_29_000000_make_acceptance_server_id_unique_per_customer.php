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
            // A lab acceptance can belong to several customers (e.g. family members
            // who added the same national ID), so it is unique per customer only.
            $table->unique(['customer_id', 'server_id']);
            $table->dropUnique(['server_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('acceptances', function (Blueprint $table) {
            $table->unique('server_id');
            $table->dropUnique(['customer_id', 'server_id']);
        });
    }
};
