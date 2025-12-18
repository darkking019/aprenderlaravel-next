<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'city' => 'required|string|max:255',
            'private' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'items' => 'nullable|array',
            'items.*' => 'string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'O título do evento é obrigatório.',
            'description.required' => 'A descrição do evento é obrigatória.',
            'date.required' => 'A data do evento é obrigatória.',
            'city.required' => 'A cidade do evento é obrigatória.',
            'image.image' => 'O arquivo deve ser uma imagem válida.',
            'image.max' => 'A imagem não pode ter mais de 2MB.',
        ];
    }
}