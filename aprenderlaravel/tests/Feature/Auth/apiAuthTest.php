<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Simula domínio frontend (Sanctum depende disso)
     */
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'sanctum.stateful' => ['localhost', '127.0.0.1'],
            'session.domain' => null,
        ]);
    }

    public function test_user_can_login_via_api(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // CSRF
        $this->get('/sanctum/csrf-cookie');

        // Login
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'name', 'email'],
            ]);

        $this->assertAuthenticated();
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $this->get('/sanctum/csrf-cookie');

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertGuest();
    }

    public function test_authenticated_user_can_logout_via_api(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        // CSRF
        $this->get('/sanctum/csrf-cookie');

        // Login
        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertOk();

        $this->assertAuthenticated();

        // Logout
        $response = $this->postJson('/api/logout');

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Logout realizado com sucesso',
            ]);

        $this->assertGuest();
    }
}
