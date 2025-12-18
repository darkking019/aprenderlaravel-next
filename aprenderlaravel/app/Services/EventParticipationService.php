<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;

class EventParticipationService
{
public function join(User $user, Event $event): void
{
    if (! $user->exists) {
        throw new \LogicException('User must be persisted');
    }

    // banco
    $user->participatedEvents()->attach($event->id);

    // memória
    $events = $user->participatedEvents()->get();
    $events->push($event);

    $user->setRelation('participatedEvents', $events);
}


    public function leave(User $user, Event $event): void
    {
        $user->participatedEvents()
            ->detach($event->id);
    }
}
