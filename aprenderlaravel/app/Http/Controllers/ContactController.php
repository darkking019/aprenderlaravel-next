<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;    
use App\Models\Event;


class ContactController extends Controller
{
public function contact()
{
    return view('contacts.contact');

}

}
