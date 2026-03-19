import { Head, Link, useForm } from '@inertiajs/react';
import { MailOpen, Send, LogOut, ArrowRight } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 relative overflow-hidden">
            <Head title="Verifikasi Email" />

            {/* Dekorasi Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-5%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-[480px] relative z-10 text-center">
                <div className="inline-flex w-20 h-20 bg-blue-600 rounded-[2rem] items-center justify-center text-white shadow-2xl shadow-blue-200 mb-8 animate-pulse">
                    <MailOpen size={38} />
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Cek Email Kamu!</h1>
                
                <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-[0_30px_60px_rgba(0,0,0,0.05)] text-left">
                    <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm text-center">
                        Terima kasih telah mendaftar! Sebelum mulai belanja di <span className="font-bold text-slate-900">DRYEX SHOP</span>, tolong verifikasi email kamu dengan klik link yang baru saja kami kirimkan.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mb-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest text-center">
                            Link verifikasi baru telah dikirim!
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <button
                            disabled={processing}
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200"
                        >
                            Kirim Ulang Email <Send size={16} />
                        </button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut size={14} /> Keluar / Batalkan
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}