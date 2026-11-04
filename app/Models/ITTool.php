<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ITTool extends Model
{
    protected $table = 'it_tools';

    protected $fillable = [
        'name',
        'category',
        'icon',
        'url',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}