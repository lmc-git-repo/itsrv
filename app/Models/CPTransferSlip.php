<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class CPTransferSlip extends Model
{
    protected $fillable = [
    'cp_transfer_slip_no',
    'to',
    'from',
    'date',
    'equipment',
    'quantity',
    'description',
    'origin',
    'destination',
    'remarks',
    'created_by',
];

    protected $casts = [
        'date' => 'date',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}