<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class EventParticipationService
{
    public function join(User $user, Event $event): void
    {
        if (! $user->exists) {
            throw new \LogicException('User must be persisted');
        }

        if ($user->participatedEvents()->where('event_id', $event->id)->exists()) {
            throw ValidationException::withMessages([
                'event' => 'Usuário já participa deste evento.',
            ]);
        }

        $user->participatedEvents()->attach($event->id);
    }

    public function leave(User $user, Event $event): void
    {
        $user->participatedEvents()->detach($event->id);
    }
}
