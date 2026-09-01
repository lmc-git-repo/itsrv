<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\TicketSolution;

class Ticket extends Model
{
    protected $fillable = [
        'ticket_no',
        'employee_name',
        'department',
        'category',
        'employee_category',
        'problem_description',
        'problem_solution',
        'progress_update',
        'status',
        'assigned_to',
        'date_opened',
        'created_by',
        'resolved_by',
        'resolved_at',
        'tracking_code',
    ];

    public function creator()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function resolver()
    {
        return $this->belongsTo(
            User::class,
            'resolved_by'
        );
    }

    public function assignee()
    {
        return $this->belongsTo(
            User::class,
            'assigned_to'
        );
    }

    public function solutions()
    {
        return $this->hasMany(
            TicketSolution::class
        )->latest();
    }
}