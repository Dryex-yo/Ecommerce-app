<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;


class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->get();
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
        'categories' => Category::all()
    ]);

    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_name' => 'required|string|max:255', // Kita terima Nama Kategori sebagai string
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:5120',
            'gallery.*' => 'image|mimes:jpg,jpeg,png|max:5120'
        ]);

        // LOGIKA OTOMATIS KATEGORI
        // Cari kategori berdasarkan nama, jika tidak ketemu, buat baru + slug-nya
        $category = Category::firstOrCreate(
            ['name' => $request->category_name],
            ['slug' => Str::slug($request->category_name)]
        );

        $mainImagePath = $request->file('image')->store('products/thumbnails', 'public');

        $product = Product::create([
            'name' => $request->name, // Perbaikan: Ambil dari name produk
            'slug' => Str::slug($request->name) . '-' . rand(1000, 9999),
            'category_id' => $category->id, // Gunakan ID kategori yang baru dibuat/ditemukan
            'price' => $request->price,
            'stock' => $request->stock,
            'description' => $request->description,
            'image' => $mainImagePath,
        ]);

        // ... (logic gallery tetap sama)
        if ($request->hasFile('gallery')) {
            foreach (array_slice($request->file('gallery'), 0, 10) as $file) {
                $path = $file->store('products/gallery', 'public');
                $product->images()->create(['image_path' => $path]);
            }
        }

        return redirect()->route('admin.products.index')->with('message', 'Produk berhasil ditambahkan!');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load('images'),
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:6000',
            'gallery.*' => 'image|mimes:jpg,jpeg,png|max:6000'
        ]);

        // Samakan logic dengan store
        $category = Category::firstOrCreate(
            ['name' => $request->category_name],
            ['slug' => Str::slug($request->category_name)]
        );

        $data = [
            'name' => $request->name,
            'category_id' => $category->id, // Simpan ID kategorinya
            'price' => $request->price,
            'stock' => $request->stock,
            'description' => $request->description,
        ];

        // ... (rest of the code for slug and image processing)
        if ($request->name !== $product->name) {
            $data['slug'] = Str::slug($request->name) . '-' . rand(1000, 9999);
        }

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products/thumbnails', 'public');
        }

        $product->update($data);
        
        // ... (gallery logic remains the same)
        
        return redirect()->route('admin.products.index')->with('message', 'Produk diperbarui!');
    }

    public function destroy(Product $product)
    {
        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('admin.products.index')->with('message', 'Produk berhasil dihapus!');
    }

    public function destroyImage($id)
    {
        $image = ProductImage::findOrFail($id);

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('message', 'Foto galeri berhasil dihapus');
    }

    public function reorderImages(Request $request)
{
    $request->validate([
        'images' => 'required|array',
        'images.*.id' => 'required|exists:product_images,id',
        'images.*.sort_order' => 'required|integer',
    ]);

    foreach ($request->images as $item) {
        ProductImage::where('id', $item['id'])->update([
            'sort_order' => $item['sort_order']
        ]);
    }

    return back()->with('message', 'Urutan galeri diperbarui!');
}
}