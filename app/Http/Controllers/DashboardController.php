<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user(); 

        // --- 1. TAMPILAN UNTUK ADMIN ---
        if ($user->role === 'admin') {
            // Kita arahkan ke folder Admin/Dashboard.jsx
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'totalProducts'  => Product::count(),
                    'totalCustomers' => User::where('role', 'user')->count(),
                    'totalRevenue'   => (int) Order::where('status', 'completed')->sum('total_price'),
                    'totalOrders'    => Order::count(),
                    'lowStockCount'  => Product::where('stock', '<=', 5)->count(),
                ],
                
                'latestProducts' => Product::with('category')->latest()->take(5)->get(),
                'recentOrders'   => Order::with('user')->latest()->take(5)->get(),
                
                'salesChart' => Order::where('status', 'completed')
                    ->where('created_at', '>=', now()->subDays(6))
                    ->select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('SUM(total_price) as total')
                    )
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
            ]);
        }

        // --- 2. TAMPILAN UNTUK USER BIASA ---
        // Kita arahkan ke Dashboard.jsx (default user portal)
        return Inertia::render('Dashboard', [
            'myOrdersCount' => Order::where('user_id', $user->id)->count(),
            'recentActivity' => Order::where('user_id', $user->id)->latest()->take(3)->get(),
        ]);
    }
}