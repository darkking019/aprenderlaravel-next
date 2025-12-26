<?php

return [

    'paths' => [
        'a*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://events-platform-lrvz2r1ee-darkking019s-projects.vercel.app',
        'http://localhost:3000',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    'supports_credentials' => false,
];

