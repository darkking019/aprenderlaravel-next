<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentstatusController extends Controller
{
    public function status(Request $request)
    {
        $payment = Payment::where(
            'external_reference',
            $request->external_reference
        )->latest()->first();

        return response()->json([
            'status' => $payment?->status ?? 'pending',
        ]);
    }
}
