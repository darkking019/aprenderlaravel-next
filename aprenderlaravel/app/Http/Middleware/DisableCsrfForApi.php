<?php
// app/Http/Middleware/DisableCsrfForApi.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DisableCsrfForApi
{
    public function handle(Request $request, Closure $next)
    {
        // Ignora completamente qualquer verificação de CSRF
        $request->attributes->set('csrf_token_skipped', true);

        return $next($request);
    }
}