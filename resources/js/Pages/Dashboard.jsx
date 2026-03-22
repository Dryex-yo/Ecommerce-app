import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Clock, Zap, ChevronRight } from 'lucide-react';

export default function UserDashboard({ auth, myOrdersCount }) {
    const { settings } = usePage().props;
    const user = auth.user;
    const shopName = settings?.shop_name || 'DRYEX SHOP';

    return (
        <UserLayout user={user}>
            <Head title={`${shopName} | My Dashboard`} />
            <main className="max-w-5xl mx-auto py-16 px-6">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <Zap size={14} fill="currentColor"/> Customer Portal
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                        Halo, {user.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-slate-500 font-medium text-lg mt-3">
                        {myOrdersCount > 0 
                            ? `Ada ${myOrdersCount} pesananmu yang sedang kami proses.` 
                            : "Siap mencari koleksi terbaru hari ini?"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all">
                        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-8"><Clock size={32} /></div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Pesanan Saya</h3>
                        <p className="text-slate-400 mt-2 mb-10">Cek status pengiriman belanjaanmu.</p>
                        <Link href={route('orders.index')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black inline-flex items-center gap-2 uppercase tracking-widest">
                            Riwayat Pesanan <ChevronRight size={16}/>
                        </Link>
                    </div>

                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8"><ShoppingBag size={32} /></div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Belanja Lagi</h3>
                        <p className="text-slate-400 mt-2 mb-10">Lihat katalog produk premium kami.</p>
                        <Link href={route('shop.index')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black inline-flex items-center gap-2 uppercase tracking-widest">
                            Katalog <ChevronRight size={16}/>
                        </Link>
                    </div>
                </div>
            </main>
        </UserLayout>
    );
}