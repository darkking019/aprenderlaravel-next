<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Realiza o login e retorna um token API
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        // Usuário autenticado com sucesso
        $user = Auth::user();

        // Revoga tokens antigos (opcional, mas recomendado para segurança)
        $user->tokens()->delete();

        // Cria um novo token (pode dar um nome mais descritivo se quiser)
        $token = $user->createToken('events-platform-token')->plainTextToken;

        return response()->json([
            'message' => 'Login realizado com sucesso',
            'user' => $user,
            'token' => $token,               // ← Token que o frontend vai guardar
        ], 200);
    }

    /**
     * Logout - revoga o token atual
     */
    public function destroy(Request $request)
    {
        // Revoga apenas o token que fez a requisição
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso',
        ]);
    }
}