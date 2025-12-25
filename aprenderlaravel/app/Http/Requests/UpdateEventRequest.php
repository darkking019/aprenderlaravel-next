<?php

namespace App\Http\Requests;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Event $event */
        $event = $this->route('event');

        return $event && auth()->id() === $event->user_id;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'city' => 'required|string|max:255',
            'private' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'items' => 'nullable|array',
            'items.*' => 'string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            // mesmas do Store
        ];
    }
}