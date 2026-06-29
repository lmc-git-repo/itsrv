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
            $table->string('tracking_code')->nullable()->unique();
            $table->string('employee_name');
            $table->string('department');
            $table->string('category');
            $table->string('employee_category')->nullable();
            $table->text('problem_description');
            $table->date('date_opened');
            $table->text('problem_solution')->nullable();
            $table->text('progress_update')->nullable();
            $table->string('status')->default('Open');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};