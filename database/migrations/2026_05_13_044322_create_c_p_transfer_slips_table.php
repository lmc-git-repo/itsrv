<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('c_p_transfer_slips', function (Blueprint $table) {
            $table->id();
            $table->string('cp_transfer_slip_no')->nullable()->unique();
            $table->string('to');
            $table->string('from');
            $table->date('date');
            $table->string('equipment');
            $table->text('quantity')->nullable();
            $table->text('description')->nullable();
            $table->text('origin')->nullable();
            $table->text('destination')->nullable();
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('c_p_transfer_slips');
    }
};