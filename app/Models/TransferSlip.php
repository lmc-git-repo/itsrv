<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransferSlip extends Model
{
    protected $fillable = [
        'transfer_slip_no',
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

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}