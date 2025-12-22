<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'Bem-vindo ao Events Platform! 🚀 (Teste de deploy Railway)';
});

Route::get('/pagamento/sucesso', function () {
    return 'PAGAMENTO APROVADO! 🎉';
});

Route::get('/pagamento/erro', function () {
    return 'PAGAMENTO ERRO! 😢';
});

Route::get('/pagamento/pendente', function () {
    return 'PAGAMENTO PENDENTE... Aguarde.';
});

// Se quiser ver a versão do Laravel
Route::get('/laravel-version', function () {
    return ['Laravel' => app()->version()];
});

