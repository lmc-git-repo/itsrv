<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Ticket extends Model
{
    protected $fillable = [
        'ticket_no',
        'employee_name',
        'department',
        'category',
        'problem_description',
        'problem_solution',
        'status',
        'date_opened',
        'created_by',
        'resolved_by',
        'resolved_at',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function resolver()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}