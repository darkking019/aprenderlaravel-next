<?php

use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Support\Facades\Broadcast;

if (! function_exists('broadcast')) {
    /**
     * Broadcast the given event.
     */
    function broadcast($event = null)
    {
        return app(BroadcastManager::class)->event($event);
    }
}