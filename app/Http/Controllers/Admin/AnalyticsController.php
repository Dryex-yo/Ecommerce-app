<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        // 1. Data Dasar
        $completedOrders = Order::where('status', 'completed');
        $totalOrders = $completedOrders->count();
        $totalVisitors = DB::table('visitors')->count();

        // 2. Hitung Conversion Rate
        $conversionRate = $totalVisitors > 0 
            ? round(($totalOrders / $totalVisitors) * 100, 1) 
            : 0;

        // 3. Hitung Pendapatan
        $totalRevenue = (float) $completedOrders->sum('total_price');

        $stats = [
            'total_revenue'   => $totalRevenue,
            'avg_order_value' => (float) ($completedOrders->avg('total_price') ?? 0),
            'conversion_rate' => $conversionRate,
            'gross_profit'    => $totalRevenue * 0.2, // Margin 20%
            'total_visitors'  => $totalVisitors
        ];

        // 4. Data Chart Bulanan (Format untuk Recharts)
        $salesChartData = Order::where('status', 'completed')
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%b") as name'),
                DB::raw('CAST(SUM(total_price) AS UNSIGNED) as revenue')
            )
            ->whereYear('created_at', date('Y')) // Hanya tahun ini
            ->groupBy('name', DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();

        // Pastikan path render sesuai dengan folder di resources/js/Pages/
        return Inertia::render('Admin/Analytics/Index', [
            'salesChartData' => $salesChartData,
            'stats' => $stats,
        ]);
    }
}