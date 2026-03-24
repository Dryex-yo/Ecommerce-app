import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Wishlist({ auth, wishlistItems }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Wishlist</h2>}
        >
            <Head title="Wishlist" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {wishlistItems.length === 0 ? (
                            <p>Wishlist Anda masih kosong.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {wishlistItems.map((item) => (
                                    <div key={item.id} className="border p-4 rounded shadow">
                                        <img 
                                        src={item.product.image_url} 
                                        alt={item.product.name} 
                                        className="w-full h-48 object-cover mb-2"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = '/images/placeholder.png'; // Fallback jika gambar tetap gagal load
                                        }}
                                        />
                                        <h3 className="font-bold">{item.product.name}</h3>
                                        <p>Rp {item.product.price}</p>
                                        <Link 
                                            href={route('wishlist.toggle', item.product_id)} 
                                            method="post" 
                                            as="button"
                                            className="text-red-500 mt-2"
                                        >
                                            Hapus dari Wishlist
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}