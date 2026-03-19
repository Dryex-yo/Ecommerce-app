<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\GlobalSearchController;

// --- GUEST ROUTES ---
Route::get('/', function (Request $request) {
    DB::table('visitors')->insert([
        'ip_address' => $request->ip(),
        'user_agent' => $request->userAgent(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return Inertia::render('Welcome', [
        'products' => Product::where('stock', '>', 0)->latest()->get(),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// --- AUTHENTICATED ROUTES (User & Admin) ---
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard Tunggal
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/shop/product/{id}', [ProductController::class, 'showCustomer'])->name('shop.product.show');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::post('/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
    
});

// --- ADMIN ONLY ROUTES ---
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    
    // CRUD Products (Cukup satu baris ini untuk semua fungsi produk)
    Route::resource('products', ProductController::class);
    
    // Route tambahan di luar resource standar
    Route::delete('/product-images/{id}', [ProductController::class, 'destroyImage'])->name('product-images.destroy');
    Route::get('/api/search', [GlobalSearchController::class, 'search'])->name('api.search');
    
    // Order Management
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');

    // Analytics, Settings, Transaction & Report
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    
    // Settings Group
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'store'])->name('settings.store');
    Route::post('/settings/reset', [SettingController::class, 'reset'])->name('settings.reset'); // Dihapus prefix /admin-nya
    
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    
    // Reports Group
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/excel', [ReportController::class, 'exportExcel'])->name('reports.excel');
    Route::get('/reports/pdf', [ReportController::class, 'exportPdf'])->name('reports.pdf');
});

require __DIR__.'/auth.php';