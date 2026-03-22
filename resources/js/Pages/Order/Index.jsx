import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function OrderIndex({ auth, orders }) {
    const statusStyles = {
        pending: 'bg-amber-500/20 text-amber-500 border-amber-500/50',
        processing: 'bg-blue-500/20 text-blue-500 border-blue-500/50',
        shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/50',
        completed: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50',
        cancelled: 'bg-red-500/20 text-red-500 border-red-500/50',
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Riwayat Pesanan" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            My Orders
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Pantau semua transaksi dan pengiriman kamu.</p>
                    </div>

                    <div className="space-y-6">
                        {orders.length > 0 ? orders.map((order) => (
                            <div key={order.id} className="bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-md transition-all hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="p-6">
                                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                        <div>
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Order ID</span>
                                            <p className="font-bold dark:text-white">#DRYX-{order.id}</p>
                                        </div>
                                        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyles[order.status] || statusStyles.pending}`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0">
                                            <img 
                                                src={item.product?.image || '/placeholder.png'} 
                                                className="w-16 h-16 rounded-2xl object-cover bg-slate-100 dark:bg-slate-700" 
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-sm leading-tight">
                                                    {item.product?.name}
                                                </h4>
                                                <p className="text-xs text-slate-500">{item.quantity} x Rp{new Intl.NumberFormat('id-ID').format(item.price)}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-400">Total Pembayaran</p>
                                            <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                                                Rp{new Intl.NumberFormat('id-ID').format(order.total_price)}
                                            </p>
                                        </div>
                                        <Link 
                                            href={route('admin.orders.show', order.id)}
                                            className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2 rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
                                        >
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500">Belum ada pesanan nih. Yuk belanja!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}