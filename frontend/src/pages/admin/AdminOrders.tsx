import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminFetch, adminFetchList, formatNaira } from '@/lib/adminApi';

interface OrderItem {
  id: number;
  product_name: string;
  product_slug: string;
  price: string;
  quantity: number;
  subtotal: string;
  length: string;
  lace_type: string;
  color: string;
}

interface Order {
  id: number;
  order_number: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  delivery_type?: 'local' | 'international';
  delivery_type_display?: string;
  international_region?: '' | 'US' | 'UK' | 'CA';
  international_region_display?: string;
  order_notes: string;
  subtotal: string;
  delivery_fee: string;
  total: string;
  status: string;
  payment_method: string;
  payment_method_display?: string;
  payment_reference: string;
  is_paid: boolean;
  agreed_to_terms?: boolean;
  terms_agreed_at?: string | null;
  items: OrderItem[];
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  confirmed: 'bg-violet-100 text-violet-800',
  preparing: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  ready: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-cyan-100 text-cyan-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-slate-100 text-slate-800',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Payment',
  paid: 'Paid',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  processing: 'Preparing',
  ready: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  shipped: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const ADMIN_STATUSES = [
  'pending',
  'paid',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded',
];

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const queryClient = useQueryClient();

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (deliveryFilter !== 'all') params.set('delivery_type', deliveryFilter);
    const query = params.toString();
    return query ? `?${query}` : '';
  };

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders', statusFilter, deliveryFilter],
    queryFn: () => adminFetchList<Order>(`/api/v1/orders/admin/${buildQuery()}`),
  });

  const updateOrderStatus = async (orderId: number, status: string) => {
    await adminFetch(`/api/v1/orders/admin/${orderId}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    if (selectedOrder) setSelectedOrder({ ...selectedOrder, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">Full customer and delivery details for every order</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-pink"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Payment</option>
            <option value="paid">Paid</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready for Pickup</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-pink"
          >
            <option value="all">All Delivery Types</option>
            <option value="local">Local (Nigeria)</option>
            <option value="international">International</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Order #</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Delivery</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Terms</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 text-sm font-semibold text-brand-pink">{order.order_number}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900">{order.full_name}</p>
                      <p className="text-xs text-slate-400">{order.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      {order.delivery_type === 'international' ? (
                        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-800">
                          International
                          {order.international_region_display
                            ? ` · ${order.international_region_display}`
                            : order.international_region
                              ? ` · ${order.international_region}`
                              : ''}
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                          Local (Nigeria)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{order.phone}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{formatNaira(order.total)}</td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {order.payment_method_display || order.payment_method || '—'}
                      <br />
                      <span className={order.is_paid ? 'text-emerald-600' : 'text-amber-600'}>
                        {order.is_paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {order.agreed_to_terms ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Agreed
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-700'}`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm font-medium text-brand-pink hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Order #{selectedOrder.order_number}</h2>
                <p className="text-sm text-slate-500">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-pink">Customer</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Full Name', selectedOrder.full_name],
                    ['Email', selectedOrder.email],
                    ['Phone', selectedOrder.phone],
                    ['Delivery Type', selectedOrder.delivery_type_display || selectedOrder.delivery_type || 'Local'],
                    [
                      'International Region',
                      selectedOrder.international_region_display ||
                        selectedOrder.international_region ||
                        'N/A',
                    ],
                    ['Address', selectedOrder.address],
                    ['City', selectedOrder.city],
                    ['State', selectedOrder.state],
                    ['Country', selectedOrder.country],
                    ['Order Notes', selectedOrder.order_notes || 'None'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-sm font-medium text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-pink">Legal Agreement</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    [
                      'Terms & Refund Policy',
                      selectedOrder.agreed_to_terms ? 'Customer agreed at checkout' : 'Not recorded',
                    ],
                    [
                      'Agreed At',
                      selectedOrder.terms_agreed_at
                        ? new Date(selectedOrder.terms_agreed_at).toLocaleString()
                        : selectedOrder.agreed_to_terms
                          ? 'At checkout'
                          : '—',
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-sm font-medium text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-pink">Payment</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Method', selectedOrder.payment_method_display || selectedOrder.payment_method || '—'],
                    ['Transaction ID', selectedOrder.payment_reference || 'Pending'],
                    ['Status', selectedOrder.is_paid ? 'Paid' : 'Unpaid'],
                    ['Total', formatNaira(selectedOrder.total)],
                    ['Subtotal', formatNaira(selectedOrder.subtotal)],
                    ['Delivery Fee', formatNaira(selectedOrder.delivery_fee)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p
                        className={`text-sm font-medium text-slate-900 ${
                          label === 'Method' || label === 'Status' ? 'capitalize' : ''
                        }`}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-pink">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-100 p-4">
                      <p className="font-medium text-slate-900">{item.product_name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Qty {item.quantity} × {formatNaira(item.price)} = {formatNaira(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-pink">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {ADMIN_STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        selectedOrder.status === status
                          ? STATUS_COLORS[status]
                          : 'border border-slate-200 text-slate-600 hover:border-brand-pink/30'
                      }`}
                    >
                      {STATUS_LABELS[status] || status}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
