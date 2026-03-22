import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Package, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Show({ auth, product }) {
    // Fungsi Format Rupiah
    const formatIDR = (amount) => new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
    }).format(amount || 0);

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Detail - ${product.name}`} />

            {/* HEADER NAVIGATION */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Link href={route('admin.dashboard')} className="group flex items-center gap-3 text-slate-400 hover:text-slate-800 transition-all">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">Back to Dashboard</span>
                </Link>
                
                <Link href={route('admin.products.edit', product.id)} className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                    <Edit size={14} /> Edit Product Detail
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: VISUAL & GALLERY */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-50">
                        {/* Foto Utama */}
                        <div className="aspect-square rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-hidden relative group">
                            {product.image ? (
                                <img 
                                    src={`/storage/${product.image}`} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt={product.name}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                    <Package size={80} strokeWidth={1} />
                                    <p className="text-[10px] font-black text-slate-300 mt-4 uppercase">No Main Image</p>
                                </div>
                            )}
                        </div>

                        {/* Galeri Foto (Jika Ada) */}
                        {product.images && product.images.length > 0 && (
                            <div className="mt-6">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Product Gallery</p>
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((img, index) => (
                                        <div key={index} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                                            <img src={`/storage/${img.image_path}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* KOLOM KANAN: DATA & DESCRIPTION */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                            <Database size={150} />
                        </div>
                        
                        <div className="relative z-10">
                            {/* Kategori (Tipe String) */}
                            <span className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                                {product.category || 'General'}
                            </span>
                            
                            <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4 leading-tight">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center gap-6 mb-10">
                                <div className="flex items-center gap-2">
                                    {product.stock > 0 ? (
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    ) : (
                                        <AlertCircle size={16} className="text-rose-500" />
                                    )}
                                    <span className={`text-[11px] font-black uppercase tracking-tight ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {product.stock > 0 ? 'Stock Available' : 'Out of Stock'}
                                    </span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    ID: {String(product.id).padStart(5, '0')}
                                </span>
                            </div>

                            <div className="mb-10">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Product Description</p>
                                <p className="text-slate-500 leading-relaxed font-medium text-lg max-w-2xl">
                                    {product.description || 'No detailed description provided for this product.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 group hover:bg-slate-900 transition-all duration-500">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-slate-500">Market Price</p>
                                    <h3 className="text-3xl font-black text-blue-600 group-hover:text-white transition-colors tracking-tight">
                                        {formatIDR(product.price)}
                                    </h3>
                                </div>
                                
                                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inventory Stock</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className={`text-4xl font-black tracking-tighter ${product.stock > 5 ? 'text-slate-800' : 'text-rose-500'}`}>
                                            {product.stock}
                                        </h3>
                                        <span className="text-sm font-black text-slate-300 uppercase">Units</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}