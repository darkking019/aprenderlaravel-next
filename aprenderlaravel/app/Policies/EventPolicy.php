<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{




        /**
 * Listagem de eventos
 */
public function viewAny(?User $user): bool
{
    return true;
}



    /**
     * Público: qualquer um vê
     * Privado: só o dono
     */
    public function view(?User $user, Event $event): bool
    {
        if (! $event->private) {
            return true;
        }

        return $user && $user->id === $event->user_id;
    }

    /**
     * Usuário logado pode criar
     */
    public function create(User $user): bool
    {
        return true; // ok, mas aqui é só semântica
    }

    /**
     * Apenas o dono
     */
    public function update(User $user, Event $event): bool
    {
        return $user->id === $event->user_id;
    }

    /**
     * Entrar:
     * - evento público
     * - não é dono
     * - ainda não participa
     */
    public function join(User $user, Event $event): bool
    {
        if ($event->private) {
            return false;
        }

        if ($user->id === $event->user_id) {
            return false;
        }

        return ! $user->participatedEvents()
            ->whereKey($event->id)
            ->exists();
  
    }

    /**
     * Sair se participa
     */
    public function leave(User $user, Event $event): bool
    {
        return $user->participatedEvents()
            ->whereKey($event->id)
            ->exists();
    }

    /**
     * Apenas o dono
     */
    public function delete(User $user, Event $event): bool
    {
        return $this->update($user, $event);
    }
}



