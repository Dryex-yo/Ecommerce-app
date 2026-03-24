import React, { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Star } from 'lucide-react';

export default function ProductShow({ auth, product }) {
    const [selectedImg, setSelectedImg] = useState(product.image);
    
    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        quantity: 1,
    });

    const formatIDR = (price) => new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(price);

    const addToCart = (e) => {
        e.preventDefault();
        post(route('cart.store'));
    };

    return (
        <UserLayout user={auth.user}>
            <Head title={product.name} />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Tombol Kembali */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 font-bold text-sm uppercase tracking-widest">
                    <ArrowLeft size={16} /> Kembali Belanja
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* BAGIAN KIRI: FOTO */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-xl shadow-slate-200/50">
                            <img 
                                src={`/storage/${selectedImg}`} 
                                className="w-full h-full object-cover transition-all duration-500"
                                alt={product.name} 
                            />
                        </div>
                        
                        {/* Thumbnail Galeri */}
                        {product.images?.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                <button 
                                    onClick={() => setSelectedImg(product.image)}
                                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImg === product.image ? 'border-blue-600 scale-105' : 'border-transparent'}`}
                                >
                                    <img src={`/storage/${product.image}`} className="w-full h-full object-cover" />
                                </button>
                                {product.images.map((img, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setSelectedImg(img.image_path)}
                                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImg === img.image_path ? 'border-blue-600 scale-105' : 'border-transparent'}`}
                                    >
                                        <img src={`/storage/${img.image_path}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* BAGIAN KANAN: INFO BELANJA */}
                    <div className="flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                            <Star size={12} fill="currentColor" /> Best Seller
                        </div>

                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-4xl font-black text-blue-600 tracking-tight">
                                {formatIDR(product.price)}
                            </h2>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                Stok Tersedia
                            </span>
                        </div>

                        <div className="prose prose-slate mb-10">
                            <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                {product.description || 'Produk berkualitas tinggi dengan material pilihan, cocok untuk penggunaan jangka panjang.'}
                            </p>
                        </div>

                        {/* Form Keranjang */}
                        <form onSubmit={addToCart} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-100 p-2 rounded-2xl flex items-center border border-slate-200">
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max={product.stock}
                                        value={data.quantity}
                                        onChange={e => setData('quantity', e.target.value)}
                                        className="w-16 bg-transparent border-none text-center font-black text-slate-800 focus:ring-0"
                                    />
                                </div>
                                <button 
                                    disabled={processing || product.stock <= 0}
                                    className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 disabled:bg-slate-300"
                                >
                                    <ShoppingCart size={18} /> Tambah Ke Keranjang
                                </button>
                            </div>
                        </form>

                        {/* Benefit Points */}
                        <div className="grid grid-cols-2 gap-6 mt-12 pt-12 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Garansi</p>
                                    <p className="text-sm font-bold text-slate-800">100% Original</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengiriman</p>
                                    <p className="text-sm font-bold text-slate-800">Cepat & Aman</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </UserLayout>
    );
}