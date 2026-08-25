import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AdminBarChart, AdminPieChart, MetricCard } from '@/components/admin/AdminCharts';
import { adminFetch, formatNaira } from '@/lib/adminApi';

interface DashboardMetrics {
  total_orders: number;
  total_revenue: number;
  today_orders: number;
  today_revenue: number;
  week_orders: number;
  week_revenue: number;
  month_orders: number;
  month_revenue: number;
  year_orders: number;
  year_revenue: number;
  pending_reviews: number;
  active_products: number;
  newsletter_subscribers: number;
  daily_sales: { label: string; orders: number; revenue: number }[];
  monthly_sales: { label: string; orders: number; revenue: number }[];
  order_status_distribution: { status: string; count: number }[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: () => adminFetch<DashboardMetrics>('/api/v1/accounts/metrics/'),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-pink border-t-transparent" />
      </div>
    );
  }

  const dailyChart = (metrics?.daily_sales || []).map((d) => ({
    label: d.label,
    value: d.revenue,
  }));

  const monthlyChart = (metrics?.monthly_sales || []).map((d) => ({
    label: d.label.split(' ')[0],
    value: d.revenue,
  }));

  const pieData = (metrics?.order_status_distribution || []).map((s) => ({
    label: s.status,
    value: s.count,
  }));

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-pink-dark via-brand-pink to-brand-pink-dark p-8 text-white shadow-xl shadow-brand-pink/20"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/5 blur-xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Premium Restaurant & Food Ordering</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Dashboard Overview</h1>
          <p className="mt-2 max-w-xl text-white/80">
            Welcome back. Here is a live snapshot of your store performance, orders, and subscribers.
          </p>
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Orders" value={metrics?.total_orders || 0} accent="pink" />
        <MetricCard title="Total Revenue" value={formatNaira(metrics?.total_revenue || 0)} accent="green" />
        <MetricCard title="Active Meals" value={metrics?.active_products || 0} accent="blue" />
        <MetricCard
          title="Newsletter Subscribers"
          value={metrics?.newsletter_subscribers || 0}
          accent="purple"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm xl:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Daily Revenue</h3>
              <p className="text-sm text-slate-500">Last 7 days</p>
            </div>
          </div>
          <AdminBarChart data={dailyChart} valuePrefix="₦" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">Order Status</h3>
          <p className="mb-4 text-sm text-slate-500">Distribution by status</p>
          <AdminPieChart data={pieData} />
        </motion.div>
      </div>

      {/* Monthly chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <h3 className="font-semibold text-slate-900">Monthly Revenue</h3>
        <p className="mb-4 text-sm text-slate-500">Last 6 months</p>
        <AdminBarChart data={monthlyChart} valuePrefix="₦" height={240} />
      </motion.div>

      {/* Period stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Today', orders: metrics?.today_orders, revenue: metrics?.today_revenue },
          { label: 'This Week', orders: metrics?.week_orders, revenue: metrics?.week_revenue },
          { label: 'This Month', orders: metrics?.month_orders, revenue: metrics?.month_revenue },
          { label: 'This Year', orders: metrics?.year_orders, revenue: metrics?.year_revenue },
        ].map((period) => (
          <div
            key={period.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-500">{period.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-brand-pink">{period.orders || 0}</p>
                <p className="text-xs text-slate-400">orders</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">{formatNaira(period.revenue || 0)}</p>
                <p className="text-xs text-slate-400">revenue</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending reviews alert */}
      {metrics && metrics.pending_reviews > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-5"
        >
          <div>
            <h3 className="font-semibold text-amber-900">Pending Reviews</h3>
            <p className="text-sm text-amber-700">
              {metrics.pending_reviews} review{metrics.pending_reviews !== 1 ? 's' : ''} awaiting approval.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/reviews')}
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
          >
            Review Now
          </button>
        </motion.div>
      )}
    </div>
  );
}
