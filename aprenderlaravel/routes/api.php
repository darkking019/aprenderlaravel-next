<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PublicEventController;
use App\Http\Controllers\EventParticipationController;
use App\Http\Controllers\MercadoPagoController;

/*
|--------------------------------------------------------------------------
| Rotas públicas
|--------------------------------------------------------------------------
*/


// Login
Route::post('/login', [LoginController::class, 'store']);

// Eventos públicos
Route::get('/public/events', [PublicEventController::class, 'index']);

// Pagamento para criar evento (FORA do auth:sanctum)
Route::post(
    '/events/create-payment',
    [MercadoPagoController::class, 'createEventPayment']
);

// Webhook do Mercado Pago (OBRIGATORIAMENTE PÚBLICO)
Route::post(
    '/mercado-pago/webhook',
    [MercadoPagoController::class, 'webhook']
);

/*
|--------------------------------------------------------------------------
| Rotas protegidas (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Usuário autenticado
    Route::get('/user', fn () => response()->json([
        'data' => auth()->user(),
    ]));

    /*
    |--------------------------------------------------------------------------
    | Eventos (CRUD)
    |--------------------------------------------------------------------------
    */
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events/event', [EventController::class, 'store']);
    Route::get('/events/event/{event}', [EventController::class, 'show']);
    Route::put('/events/event/{event}', [EventController::class, 'update']);
    Route::delete('/events/event/{event}', [EventController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Participação em eventos
    |--------------------------------------------------------------------------
    */
    Route::get('/events/event/{event}/participants', [EventParticipationController::class, 'participants']);
    Route::post('/events/event/{event}/join', [EventParticipationController::class, 'join']);
    Route::delete('/events/event/{event}/leave', [EventParticipationController::class, 'leave']);

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */
   Route::post('/logout', [LoginController::class, 'destroy']);

});
