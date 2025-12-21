<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ❌ Remove rotas automáticas do Fortify
        Fortify::ignoreRoutes();

        // ✅ DEFINE O RATE LIMITER DO LOGIN (OBRIGATÓRIO)
       RateLimiter::for('login', function (Request $request) {
    $email = (string) $request->input('email');

    return Limit::perMinute(5)->by($email.$request->ip());
});

    }
}
