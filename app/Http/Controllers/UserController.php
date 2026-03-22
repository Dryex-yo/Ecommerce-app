<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; 

class OrderController extends Controller
{
    public function index(Request $request) 
    {
        // Pake $request->user() lebih disukai VS Code dan lebih aman
        $orders = $request->user()->orders()
            ->with(['items.product'])
            ->latest()
            ->get();

        return Inertia::render('Order/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Request $request, $id) // <-- Tambahkan Request
    {
        $order = $request->user()->orders()
            ->with(['items.product']) // Sesuaikan relasi (cek apakah shipping_address ada di model)
            ->findOrFail($id);

        return Inertia::render('Order/Show', [
            'order' => $order
        ]);
    }
}