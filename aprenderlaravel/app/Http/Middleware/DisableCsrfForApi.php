<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DisableCsrfForApi
{
    public function handle(Request $request, Closure $next)
    {
        // Desativa CSRF apenas para rotas que começam com /api
        if ($request->is('api/*')) {
            $request->session()->forget('_token'); // ou simplesmente ignora
        }

        return $next($request);
    }
}
