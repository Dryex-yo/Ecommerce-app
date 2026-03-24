<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminOrderController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan untuk Admin.
     */
    public function index()
    {
        // Mengambil semua order dengan relasi user (pembeli)
        $orders = Order::with('user')
            ->latest()
            ->get();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function userIndex() {
        $orders = Order::where('user_id', Auth::id())->get(); // User hanya lihat miliknya
        return Inertia::render('User/Orders/Index', [ // Arahkan ke file file JSX khusus user
            'orders' => $orders
        ]);
    }

    public function userOrders()
    {
        // Ambil data pesanan HANYA milik user yang login
        $orders = Order::where('user_id', Auth::id())
                    ->latest()
                    ->get();

        return Inertia::render('User/Orders', [
            'orders' => $orders
        ]);
    }

    /**
     * Menampilkan detail pesanan spesifik.
     */
    public function show($id)
    {
        // Kita gunakan findOrFail agar jika ID tidak ada langsung muncul 404
        // Load relasi user, items, dan produk di dalamnya
        $order = Order::with(['user', 'items.product'])->findOrFail($id);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update status pesanan (Pending, Processing, Completed, Cancelled).
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Processing,Completed,Cancelled',
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    /**
     * Opsional: Jika ingin admin bisa menghapus data pesanan
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->route('admin.orders.index')->with('success', 'Pesanan berhasil dihapus.');
    }
}