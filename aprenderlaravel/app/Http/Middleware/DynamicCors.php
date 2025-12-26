<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DynamicCors
{
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = [
            'http://localhost:3000',
            // aqui você pode colocar outros domínios confiáveis
        ];

        // Detecta domínio do front
        $origin = $request->headers->get('origin');

        // Permite qualquer subdomínio do Vercel
        if ($origin && (str_contains($origin, '.vercel.app') || in_array($origin, $allowedOrigins))) {
            $headers = [
                'Access-Control-Allow-Origin' => $origin,
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Expose-Headers' => 'Authorization',
            ];

            // Responde OPTIONS (preflight) automaticamente
            if ($request->getMethod() === 'OPTIONS') {
                return response()->json('OK', 200, $headers);
            }

            $response = $next($request);

            foreach ($headers as $key => $value) {
                $response->headers->set($key, $value);
            }

            return $response;
        }

        return $next($request);
    }
}

