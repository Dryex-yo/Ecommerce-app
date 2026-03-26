import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { MessageSquare, Send, AlertCircle, Clock, RefreshCw, ShoppingBag, ExternalLink, Package, CreditCard } from 'lucide-react';

const TimeDisplay = ({ timestamp }) => {
    const [displayTime, setDisplayTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            if (!timestamp) return;
            
            const msgTime = new Date(timestamp);
            const now = new Date();
            const diffMinutes = Math.floor((now - msgTime) / 60000);
            
            if (diffMinutes < 1) {
                setDisplayTime('Baru saja');
            } else if (diffMinutes < 60) {
                setDisplayTime(`${diffMinutes}m lalu`);
            } else {
                setDisplayTime(msgTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 30000);
        return () => clearInterval(interval);
    }, [timestamp]);

    return <span>{displayTime || 'Sedang dimuat...'}</span>;
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

const getOrderStatusBadge = (status) => {
    const map = {
        pending:    { cls: 'bg-amber-100 text-amber-700',   label: 'Menunggu' },
        processing: { cls: 'bg-blue-100 text-blue-700',     label: 'Diproses' },
        shipped:    { cls: 'bg-purple-100 text-purple-700', label: 'Dikirim' },
        delivered:  { cls: 'bg-emerald-100 text-emerald-700', label: 'Selesai' },
        cancelled:  { cls: 'bg-red-100 text-red-700',       label: 'Dibatalkan' },
    };
    const s = map[status] || { cls: 'bg-slate-100 text-slate-700', label: status };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${s.cls}`}>
            {s.label}
        </span>
    );
};

// ==== AdminOrderCard ====
const AdminOrderCard = ({ order }) => {
    if (!order) return null;

    return (
        <div className="mx-4 mb-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600">
                <div className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-white" />
                    <span className="text-white font-black text-[10px] uppercase tracking-wider">Order Terbaru</span>
                </div>
                {getOrderStatusBadge(order.status)}
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                {/* Order Number + Payment */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">No. Order</p>
                        <p className="font-black text-slate-800 text-[12px]">#{order.order_number}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Pembayaran</p>
                        <div className="flex items-center gap-1">
                            <CreditCard size={10} className="text-slate-500" />
                            <p className="font-bold text-slate-700 text-[10px] uppercase">{order.payment_method ?? '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Items Summary */}
                {order.items_summary && order.items_summary.length > 0 && (
                    <div className="rounded-xl bg-white border border-slate-100 divide-y divide-slate-50">
                        {order.items_summary.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Package size={11} className="text-indigo-400 flex-shrink-0" />
                                    <p className="text-[10px] font-semibold text-slate-700 truncate max-w-[130px]">{item.name}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[9px] text-slate-400">x{item.qty}</p>
                                    <p className="text-[10px] font-bold text-slate-700">{formatCurrency(item.price)}</p>
                                </div>
                            </div>
                        ))}
                        {order.items_count > 3 && (
                            <p className="px-3 py-1.5 text-[9px] font-bold text-slate-400 text-center">
                                +{order.items_count - 3} item lainnya
                            </p>
                        )}
                    </div>
                )}

                {/* Total + Action */}
                <div className="flex items-center justify-between pt-1">
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                        <p className="font-black text-indigo-700 text-[14px]">{formatCurrency(order.total_price)}</p>
                    </div>
                    <Link
                        href={route('admin.orders.show', order.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wide transition-all active:scale-95 shadow-sm"
                    >
                        <ExternalLink size={12} />
                        Lihat Order
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function MessagesIndex() {
    const { auth } = usePage().props;
    const { messages: initialMessages } = usePage().props;
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState(initialMessages || []);
    const [isPolling, setIsPolling] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        reply: ''
    });

    // Polling untuk real-time updates
    useEffect(() => {
        const pollMessages = async () => {
            try {
                const response = await fetch(route('messages.get-latest'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.messages && result.messages.length > 0) {
                        setMessages(prevMessages => {
                            return result.messages.map(newMsg => {
                                const existingMsg = prevMessages.find(m => m.id === newMsg.id);
                                if (existingMsg) {
                                    return {
                                        ...existingMsg,
                                        ...newMsg,
                                        messages: newMsg.messages
                                    };
                                }
                                return newMsg;
                            });
                        });
                        
                        if (selectedChat) {
                            const updated = result.messages.find(m => m.id === selectedChat);
                            if (updated) {
                                setSelectedChat(selectedChat);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        };

        const interval = setInterval(pollMessages, 2000);
        return () => clearInterval(interval);
    }, [selectedChat]);

    // Mark as read when opening chat
    useEffect(() => {
        if (selectedChat) {
            fetch(route('admin.messages.mark-as-read', selectedChat), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                }
            }).catch(console.error);
        }
    }, [selectedChat]);

    const activeChat = selectedChat ? messages.find(c => c.id === selectedChat) : null;

    const handleSendReply = (e) => {
        e.preventDefault();
        
        if (data.reply.trim() && activeChat) {
            post(route('admin.messages.store', activeChat.id), {
                onSuccess: () => {
                    setData('reply', '');
                }
            });
        }
    };

    const handleCloseChat = () => {
        if (activeChat && confirm('Yakin ingin menutup percakapan ini?')) {
            post(route('admin.messages.close', activeChat.id), {
                onSuccess: () => {
                    setSelectedChat(null);
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase">
                    <Clock size={12} /> Menunggu
                </span>;
            case 'responded':
                return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase">
                    Di Respon
                </span>;
            case 'closed':
                return <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">
                    ✓ Selesai
                </span>;
            default:
                return null;
        }
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Messages - Customer Support" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chat List */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-800 uppercase">Conversations</h3>
                            <button
                                onClick={() => window.location.reload()}
                                title="Refresh"
                                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                            >
                                <RefreshCw size={18} className="text-slate-600" />
                            </button>
                        </div>
                        
                        {messages.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare size={32} className="text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400 text-[10px] font-bold uppercase">Belum ada pesan</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {messages.map((chat) => {
                                    const unreadCount = chat.messages?.filter(m => 
                                        m.sender === 'customer' && !m.is_read
                                    ).length || 0;
                                    
                                    return (
                                    <button
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat.id)}
                                        className={`w-full p-4 rounded-[1.5rem] transition-all text-left border-2 ${
                                            selectedChat === chat.id
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="font-black text-slate-800 text-[12px] truncate">{chat.customer_name}</p>
                                                <p className="text-slate-600 text-[10px] font-medium mt-1 line-clamp-1">{chat.last_message}</p>
                                                <p className="text-slate-400 text-[9px] font-bold mt-2">{chat.customer_email}</p>
                                            </div>
                                            <div className="flex-shrink-0 flex flex-col items-end gap-1">
                                                {unreadCount > 0 && (
                                                    <span className="w-5 h-5 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                                {chat.order && (
                                                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-[8px] font-black">
                                                        <ShoppingBag size={9} /> Order
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-[9px] font-bold mt-2">{chat.timestamp}</p>
                                    </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Detail */}
                <div className="lg:col-span-2">
                    {activeChat ? (
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black uppercase">{activeChat.customer_name}</h3>
                                    <p className="text-[10px] text-blue-100 font-bold mt-1">{activeChat.customer_email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(activeChat.status)}
                                    {activeChat.status !== 'closed' && (
                                        <button
                                            onClick={handleCloseChat}
                                            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[9px] font-black uppercase transition-all"
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white custom-scrollbar">
                                {/* Order Card — Admin View */}
                                <AdminOrderCard order={activeChat.order} />

                                <div className="px-6 pb-6 space-y-4">
                                    {activeChat.messages && activeChat.messages.length > 0 ? (
                                        activeChat.messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}
                                            >
                                                <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                                                    msg.sender === 'customer'
                                                        ? 'bg-slate-100 text-slate-800 rounded-tl-none'
                                                        : 'bg-blue-600 text-white rounded-tr-none'
                                                }`}>
                                                    <p className="text-[12px] font-medium">{msg.text}</p>
                                                    <p className={`text-[9px] font-bold mt-1 ${msg.sender === 'customer' ? 'text-slate-400' : 'text-blue-100'}`}>
                                                        <TimeDisplay timestamp={msg.timestamp || msg.created_at} />
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-[10px] font-bold text-center">Belum ada pesan</p>
                                    )}
                                </div>
                            </div>

                            {/* Input Area */}
                            {activeChat.status !== 'closed' ? (
                                <form onSubmit={handleSendReply} className="p-6 border-t border-slate-100 bg-white">
                                    <div className="flex gap-3">
                                        <textarea
                                            value={data.reply}
                                            onChange={(e) => setData('reply', e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendReply(e);
                                                }
                                            }}
                                            placeholder="Tulis balasan..."
                                            rows="2"
                                            disabled={processing}
                                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-[12px] font-medium resize-none disabled:opacity-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                    {errors.reply && <p className="text-red-600 text-[10px] font-bold mt-2">{errors.reply}</p>}
                                </form>
                            ) : (
                                <div className="p-4 bg-emerald-50 border-t border-emerald-200 text-emerald-700 text-center text-[10px] font-bold uppercase">
                                    ✓ Percakapan Ini Telah Ditutup
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm h-[700px] flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                                <MessageSquare size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-bold text-[12px] uppercase tracking-widest">
                                Pilih percakapan untuk memulai
                            </p>
                            {messages.length === 0 && (
                                <p className="text-slate-400 text-[10px] font-medium mt-4">Atau tunggu customer mengirim pesan...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
