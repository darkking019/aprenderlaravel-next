<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

uses(RefreshDatabase::class);

describe('EventPolicy', function () {

    it('allows guests to view public events', function () {
        $event = Event::factory()->create(['private' => false]);

        expect(
            Gate::allows('view', $event)
        )->toBeTrue();
    });

    it('denies viewing private event for non-owner', function () {
        $user = User::factory()->create();
        $event = Event::factory()->create(['private' => true]);

        expect(
            $user->can('view', $event)
        )->toBeFalse();
    });

    it('allows owner to view private event', function () {
        $user = User::factory()->create();
        $event = Event::factory()->create([
            'private' => true,
            'user_id' => $user->id,
        ]);

        expect(
            $user->can('view', $event)
        )->toBeTrue();
    });

    it('allows authenticated user to create events', function () {
        $user = User::factory()->create();

        expect(
            $user->can('create', Event::class)
        )->toBeTrue();
    });

    it('allows only owner to update event', function () {
        $owner = User::factory()->create();
        $event = Event::factory()->create(['user_id' => $owner->id]);

        expect(
            $owner->can('update', $event)
        )->toBeTrue();
    });

    it('denies update for non-owner', function () {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $event = Event::factory()->create(['user_id' => $owner->id]);

        expect(
            $other->can('update', $event)
        )->toBeFalse();
    });

    it('allows user to leave event only if participating', function () {
        $user = User::factory()->create();
        $event = Event::factory()->create();

        $user->participatedEvents()->attach($event->id);

        expect(
            $user->can('leave', $event)
        )->toBeTrue();
    });
});
