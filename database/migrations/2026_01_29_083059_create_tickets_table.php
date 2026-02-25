<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_no')->nullable()->unique();
            $table->string('employee_name');
            $table->string('department');
            $table->string('category');
            $table->text('problem_description');
            $table->text('problem_solution')->nullable();
            $table->string('status')->default('Open');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};