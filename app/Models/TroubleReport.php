<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TroubleReport extends Model
{
    protected $fillable = [
        'tr_no',
        'computer_no',
        'work_group',
        'section',
        'username',
        'date_issued',
        'computer_type',
        'computer_type_other',
        'problem_report',
        'troubleshooting_report',
        'final_recommendations',
        'item',
        'quantity',
        'unit_price',
        'total_amount',
        'photograph',
        'remarks',
        'created_by',
        'it_prepared_by',
        'it_checked_by',
        'it_approved_by',
        'user_reported_by',
        'user_checked_by',
        'user_approved_by',
    ];

    protected $casts = [
        'date_issued' => 'date:Y-m-d',
    ];

    public function createdByUser()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}