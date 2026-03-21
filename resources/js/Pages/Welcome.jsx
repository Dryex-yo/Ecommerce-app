import React, { useState, useMemo } from 'react';
import { UserIcon } from '@heroicons/react/24/solid';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { 
    ShoppingCart, Package, Search, LogOut, 
    ShieldCheck, SearchX, ArrowRight,
    Star, Instagram, Twitter, MessageCircle,
    ShoppingBag, Sparkles
} from 'lucide-react';

export default function Welcome({ auth, products }) {
    const { settings, cart_count } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    
    
    const handleAddToCart = (e, productId) => {
        e.preventDefault();
        router.post(route('cart.store'), { 
            product_id: productId, 
            quantity: 1 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Notifikasi atau efek tambahan bisa ditaruh di sini
            },
        });
    };

    const shopName = settings?.shop_name || 'DRYEX SHOP';

const filteredProducts = useMemo(() => {
    // Tambahkan pengecekan Array.isArray untuk mencegah error .filter()
        if (!products || !Array.isArray(products)) return [];

        return products.filter((product) => {
            const searchLower = searchQuery.toLowerCase();
            // Gunakan optional chaining (?.) agar tidak crash jika name/category null
            return (
                product.name?.toLowerCase().includes(searchLower) ||
                product.category?.name?.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower)
            );
        });
    }, [searchQuery, products]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title={`${shopName}`} />
            
            <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
                {/* --- ULTRA THIN ANNOUNCEMENT BAR --- */}
                <div className="bg-slate-950 text-white py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.4em] overflow-hidden">
                    <div className="animate-pulse">Exclusive Spring Collection 2026 • Free Delivery Over Rp 1M</div>
                </div>

                {/* --- GLASS NAVBAR --- */}
                <nav className="flex justify-between items-center px-6 md:px-20 py-5 bg-white/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-slate-100/50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform overflow-hidden">
                            {settings?.shop_logo ? (
                                <img src={settings.shop_logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingCart size={20} strokeWidth={2.5} />
                            )}
                        </div>
                        <h1 className="font-black text-xl tracking-tighter text-slate-800 uppercase">
                            {shopName.split(' ')[0]}
                            <span className="text-blue-600">
                                {shopName.includes(' ') ? ` ${shopName.split(' ').slice(1).join(' ')}` : '.'}
                            </span>
                        </h1>
                    </Link>
                    {/* Minimalist Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-12 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find your masterpiece..." 
                            className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 focus:bg-white rounded-full pl-14 pr-6 py-3.5 text-xs transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <div className="flex items-center gap-4">
                                <Link href={route('cart.index')} className="relative p-3 text-slate-600 hover:bg-slate-50 rounded-full transition-all group">
                                    <ShoppingCart size={22} strokeWidth={1.5} />
                                    {cart_count > 0 && (
                                        <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-[3px] border-white shadow-lg animate-bounce">
                                            {cart_count}
                                        </span>
                                    )}
                                </Link>
                                <Link href={route('dashboard')} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-[11px] tracking-widest hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 uppercase">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={route('login')} className="font-black text-[11px] tracking-widest text-slate-900 hover:text-blue-600 px-4 py-2 transition-colors uppercase">Login</Link>
                                <Link href={route('register')} className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-black text-[11px] tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 uppercase">Join Now</Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* --- MINIMALIST HERO --- */}
                {/* Gunakan calc h-screen dikurangi estimasi tinggi navbar + announcement bar (~112px) */}
                <header className="relative px-6 flex flex-col items-center text-center overflow-hidden border-b border-slate-50 min-h-[calc(100vh-112px)] justify-center py-8">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/60 via-transparent to-transparent -z-10"></div>
                    
                    <div className="relative z-10 max-w-5xl w-full">
                        {/* Badge - Kurangi margin bottom */}
                        <div className="animate-bounce inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2 rounded-full mb-6 border border-blue-100 shadow-sm">
                            <Sparkles size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scale Efficiency 2026</span>
                        </div>

                        {/* Headline - Perkecil ukuran sedikit di desktop agar lebih proporsional */}
                        <div className="flex flex-col items-center gap-0 mb-6 py-2 overflow-visible">
                            <h2 className="text-5xl sm:text-7xl md:text-[90px] font-black text-slate-900 leading-[0.85] tracking-tighter italic uppercase px-4">
                                Disrupting
                            </h2>
                            <h2 className="text-5xl sm:text-7xl md:text-[90px] font-black leading-[0.85] tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 uppercase px-6 pb-2">
                                Commerce
                            </h2>
                        </div>

                        {/* Deskripsi - Kurangi margin bottom dan font-size mobile */}
                        <p className="text-slate-500 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed border-l-4 border-blue-100 pl-6 mb-8">
                            Engineered for <span className="text-slate-900 font-bold">high-growth scalability</span>. We combine data-driven architecture with premium aesthetics to dominate the modern digital market.
                        </p>

                        {/* Button CTA */}
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link 
                                href={route('shop.index')} 
                                className="group bg-slate-900 text-white px-10 py-4 md:px-14 md:py-4.5 rounded-full font-black text-[11px] tracking-[0.2em] hover:bg-blue-600 hover:shadow-2xl transition-all shadow-xl shadow-slate-200 flex items-center gap-4 uppercase"
                            >
                                Explore Ecosystem 
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* --- PRODUCTS GRID --- */}
                <main id="collection" className="py-24 bg-[#FDFDFD] overflow-hidden">
                    {/* Header Section */}
                    <div className="px-6 md:px-20 mb-16">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-[1px] w-8 bg-blue-600"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600">Curated Gallery</span>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            2026 <span className="text-slate-300">Showcase</span>
                        </h3>
                    </div>

                    <div className="flex flex-col gap-16">
                        {/* BARIS 1: Bergerak ke KANAN (Reverse) */}
                        <div className="relative">
                            <div className="flex gap-6 animate-infinite-scroll-reverse hover:[animation-play-state:paused] w-max">
                                {[...products.slice(0, 5), ...products.slice(0, 5)].map((product, index) => (
                                    <ProductCard key={`top-${product.id}-${index}`} product={product} />
                                ))}
                            </div>
                        </div>

                        {/* BARIS 2: Bergerak ke KIRI (Normal) */}
                        <div className="relative">
                            <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused] w-max">
                                {[...products.slice(5, 10), ...products.slice(5, 10)].map((product, index) => (
                                    <ProductCard key={`bottom-${product.id}-${index}`} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Masking Gradient agar halus di pinggir layar */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FDFDFD] to-transparent z-10 pointer-events-none"></div>
                </main>
                {/* --- FOOTER --- */}
                <footer className="bg-slate-950 text-white pt-32 pb-16 px-6 md:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="font-black text-4xl tracking-tighter mb-8 italic uppercase">{shopName}</h4>
                            <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-10 text-lg">
                                The new standard of luxury shopping experience. Curated with passion, delivered with precision.
                            </p>
                            <div className="flex gap-6">
                                <SocialIcon icon={<Instagram size={20}/>} />
                                <SocialIcon icon={<Twitter size={20}/>} />
                                <SocialIcon icon={<MessageCircle size={20}/>} />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-500 mb-8">Navigation</h5>
                            <ul className="space-y-5 text-sm font-bold text-slate-300">
                                <li><Link href="/" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">New Arrivals</Link></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Best Sellers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Archives</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-blue-500 mb-8">Support</h5>
                            <ul className="space-y-5 text-sm font-bold text-slate-300">
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Shipping Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-900 pt-16 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">&copy; 2026 {shopName}. DESIGNED BY PROFESSIONALS.</p>
                        <div className="flex gap-10 text-slate-600 font-bold text-[9px] uppercase tracking-widest">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function SocialIcon({ icon }) {
    return (
        <a href="#" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-950 hover:border-white transition-all duration-500 shadow-sm">
            {icon}
        </a>
    );
}

function ProductCard({ product }) {
    return (
        <div className="w-[240px] md:w-[280px] flex-shrink-0 group/card flex flex-col">
            {/* Image Container: Pastikan aspect-ratio terkunci dan overflow-hidden */}
            <div className="relative aspect-[3/4] w-full bg-[#F8F8F8] rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-500 group-hover/card:shadow-xl group-hover/card:-translate-y-1">
                <Link href={route('shop.product.show', product.id)} className="block w-full h-full">
                    {product.image ? (
                        <img 
                            src={`${product.image}`} 
                            // object-cover sangat penting agar gambar tidak gepeng
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                            alt={product.name} 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                            <Package size={32} />
                        </div>
                    )}
                </Link>
                
                {/* Overlay Button */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
                    <div className="bg-slate-900/80 backdrop-blur-md text-white py-3 rounded-2xl font-bold text-[9px] text-center tracking-widest uppercase">
                        View Details
                    </div>
                </div>
            </div>

            {/* Info Section: Beri margin-top agar tidak menempel ke box gambar */}
            <div className="mt-4 px-2 flex flex-col gap-1">
                <h4 className="font-bold text-sm text-slate-900 truncate tracking-tight">
                    {product.name}
                </h4>
                <div className="flex justify-between items-center">
                    <p className="font-black text-blue-600 text-sm">
                        Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                    </p>
                    <span className="text-[8px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                        {product.category || 'Luxury'}
                    </span>
                </div>
            </div>
        </div>
    );
}