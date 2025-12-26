<?php

return [

    'paths' => [
        'api/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://events-platform-topaz.vercel.app',
        'http://localhost:3000',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],


    'max_age' => 0,

    'supports_credentials' => false,
];
