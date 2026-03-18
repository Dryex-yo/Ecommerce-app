<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        // Gunakan with('images') agar data galeri ikut terbawa
        return Inertia::render('Products/Index', [
            'products' => Product::with('images')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048', // Foto Utama
            'gallery.*' => 'image|mimes:jpg,jpeg,png|max:2048'      // Array Galeri
        ]);

        // 1. Simpan Foto Utama (Thumbnail)
        $mainImagePath = $request->file('image')->store('products/thumbnails', 'public');

        // 2. Simpan Data Produk Utama
        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . rand(1000, 9999),
            'category' => $request->category,
            'price' => $request->price,
            'stock' => $request->stock,
            'description' => $request->description,
            'image' => $mainImagePath,
        ]);

        // 3. Simpan Foto Galeri (Maksimal 10)
        if ($request->hasFile('gallery')) {
            $galleryFiles = $request->file('gallery');
            foreach (array_slice($galleryFiles, 0, 10) as $file) {
                $path = $file->store('products/gallery', 'public');
                
                // Masukkan ke tabel product_images
                $product->images()->create([
                    'image_path' => $path
                ]);
            }
        }

        return redirect()->route('products.index')->with('message', 'Produk berhasil ditambahkan!');
    }

    public function edit(Product $product)
    {
        // Load relasi images saat edit
        return Inertia::render('Products/Edit', [
            'product' => $product->load('images')
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        // Update slug jika nama berubah
        if ($request->name !== $product->name) {
            $validated['slug'] = Str::slug($request->name) . '-' . rand(1000, 9999);
        }

        // Cek jika ada foto utama baru
        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|mimes:jpg,jpeg,png|max:2048']);
            
            // Hapus foto lama jika ada
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products/thumbnails', 'public');
        }

        $product->update($validated);

        return redirect()->route('products.index')->with('message', 'Produk diperbarui!');
    }

    public function destroy(Product $product)
    {
    try {
            // 1. Hapus Foto Galeri dari Storage
            foreach ($product->images as $img) {
                if (Storage::disk('public')->exists($img->image_path)) {
                    Storage::disk('public')->delete($img->image_path);
                }
            }

            // 2. Hapus Foto Utama dari Storage
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            // 3. Hapus Data dari Database
            // Karena kita pakai onDelete('cascade') di migration, 
            // menghapus $product otomatis menghapus $product->images di DB.
            $product->delete();

            return redirect()->route('products.index')->with('message', 'Produk dan semua foto berhasil dihapus!');
            
            } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus produk: ' . $e->getMessage());
        }
    }
}