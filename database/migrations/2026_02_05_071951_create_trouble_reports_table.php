// create_trouble_reports_table.php
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
        Schema::create('trouble_reports', function (Blueprint $table) {
            $table->id();

            // Auto increment Trouble Report No. (you can display as TR-0001 format in UI)
            $table->string('tr_no')->unique();

            $table->string('computer_no')->nullable();
            $table->string('work_group')->nullable();
            $table->string('section')->nullable();
            $table->string('username')->nullable();
            $table->date('date_issued')->nullable();

            /* ✅ UPDATED: computer_type + others */
            $table->string('computer_type')->nullable();
            $table->string('computer_type_other')->nullable();

            $table->text('problem_report')->nullable();
            $table->text('troubleshooting_report')->nullable();

            /* ✅ INSERTED ONLY: final recommendations mirrors troubleshooting report */
            $table->text('final_recommendations')->nullable();

            /* ✅ INSERTED ONLY: estimate cost info */
            $table->string('item')->nullable();
            $table->integer('quantity')->nullable();
            $table->decimal('unit_price', 10, 2)->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();

            // store file path
            $table->string('photograph')->nullable();

            $table->text('remarks')->nullable();

            // created by logged in user
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trouble_reports');
    }
};