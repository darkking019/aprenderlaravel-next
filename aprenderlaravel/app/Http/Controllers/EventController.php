<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EventController extends Controller
{
    use AuthorizesRequests;

    /**
     * Lista os eventos do usuário autenticado (para o dashboard do Next.js)
     */
    public function index()
    {
        $events = Auth::user()->events()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $events
        ]);
    }

    /**
     * Cria um novo evento
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'date'        => 'required|date',
                'city'        => 'required|string|max:100',
                'private'     => 'required|boolean', // ← campo que seu banco usa
                'items'       => 'nullable',
                'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
            ]);

            $data = $validated;

            // Garante que items seja um JSON válido
            $data['items'] = $request->filled('items') ? $request->input('items') : '[]';

            // Upload da imagem
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $data['image'] = $request->file('image')->store('events', 'public');
            }

            // Cria o evento
            $event = Auth::user()->events()->create($data);

            return response()->json([
                'success' => true,
                'message' => 'Evento criado com sucesso!',
                'data' => $event
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao salvar evento',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mostra um evento específico
     */
    public function show(Event $event)
    {
        $this->authorize('view', $event);

        $event->load(['user', 'participants']);

        $hasJoined = Auth::check() && $event->participants()->where('user_id', Auth::id())->exists();

        return response()->json([
            'success' => true,
            'data' => $event->append('image_url'),
            'has_joined' => $hasJoined
        ]);
    }

    /**
     * Atualiza um evento
     */
    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        try {
            $validated = $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'date'        => 'required|date',
                'city'        => 'required|string|max:100',
                'private'     => 'required|boolean',
                'items'       => 'nullable',
                'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
            ]);

            $data = $validated;
            $data['items'] = $request->filled('items') ? $request->input('items') : $event->items;

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                if ($event->image) {
                    Storage::disk('public')->delete($event->image);
                }
                $data['image'] = $request->file('image')->store('events', 'public');
            }

            $event->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Evento atualizado com sucesso!',
                'data' => $event->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar evento',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Deleta um evento
     */
    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Evento excluído com sucesso!'
        ]);
    }
}