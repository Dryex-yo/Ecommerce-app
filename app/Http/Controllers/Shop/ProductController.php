<?php

namespace App\Http\Controllers\Shop;
use App\Http\Controllers\Controller;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{

    public function index()
    {
        // Menggunakan ShopProductController::index
        $products = Product::with('category')->get()->map(function ($product) {
            return [
                'id'            => $product->id,
                'name'          => $product->name,
                'price'         => $product->price,
                'image'         => $product->image, // Pastikan ini sesuai kolom tabel products
                'category'      => $product->category,
                'is_wishlisted' => Auth::check() 
                    ? Auth::user()->wishlists()->where('product_id', $product->id)->exists() 
                    : false,
            ];
        });

        return Inertia::render('Shop/Index', [
            'products' => $products
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['images', 'category'])->findOrFail($id);

            return Inertia::render('Shop/ProductShow', [
                'product' => $product
            ]);
    }
}