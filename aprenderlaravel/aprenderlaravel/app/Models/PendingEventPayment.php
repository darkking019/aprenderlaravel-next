<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PendingEventPayment extends Model




{
    use HasFactory;

    /**
     * Campos que podem ser preenchidos em massa
     */
    protected $fillable = [
        'user_id',
        'data',
        'temp_image_path', 'external_reference',
        'payment_id',
        'status',
        'amount',
        'mp_payload',
    ];

    /**
     * Casts automáticos
     */


    protected $casts = [
        'mp_payload' => 'array',
        'data' => 'array',
    ];

    /**
     * Relacionamento com usuário
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
