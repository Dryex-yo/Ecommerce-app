<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- CONTROLLERS USER ---
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController as UserOrderController;

// --- CONTROLLERS ADMIN ---
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\GlobalSearchController;

// --------------------------------------------------------------------------
// GUEST ROUTES
// --------------------------------------------------------------------------
Route::get('/', function (Request $request) {
    // Catat visitor
    DB::table('visitors')->insert([
        'ip_address' => $request->ip(),
        'user_agent' => $request->userAgent(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return Inertia::render('Welcome', [
        'products' => Product::latest()->take(10)->get(),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

Route::get('/shop', function () {
    return Inertia::render('Shop/Index', [
        'products' => Product::where('stock', '>', 0)->latest()->get(),
    ]);
})->name('shop.index');

// --------------------------------------------------------------------------   
// AUTHENTICATED ROUTES (User Biasa)
// --------------------------------------------------------------------------
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard User (Membaca role di Controller)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/shop/product/{id}', [ProductController::class, 'showCustomer'])->name('shop.product.show');
    
    Route::get('/my-orders', [UserOrderController::class, 'index'])->name('orders.index');
    Route::get('/my-orders/{id}', [UserOrderController::class, 'show'])->name('orders.show');  

    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    Route::controller(CartController::class)->group(function () {
        Route::get('/cart', 'index')->name('cart.index');
        Route::post('/cart', 'store')->name('cart.store');
        Route::patch('/cart/{id}', 'update')->name('cart.update');
        Route::delete('/cart/{id}', 'destroy')->name('cart.destroy');
        Route::post('/checkout', 'checkout')->name('cart.checkout');
    });
});

// --------------------------------------------------------------------------
// ADMIN ONLY ROUTES (Prefix: /admin, Name: admin.*)
// --------------------------------------------------------------------------
Route::middleware(['auth', 'can:admin-access'])->prefix('admin')->name('admin.')->group(function () {
    
    // --- DASHBOARD ADMIN ---
    // Penting: Agar Sidebar 'Overview' dengan route('admin.dashboard') bekerja
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // CRUD Management
    Route::resource('products', ProductController::class);
    Route::resource('categories', CategoryController::class);
    Route::delete('/product-images/{id}', [ProductController::class, 'destroyImage'])->name('product-images.destroy');
    
    // Search API (Untuk Global Search di AdminLayout)
    Route::get('/api/search', [GlobalSearchController::class, 'search'])->name('api.search');
    
    // Order Management
    Route::controller(AdminOrderController::class)->group(function () {
        Route::get('/orders', 'index')->name('orders.index');
        Route::get('/orders/{id}', 'show')->name('orders.show');
        Route::patch('/orders/{order}', 'update')->name('orders.update');
        Route::delete('/orders/{order}', 'destroy')->name('orders.destroy');
    });

    // Analytics
    Route::get('/analytics', function () {
        return Inertia::render('Admin/Analytics');
    })->name('analytics.index');

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    
    // Settings
    Route::controller(SettingController::class)->group(function () {
        Route::get('/settings', 'index')->name('settings.index');
        Route::post('/settings', 'store')->name('settings.store');
        Route::post('/settings/reset', 'reset')->name('settings.reset');
    });
    
    // Reports
    Route::controller(ReportController::class)->group(function () {
        Route::get('/reports', 'index')->name('reports.index');
        Route::get('/reports/excel', 'exportExcel')->name('reports.excel');
        Route::get('/reports/pdf', 'exportPdf')->name('reports.pdf');
    });
});

require __DIR__.'/auth.php';