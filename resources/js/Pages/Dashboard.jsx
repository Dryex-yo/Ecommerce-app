import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    ShoppingBag, Clock, Zap, ChevronRight, 
    Package, Heart, Sparkles, ArrowUpRight, 
    Activity, Bell
} from 'lucide-react';

export default function UserDashboard() {
    const { auth, settings, recentActivity = [] } = usePage().props;
    const user = auth.user;
    
    const myOrdersCount = auth.myOrdersCount || 0;
    const wishlistCount = auth.wishlistCount || 0;
    const shopName = settings?.shop_name || 'ELECTRICAL STYLES';

    // Animasi sederhana untuk list
    const containerVariants = "animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out";

    return (
        <UserLayout user={user}>
            <Head title={`${shopName} | Dashboard`} />
            
            <main className="max-w-6xl mx-auto py-16 px-6">
                
                {/* 1. Header Section dengan Badge Dinamis */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="animate-in fade-in slide-in-from-left duration-700">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Sparkles size={14} fill="currentColor"/> Status: {user.role === 'admin' ? 'Administrator' : 'My Dashboard'}
                        </div>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                            Halo, {user.name.split(' ')[0]}!
                        </h2>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                Sistem Aktif • {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats dengan Hover Effect yang lebih hidup */}
                    <div className="flex gap-4">
                        <Link href={route('orders.index')} className="group">
                            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[120px] shadow-xl hover:scale-105 hover:-rotate-2 transition-all duration-300">
                                <span className="text-3xl font-black italic leading-none">{myOrdersCount}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest mt-2 text-slate-400">Orders</span>
                            </div>
                        </Link>

                        <Link href={route('wishlist.index')} className="group">
                            <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[120px] shadow-sm hover:scale-105 hover:rotate-2 transition-all duration-300">
                                <span className="text-3xl font-black italic leading-none text-blue-600 group-hover:text-pink-500 transition-colors">
                                    {wishlistCount}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest mt-2 text-slate-400">Wishlist</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    
                    {/* 2. Recent Activity Feed (Fitur yang Membuat Lebih Hidup) */}
                    <div className={`col-span-12 lg:col-span-4 order-2 lg:order-1 ${containerVariants}`}>
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                        <Activity size={18} />
                                    </div>
                                    <h4 className="font-black text-slate-800 uppercase italic text-sm">Aktivitas Terakhir</h4>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                            </div>

                            <div className="space-y-6">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((act, index) => (
                                        <div key={index} className="flex gap-4 group">
                                            <div className="relative">
                                                <div className="h-full w-0.5 bg-slate-100 absolute left-1/2 -translate-x-1/2"></div>
                                                <div className="h-3 w-3 rounded-full bg-white border-2 border-slate-200 relative z-10 group-hover:border-blue-500 transition-colors"></div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-slate-800 font-bold leading-none">{act.description}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{act.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <Bell size={32} className="mx-auto text-slate-200 mb-3" />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                            Belum ada aktivitas<br/>terdeteksi hari ini.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Main Action Cards */}
                    <div className="col-span-12 lg:col-span-8 order-1 lg:order-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Order Status Card */}
                        <div className={`group ${containerVariants}`} style={{ animationDelay: '100ms' }}>
                            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-between">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Package size={120} className="-rotate-12" />
                                </div>
                                
                                <div>
                                    <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Clock size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 italic uppercase">Pesanan Saya</h3>
                                    <p className="text-slate-400 mt-2 mb-8 text-[11px] font-bold uppercase tracking-wider leading-relaxed">
                                        Lacak pengiriman & riwayat belanja.
                                    </p>
                                </div>
                                
                                <Link href={route('orders.index')} className="bg-slate-900 text-white w-full py-4 rounded-2xl text-[10px] font-black inline-flex items-center justify-center gap-3 uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg group">
                                    Check Status <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Shop Card */}
                        <div className={`group ${containerVariants}`} style={{ animationDelay: '200ms' }}>
                            <div className="bg-blue-600 p-10 rounded-[3.5rem] text-white shadow-xl shadow-blue-100 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden flex flex-col justify-between">
                                <Zap size={100} className="absolute -bottom-5 -right-5 opacity-10 rotate-12" />
                                
                                <div>
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                                        <ShoppingBag size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase">Katalog Toko</h3>
                                    <p className="text-blue-100 mt-2 mb-8 text-[11px] font-bold uppercase tracking-wider leading-relaxed">
                                        Dapatkan koleksi terbaru eksklusif.
                                    </p>
                                </div>
                                
                                <Link href={route('shop.index')} className="bg-white text-blue-600 w-full py-4 rounded-2xl text-[10px] font-black inline-flex items-center justify-center gap-3 uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-lg group">
                                    Mulai Belanja <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* 4. Wishlist Full-Width Section (Bagian dari grid) */}
                        <div className={`md:col-span-2 group ${containerVariants}`} style={{ animationDelay: '300ms' }}>
                            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between group-hover:bg-white group-hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-pink-500 transition-colors shadow-sm">
                                        <Heart 
                                            size={28} 
                                            fill={wishlistCount > 0 ? "currentColor" : "none"} 
                                            className={wishlistCount > 0 ? "text-pink-500" : ""}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-800 uppercase italic">Favorit Saya</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                                            {wishlistCount} item dalam antrean wishlist Anda
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0 relative z-10">
                                    <Link 
                                        href={route('wishlist.index')} 
                                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors"
                                    >
                                        Lihat Semua <ArrowUpRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </UserLayout>
    );
}