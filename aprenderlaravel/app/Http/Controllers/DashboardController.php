<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Event;

class DashboardController extends Controller
{
   public function dashboard()
{
    $user = auth()->user();
    $createdEvents = Event::where('user_id', $user->id)
        ->latest()
        ->get();
    $participatedEvents = Event::whereHas('participants', function ($q) use ($user) {
        $q->where('user_id', $user->id);
    })
    ->latest()
    ->get();
    return view('events.dashboard', compact('createdEvents', 'participatedEvents'));
}
    
}
