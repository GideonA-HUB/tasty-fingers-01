import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { customerAuthApi, type CustomerProfile } from '@/api';
import { AvatarBadge } from '@/components/AvatarBadge';

export default function AdminCustomers() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => customerAuthApi.adminCustomers().then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Customers</h1>
          <p className="mt-1 text-sm text-brand-accent/60">
            Registered storefront accounts with unique customer IDs
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
          <Users className="h-6 w-6" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-2xl border border-brand-gray-100 bg-white shadow-lg"
      >
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : !customers?.length ? (
          <div className="py-16 text-center text-brand-accent/50">No registered customers yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-brand-gray-50 text-left text-xs uppercase tracking-wider text-brand-accent/50">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {customers.map((c: CustomerProfile) => (
                  <tr key={c.customer_id} className="hover:bg-brand-pink/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AvatarBadge avatar={c.avatar} size="sm" />
                        <div>
                          <p className="font-medium text-brand-black">{c.full_name}</p>
                          <p className="text-xs text-brand-accent/55">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-brand-pink">{c.customer_id}</td>
                    <td className="px-6 py-4 text-sm">{c.phone || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      {[c.city, c.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">{c.order_count ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-brand-accent/55">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
