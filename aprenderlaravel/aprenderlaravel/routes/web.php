<?php
use Illuminate\Support\Facades\Route;


Route::get('/pagamento/sucesso', fn () => 'PAGAMENTO APROVADO');
Route::get('/pagamento/erro', fn () => 'PAGAMENTO ERRO');
Route::get('/pagamento/pendente', fn () => 'PAGAMENTO PENDENTE');



Route::get('/', fn () => ['Laravel' => app()->version()]);





