import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import BrandLogo from '@/components/BrandLogo';
import LoadingSpinner from '@/components/LoadingSpinner';
import { analyticsApi, notificationsApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/format';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin-dashboard/login');
  }, [isAuthenticated, navigate]);

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => analyticsApi.dashboard().then((r) => r.data),
    enabled: isAuthenticated,
  });

  const { data: unread } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: () => notificationsApi.unreadCount().then((r) => r.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;
  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  const cards = [
    { label: 'Total Revenue', value: formatPrice(metrics?.total_revenue || 0) },
    { label: 'Daily Sales', value: formatPrice(metrics?.daily_sales || 0) },
    { label: 'Weekly Sales', value: formatPrice(metrics?.weekly_sales || 0) },
    { label: 'Monthly Sales', value: formatPrice(metrics?.monthly_sales || 0) },
    { label: 'Total Orders', value: metrics?.total_orders ?? 0 },
    { label: 'Pending Orders', value: metrics?.pending_orders ?? 0 },
    { label: 'Delivered', value: metrics?.delivered_orders ?? 0 },
  ];

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div className="min-h-screen bg-brand-gray-50">
        <header className="bg-white border-b border-brand-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-8 w-auto" />
            <span className="font-display font-semibold text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            {(unread?.count ?? 0) > 0 && (
              <span className="bg-brand-pink text-white text-xs px-2 py-0.5 rounded-full">
                {unread?.count} new
              </span>
            )}
            <a href="/admin/" className="text-xs text-brand-accent/60 hover:text-brand-pink">Django Admin</a>
            <button onClick={logout} className="text-xs text-brand-accent/60 hover:text-brand-pink">Logout</button>
          </div>
        </header>

        <div className="section-padding max-w-7xl mx-auto">
          <h1 className="text-2xl font-display font-semibold mb-6">Dashboard</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
              <div key={card.label} className="bg-white rounded-card p-5 shadow-card">
                <p className="text-xs text-brand-accent/50 mb-1">{card.label}</p>
                <p className="text-xl font-semibold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin-dashboard/orders" className="bg-white rounded-card p-6 shadow-card hover:shadow-luxury transition-shadow">
              <h3 className="font-semibold mb-1">Orders</h3>
              <p className="text-sm text-brand-accent/50">Manage & update order statuses</p>
            </Link>
            <a href="/admin/" className="bg-white rounded-card p-6 shadow-card hover:shadow-luxury transition-shadow">
              <h3 className="font-semibold mb-1">Meals</h3>
              <p className="text-sm text-brand-accent/50">Manage meals in Django Admin</p>
            </a>
            <Link to="/admin-dashboard/reports" className="bg-white rounded-card p-6 shadow-card hover:shadow-luxury transition-shadow">
              <h3 className="font-semibold mb-1">Reports</h3>
              <p className="text-sm text-brand-accent/50">Export sales reports</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
