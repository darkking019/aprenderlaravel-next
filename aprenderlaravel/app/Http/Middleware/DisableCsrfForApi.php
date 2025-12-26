<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

class DisableCsrfForApi extends ValidateCsrfToken
{
    protected $except = [
        'api/*',
    ];
}
