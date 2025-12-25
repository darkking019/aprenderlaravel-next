<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Middleware\HandleCors;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {

        // Sanctum SPA
        $middleware->statefulApi();

        // CSRF desligado só para API
        $middleware->validateCsrfTokens([
            'api/*',
        ]);

        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions) {

        // 401 JSON — SEM redirect
        $exceptions->render(function (
            AuthenticationException $e,
            $request
        ) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        });

        // 403 JSON — Policy / authorize()
        $exceptions->render(function (
            AuthorizationException $e,
            $request
        ) {
            return response()->json([
                'message' => 'This action is unauthorized'
            ], 403);
        });
    })

    ->create();
