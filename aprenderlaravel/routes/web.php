<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\EventParticipationController;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

/*
|--------------------------------------------------------------------------
| Dashboard (Breeze espera isso)
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', fn () => 'dashboard')
    ->middleware(['auth'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile (Breeze padrão)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // profile page
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    // update profile
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    // delete account
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    // update password (TESTES DEPENDEM DISSO)
   
});

/*
|--------------------------------------------------------------------------
| Events participation
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::post('/events/{event}/join', [EventParticipationController::class, 'join'])
        ->name('events.join');

    Route::delete('/events/{event}/leave', [EventParticipationController::class, 'leave'])
        ->name('events.leave');
});

/*
|--------------------------------------------------------------------------
| Auth routes (login, register, etc)
|--------------------------------------------------------------------------
*/



Route::middleware('auth')->group(function () {
    Route::put('/password', [PasswordController::class, 'update'])
        ->name('password.update');
});





require __DIR__.'/auth.php';

