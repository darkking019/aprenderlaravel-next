<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PendingEvent extends Model
{
    use HasFactory;

    /**
     * Campos que podem ser preenchidos em massa
     */
    protected $fillable = [
        'user_id',
        'data',
        'temp_image_path',
    ];

    /**
     * Casts automáticos
     */
    protected $casts = [
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
