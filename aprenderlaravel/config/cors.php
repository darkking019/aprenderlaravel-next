<?php

return [
    'paths' => ['api/*', 'login', 'logout'],

    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], 
    'allowed_headers' => ['Authorization', 'Content-Type', 'Accept'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, 
];

