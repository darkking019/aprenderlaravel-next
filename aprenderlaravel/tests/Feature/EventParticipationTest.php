<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventParticipationTest extends TestCase
{
    use RefreshDatabase;

    /** Usuário consegue entrar em evento público */
    public function test_user_can_join_event()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['is_public' => true]);

        $this->actingAs($user)
            ->post(route('events.join', $event))
            ->assertRedirect();

        $this->assertDatabaseHas('event_user', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    /** Usuário consegue sair de evento que participa */
    public function test_user_can_leave_event()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['is_public' => true]);

        $user->participatedEvents()->attach($event);

        $this->actingAs($user)
            ->delete(route('events.leave', $event))
            ->assertRedirect();

        $this->assertDatabaseMissing('event_user', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    /** Usuário não pode entrar em evento privado */
    public function test_user_cannot_join_private_event()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['is_public' => false]);

        $this->actingAs($user)
            ->post(route('events.join', $event))
            ->assertStatus(403);

        $this->assertDatabaseMissing('event_user', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    /** Usuário não autenticado não pode entrar em evento */
    public function test_guest_cannot_join_event()
    {
        $event = Event::factory()->create(['is_public' => true]);

        $this->post(route('events.join', $event))
            ->assertRedirect(route('login'));

        $this->assertDatabaseCount('event_user', 0);
    }

    /** Usuário não pode sair de evento que não participa */
    public function test_user_cannot_leave_event_they_are_not_part_of()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['is_public' => true]);

        $this->actingAs($user)
            ->delete(route('events.leave', $event))
            ->assertStatus(403);

        $this->assertDatabaseMissing('event_user', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    /** Usuário não pode entrar em evento inexistente */
    public function test_user_cannot_join_nonexistent_event()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/events/999999/join')
            ->assertStatus(404);

        $this->assertDatabaseCount('event_user', 0);
    }

    /** Usuário não pode entrar no mesmo evento duas vezes */
    public function test_user_cannot_join_same_event_twice()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['is_public' => true]);

        $this->actingAs($user)->post(route('events.join', $event));
        $this->actingAs($user)->post(route('events.join', $event))
            ->assertStatus(403);

        $this->assertDatabaseCount('event_user', 1);
    }
}
