import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    DollarSign, Package, Activity, Users, ArrowUpRight, 
    ArrowDownRight, AlertCircle, ShoppingCart, ChevronRight 
} from 'lucide-react';

export default function AdminDashboard({ auth, stats, latestProducts, recentOrders }) {
    const { settings } = usePage().props;
    const shopName = settings?.shop_name || 'DRYEX SHOP';

    const formatIDR = (amount) => new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
    }).format(amount || 0);

    return (
        <AdminLayout user={auth.user}>
            <Head title={`${shopName} | Admin Panel`} />

            <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Overview <span className="text-blue-600">—</span> {shopName}
                </h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Dashboard Analytics & Control</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="TOTAL REVENUE" value={formatIDR(stats?.totalRevenue)} trend="+12%" icon={<DollarSign size={20}/>} color="bg-emerald-500" />
                <StatCard label="TOTAL ORDERS" value={stats?.totalOrders || 0} trend="+New" icon={<ShoppingCart size={20}/>} color="bg-blue-500" />
                <StatCard label="LOW STOCK" value={stats?.lowStockCount || 0} trend="Stock Alert" icon={<AlertCircle size={20}/>} color="bg-rose-500" isDown={stats?.lowStockCount > 0} />
                <StatCard label="CUSTOMERS" value={stats?.totalCustomers || 0} trend="+Growth" icon={<Users size={20}/>} color="bg-indigo-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Activity size={20} /></div>
                            Recent Transactions
                        </h3>
                        <Link href={route('admin.orders.index')} className="text-xs font-black text-blue-600 hover:underline">VIEW ALL</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-slate-50">
                                {recentOrders?.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="py-5 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-[11px] font-black text-slate-500 uppercase">{order.user?.name.charAt(0) || 'G'}</div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-none">{order.user?.name || 'Guest'}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1.5 font-bold tracking-tight">#ORD-{order.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 font-black text-slate-800 text-sm">{formatIDR(order.total_price)}</td>
                                        <td className="py-5 text-right pr-2">
                                            <Link href={route('admin.orders.show', order.id)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all inline-flex shadow-sm">
                                                <ChevronRight size={14} strokeWidth={3} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Monitor */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-800">Inventory</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Stock Levels</p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-xl"><Package size={20} /></div>
                    </div>
                    <div className="space-y-4 flex-grow">
                        {latestProducts?.map((product) => (
                            <Link key={product.id} href={route('admin.products.show', product.id)} className="group block p-4 rounded-[2rem] border border-slate-50 hover:bg-blue-50/20 bg-slate-50/30 mb-3 transition-all">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-800 truncate">{product.name}</span>
                                    <span className="text-[10px] font-black text-blue-600">{product.stock} Units</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link href={route('admin.products.index')} className="w-full mt-8 py-4 rounded-[1.5rem] bg-slate-900 text-white text-[10px] font-black uppercase text-center hover:bg-blue-600 transition-all">
                        Manage Inventory
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, trend, icon, color, isDown = false }) {
    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-4 rounded-2xl ${color} text-white`}>{icon}</div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${isDown ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <span className="text-[10px] font-black">{trend}</span>
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">{label}</p>
                <h4 className="text-3xl font-black text-slate-800 mt-2 tracking-tighter">{value}</h4>
            </div>
        </div>
    );
}