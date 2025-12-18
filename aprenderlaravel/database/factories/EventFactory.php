<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'city' => $this->faker->city(),
            'date' => $this->faker->date(),
            'private' => false, // padrão público
            'user_id' => User::factory(),
        ];
    }

    public function private(): static
    {
        return $this->state(fn () => [
            'private' => true,
        ]);
    }
}


