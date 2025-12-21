<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\EventParticipationService;
use Illuminate\Http\JsonResponse;

class EventParticipationController extends Controller
{
    public function __construct(
        protected EventParticipationService $service
    ) {}

    /**
     * Lista participantes do evento
     */
    public function participants(Event $event): JsonResponse
    {
        $this->authorize('view', $event);

        $event->load('participants');

        return response()->json([
            'data' => $event->participants,
        ]);
    }

    /**
     * Entrar no evento
     */
    public function join(Event $event): JsonResponse
    {
        $this->authorize('join', $event);

        $this->service->join(auth()->user(), $event);

        return response()->json([
            'message' => 'Você entrou no evento com sucesso',
        ]);
    }

    /**
     * Sair do evento
     */
    public function leave(Event $event): JsonResponse
    {
        $this->authorize('leave', $event);

        $this->service->leave(auth()->user(), $event);

        return response()->json([
            'message' => 'Você saiu do evento com sucesso',
        ]);
    }
}
