<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlistItems = Wishlist::where('user_id', Auth::id())
            ->with('product.category') 
            ->latest()
            ->get()
            ->map(function ($item) {
                // Kita modifikasi object product-nya di sini
                if ($item->product) {
                    $item->product->image_url = $item->product->image 
                        ? asset('storage/' . $item->product->image) 
                        : asset('images/placeholder.png'); // Fallback jika tidak ada gambar
                }
                return $item;
            });

        return Inertia::render('User/Wishlist', [
            'wishlistItems' => $wishlistItems
        ]);
    }

    // app/Http/Controllers/WishlistController.php

    public function toggle(Request $request, $productId)
    {
        // Gunakan Auth::id() bukan auth()->id jika intelephense error
        $userId = \Illuminate\Support\Facades\Auth::id(); 

        $wishlist = \App\Models\Wishlist::where('user_id', $userId)
                    ->where('product_id', $productId)
                    ->first();

        if ($wishlist) {
            $wishlist->delete();
        } else {
            \App\Models\Wishlist::create([
                'user_id'    => $userId,
                'product_id' => $productId
            ]);
        }

        return back();
    }
}
