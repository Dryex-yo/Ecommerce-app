<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:card,ewallet',
            'brand' => 'required|string', // Visa, DANA, OVO, dll
            'last4' => 'nullable|string|size:4', // Hanya untuk kartu
            'phone_number' => 'nullable|string', // Hanya untuk ewallet
            'exp_month' => 'nullable|string',
            'exp_year' => 'nullable|string',
        ]);

        $request->user()->paymentMethods()->create($validated);

        return back()->with('success', 'Metode pembayaran berhasil ditautkan!');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        $user->paymentMethods()->findOrFail($id)->delete();
        
        return back();
    }
}