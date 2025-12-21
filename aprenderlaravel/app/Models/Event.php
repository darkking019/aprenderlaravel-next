<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\User;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'date',
        'city',
        'private',
        'image',
        'items',
        'user_id',
    ];

    protected $casts = [
        'items'   => 'array',
        'private' => 'boolean',
        'date'    => 'date', // troque pra datetime se houver hora
    ];

    /**
     * Dono do evento
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Participantes do evento
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_user')
            ->withTimestamps();
    }

    /**
     * Verifica se um usuário participa do evento
     */
    public function hasUser(User $user): bool
    {
        return $this->participants()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Scope de busca
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('city', 'like', "%{$search}%");
        });
    }
}




