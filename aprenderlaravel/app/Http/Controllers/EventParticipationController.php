<?php
namespace App\Http\Controllers;
use App\Models\Event;
use App\Services\EventParticipationService;
class EventParticipationController extends Controller
{
    public function __construct(
        protected EventParticipationService $service
    ) {}
    public function join(Event $event)
    {
        $this->authorize('join', $event);

        $this->service->join(auth()->user(), $event);
        return back()->with('msg', 'Você entrou no evento com sucesso!');
    }
    public function leave(Event $event)
    {
        $this->authorize('leave', $event);
        $this->service->leave(auth()->user(), $event);
        return back()->with('msg', 'Você saiu do evento.');
    }
}
