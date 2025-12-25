<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;






class Payment extends Model
{
    protected $fillable = [
      'provider',
        'payment_id',
        'external_reference',
        'status',
        'amount',
        'payload',
    ];
protected $attributes = [
        'provider' => 'mercadopago',
    ];
    protected $casts = [
        'payload' => 'array',
    ];
}


