import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import { analyticsApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/format';

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin-dashboard/login');
  }, [isAuthenticated, navigate]);

  const { data: topProducts } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => analyticsApi.topProducts().then((r) => r.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  const exportUrl = (period: string) => {
    const base = import.meta.env.VITE_API_URL || '/api/v1';
    const token = localStorage.getItem('admin_token');
    return `${base}/analytics/export/orders/?period=${period}&token=${token}`;
  };

  return (
    <>
      <SEO title="Reports" />
      <div className="min-h-screen bg-brand-gray-50">
        <header className="bg-white border-b border-brand-gray-100 px-4 py-3 flex items-center gap-4">
          <Link to="/admin-dashboard" className="text-brand-accent/60 hover:text-brand-pink text-sm">← Dashboard</Link>
          <h1 className="font-display font-semibold">Reports</h1>
        </header>

        <div className="section-padding max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="font-semibold mb-4">Export Orders</h2>
            <div className="flex flex-wrap gap-3">
              {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                <a
                  key={period}
                  href={exportUrl(period)}
                  className="btn-outline text-sm capitalize"
                >
                  {period} CSV
                </a>
              ))}
            </div>
          </div>

          {topProducts && Array.isArray(topProducts) && topProducts.length > 0 && (
            <div>
              <h2 className="font-semibold mb-4">Top Meals</h2>
              <div className="bg-white rounded-card shadow-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-gray-100 text-left">
                      <th className="p-4 font-medium text-brand-accent/50">Product</th>
                      <th className="p-4 font-medium text-brand-accent/50">Sold</th>
                      <th className="p-4 font-medium text-brand-accent/50">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p: { name: string; slug: string; total_sold: number; revenue: string }) => (
                      <tr key={p.slug} className="border-b border-brand-gray-50">
                        <td className="p-4">{p.name}</td>
                        <td className="p-4">{p.total_sold}</td>
                        <td className="p-4">{formatPrice(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
