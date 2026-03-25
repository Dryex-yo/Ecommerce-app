import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Wishlist({ auth, wishlistItems = [] }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Wishlist</h2>}
        >
            <Head title="Wishlist" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {!wishlistItems || wishlistItems.length === 0 ? (
                            <div className="text-center py-12">
                                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-600 mb-4">Wishlist Anda masih kosong.</p>
                                <Link 
                                    href={route('shop.index')} 
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    <ShoppingBag size={18} />
                                    Mulai Belanja
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 text-sm text-gray-600">
                                    Total: <strong>{wishlistItems.length} produk</strong>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {wishlistItems.map((item) => (
                                        <div key={item.id} className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col h-full">
                                            <div className="relative bg-gray-100 h-48 overflow-hidden">
                                                <img 
                                                    src={item.product?.image_url} 
                                                    alt={item.product?.name} 
                                                    className="w-full h-full object-cover hover:scale-110 transition"
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = '/images/placeholder.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="font-bold text-sm mb-2 line-clamp-2">{item.product?.name}</h3>
                                                <p className="text-lg font-bold text-blue-600 mb-4">Rp {parseInt(item.product?.price).toLocaleString('id-ID')}</p>
                                                <div className="flex gap-2 mt-auto">
                                                    <Link 
                                                        href={route('shop.product.show', item.product?.id)} 
                                                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-center text-sm font-semibold hover:bg-blue-100 transition"
                                                    >
                                                        Lihat
                                                    </Link>
                                                    <Link 
                                                        href={route('wishlist.toggle', item.product_id)} 
                                                        method="post" 
                                                        as="button"
                                                        className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm font-semibold hover:bg-red-100 transition"
                                                    >
                                                        Hapus
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}