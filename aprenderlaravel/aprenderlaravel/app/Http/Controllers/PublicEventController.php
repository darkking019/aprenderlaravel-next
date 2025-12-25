<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class PublicEventController extends Controller
{
    /**
     * Lista todos os eventos públicos
     */
    public function index()
    {
        $events = Event::where('private', false)
            ->with('user') // opcional: traz info do dono do evento
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }
}
