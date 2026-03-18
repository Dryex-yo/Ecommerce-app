<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    // Menentukan kolom mana saja yang boleh diisi secara massal
    protected $fillable = [
        'product_id', 
        'image_path'
    ];

    /**
     * Relasi Balik ke Product
     * Setiap satu foto galeri hanya dimiliki oleh satu produk.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}