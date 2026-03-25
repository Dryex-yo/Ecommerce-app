<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

// --- CONTROLLERS ---
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\Shop\ProductController as ShopProductController;
use App\Http\Controllers\Admin\{
    DashboardController as AdminDashboardController,
    CategoryController as AdminCategoryController,
    ProductController as AdminProductController,
    UserController as AdminUserController,
    AnalyticsController,
    AdminOrderController,
    SettingController,
    TransactionController,
    ReportController,
    GlobalSearchController
};

// --------------------------------------------------------------------------
// GUEST ROUTES
// --------------------------------------------------------------------------
Route::get('/', function (Request $request) {
    // Tracking visitor sederhana
    DB::table('visitors')->updateOrInsert(
            [
                'ip_address' => $request->ip(),
                'created_at' => now()->startOfDay() // Unik per hari
            ],
            [
                'user_agent' => $request->userAgent(),
                'updated_at' => now()
            ]
        );

    return Inertia::render('Welcome', [
        'products' => Product::latest()->take(10)->get(),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

Route::get('/shop', [ShopProductController::class, 'index'])->name('shop.index');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return response()->json(['message' => 'Email verified']);
})->middleware(['auth', 'signed'])->name('verification.verify');

// --------------------------------------------------------------------------   
// AUTHENTICATED ROUTES (General)
// --------------------------------------------------------------------------
    Route::middleware(['auth', 'verified'])->group(function () {
        
        // Logic Pengalihan Dashboard: 
        // Jika admin ke /admin/dashboard, jika user ke / (atau halaman lain)
    Route::get('/dashboard', function () {
        $user = Auth::user();

        // 1. Jika dia Admin, lempar ke Dashboard Admin (di folder Admin)
        if ($user && $user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        // 2. Jika dia User biasa, tampilkan file Dashboard.jsx yang ada di folder Pages
        return Inertia::render('Dashboard', [
            'user' => $user
        ]);
    })->name('dashboard');
    
    Route::get('/shop/product/{id}', [ShopProductController::class, 'show'])->name('shop.product.show');    
    Route::get('/my-orders', function () {
        return Inertia::render('User/Orders', [ // <--- Arahkan ke folder User
            'orders' => Auth::user()->orders // Atau ambil dari controller
        ]);
    })->name('orders.index');    
    
    // Profile Management
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    // Alamat
    Route::resource('addresses', AddressController::class);
    Route::patch('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
    
    // Pembayaran (Cukup store dan destroy dulu)
    Route::post('/payment-methods', [PaymentMethodController::class, 'store'])->name('payment-methods.store');
    Route::delete('/payment-methods/{id}', [PaymentMethodController::class, 'destroy'])->name('payment-methods.destroy');
    
    // Cart Management
    Route::controller(CartController::class)->group(function () {
        Route::get('/cart', 'index')->name('cart.index');
        Route::post('/cart', 'store')->name('cart.store');
        Route::patch('/cart/{id}', 'update')->name('cart.update');
        Route::delete('/cart/{id}', 'destroy')->name('cart.destroy');
        Route::post('/checkout', 'checkout')->name('cart.checkout');
    });

    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/{productId}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
});

// --------------------------------------------------------------------------
// ADMIN ONLY ROUTES
// --------------------------------------------------------------------------
// Catatan: Jika 'can:admin-access' error, ganti sementara dengan middleware custom atau cek Gate
Route::middleware(['auth', 'can:admin-access'])->prefix('admin')->name('admin.')->group(function () {
    
    // Dashboard Utama Admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Resources
    Route::resource('products', AdminProductController::class);
    Route::resource('categories', AdminCategoryController::class);
    Route::resource('users', AdminUserController::class); 
    
    // Additional Product Routes
    Route::delete('/product-images/{id}', [AdminProductController::class, 'destroyImage'])->name('product-images.destroy');
    Route::get('/api/search', [GlobalSearchController::class, 'search'])->name('api.search');
    
    // Order Management
    Route::controller(AdminOrderController::class)->group(function () {
        Route::get('/orders', 'index')->name('orders.index');
        Route::get('/orders/{id}', 'show')->name('orders.show');
        Route::patch('/orders/{order}', 'update')->name('orders.update');
        Route::delete('/orders/{order}', 'destroy')->name('orders.destroy');
    });

    // Analytics & Settings
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    
    Route::controller(SettingController::class)->group(function () {
        Route::get('/settings', 'index')->name('settings.index');
        Route::post('/settings', 'store')->name('settings.store');
        Route::post('/settings/reset', 'reset')->name('settings.reset');
    });
    
    Route::controller(ReportController::class)->group(function () {
        Route::get('/reports', 'index')->name('reports.index');
        Route::get('/reports/excel', 'exportExcel')->name('reports.excel');
        Route::get('/reports/pdf', 'exportPdf')->name('reports.pdf');
    });
});

require __DIR__.'/auth.php';