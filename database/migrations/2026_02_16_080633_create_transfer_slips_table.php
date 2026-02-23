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
        Schema::create('transfer_slips', function (Blueprint $table) {
            $table->id();

            $table->string('transfer_slip_no')->unique();
            $table->string('to');
            $table->string('from');
            $table->date('date');
            $table->string('equipment');
            $table->text('quantity'); // ✅ CHANGED
            $table->text('description')->nullable();
            $table->string('origin')->nullable();
            $table->string('destination')->nullable();
            $table->string('remarks')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfer_slips');
    }
};