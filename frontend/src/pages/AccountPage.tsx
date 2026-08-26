import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AvatarBadge, OrderTimeline, statusLabel } from '@/components/AvatarBadge';
import { customerAuthApi } from '@/api';
import { useCustomerStore } from '@/store/customerStore';
import { formatNaira } from '@/lib/adminApi';
import type { Order } from '@/types';

export default function AccountPage() {
  const { isAuthenticated, user, setUser, logout } = useCustomerStore();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'overview' | 'orders' | 'profile'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [saveMsg, setSaveMsg] = useState('');

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: () => customerAuthApi.profile().then((r) => r.data),
    enabled: isAuthenticated,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => customerAuthApi.orders().then((r) => r.data),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (profile) setUser(profile);
  }, [profile, setUser]);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    avatar: 'chef',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        avatar: profile.avatar || 'chef',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () => customerAuthApi.updateProfile(form),
    onSuccess: (res) => {
      setUser(res.data);
      queryClient.invalidateQueries({ queryKey: ['customer-profile'] });
      setSaveMsg('Profile updated successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    },
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/account' }} replace />;
  }

  if (profileLoading && !user) {
    return <LoadingSpinner fullScreen />;
  }

  const display = profile || user!;
  const orderList = orders || [];

  return (
    <>
      <SEO title="My Account" description="Your Tasty Fingers profile, orders, and preferences" />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-pink/25 to-transparent" />
        <div className="relative section-padding mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <AvatarBadge avatar={display.avatar} size="lg" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-pink">
                  Customer ID · {display.customer_id}
                </p>
                <h1 className="font-display text-2xl font-semibold text-brand-black md:text-3xl">
                  {display.full_name}
                </h1>
                <p className="text-sm text-brand-accent/60">{display.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="rounded-full border border-brand-gray-200 px-5 py-2 text-sm font-medium text-brand-accent transition hover:border-brand-pink hover:text-brand-pink"
            >
              Sign out
            </button>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {(
              [
                ['overview', 'Overview'],
                ['orders', 'Order History'],
                ['profile', 'Profile & Avatar'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTab(id);
                  setSelectedOrder(null);
                }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tab === id
                    ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/30'
                    : 'bg-white text-brand-accent/70 border border-brand-gray-100 hover:border-brand-pink/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-card">
                <p className="text-xs uppercase tracking-wider text-brand-accent/50">Orders</p>
                <p className="mt-2 font-display text-3xl font-semibold text-brand-black">
                  {orderList.length}
                </p>
              </div>
              <div className="rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-card">
                <p className="text-xs uppercase tracking-wider text-brand-accent/50">Customer ID</p>
                <p className="mt-2 font-mono text-lg font-semibold text-brand-pink">
                  {display.customer_id}
                </p>
              </div>
              <div className="rounded-2xl border border-brand-gray-100 bg-gradient-to-br from-brand-pink to-brand-pink-dark p-6 text-white shadow-orange">
                <p className="text-xs uppercase tracking-wider text-white/70">Quick actions</p>
                <div className="mt-3 flex flex-col gap-2">
                  <Link to="/shop" className="text-sm font-semibold underline-offset-2 hover:underline">
                    Browse menu →
                  </Link>
                  <Link
                    to="/track-order"
                    className="text-sm font-semibold underline-offset-2 hover:underline"
                  >
                    Track an order →
                  </Link>
                </div>
              </div>
              {orderList[0] && (
                <div className="sm:col-span-3 rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-card">
                  <h2 className="mb-4 font-display text-lg font-semibold">Latest order</h2>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm text-brand-pink">{orderList[0].order_number}</p>
                      <p className="text-sm text-brand-accent/60">
                        {statusLabel(orderList[0].status)} · {formatNaira(orderList[0].total)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-outline text-sm"
                      onClick={() => {
                        setTab('orders');
                        setSelectedOrder(orderList[0]);
                      }}
                    >
                      View tracking
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2 space-y-3">
                {ordersLoading ? (
                  <LoadingSpinner fullScreen={false} />
                ) : orderList.length === 0 ? (
                  <div className="rounded-2xl border border-brand-gray-100 bg-white p-8 text-center shadow-card">
                    <p className="text-brand-accent/60">No orders yet.</p>
                    <Link to="/shop" className="btn-primary mt-4 inline-block text-sm">
                      Order now
                    </Link>
                  </div>
                ) : (
                  orderList.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedOrder?.id === order.id
                          ? 'border-brand-pink bg-brand-pink/5 shadow-md'
                          : 'border-brand-gray-100 bg-white hover:border-brand-pink/40'
                      }`}
                    >
                      <p className="font-mono text-sm font-semibold text-brand-pink">
                        {order.order_number}
                      </p>
                      <p className="mt-1 text-sm text-brand-accent/70">
                        {statusLabel(order.status)} · {formatNaira(order.total)}
                      </p>
                      <p className="mt-1 text-xs text-brand-accent/45">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
              <div className="lg:col-span-3 rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-card">
                {selectedOrder ? (
                  <>
                    <h2 className="mb-1 font-display text-xl font-semibold">
                      Order {selectedOrder.order_number}
                    </h2>
                    <p className="mb-6 text-sm text-brand-accent/55">
                      Placed {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                    <OrderTimeline status={selectedOrder.status} />
                    <div className="mt-6 border-t border-brand-gray-100 pt-4 space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}× {item.product_name}
                          </span>
                          <span className="font-medium">{formatNaira(item.subtotal)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-brand-gray-100 pt-2 font-semibold">
                        <span>Total</span>
                        <span>{formatNaira(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="py-12 text-center text-sm text-brand-accent/50">
                    Select an order to see live tracking and details.
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-card md:p-8">
              <h2 className="mb-2 font-display text-xl font-semibold">Profile & avatar</h2>
              <p className="mb-6 text-sm text-brand-accent/60">
                Choose an avatar and keep your delivery details up to date.
              </p>

              <p className="mb-3 text-sm font-medium text-brand-accent">Choose your avatar</p>
              <div className="mb-8 grid grid-cols-4 gap-3 sm:grid-cols-8">
                {(display.avatar_choices || [
                  { value: 'chef', label: 'Chef' },
                  { value: 'plate', label: 'Plate' },
                  { value: 'jollof', label: 'Jollof' },
                  { value: 'pepper', label: 'Pepper' },
                  { value: 'fork', label: 'Fork' },
                  { value: 'smile', label: 'Smile' },
                  { value: 'star', label: 'Star' },
                  { value: 'heart', label: 'Heart' },
                ]).map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => setForm({ ...form, avatar: choice.value })}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2 transition ${
                      form.avatar === choice.value
                        ? 'bg-brand-pink/10 ring-2 ring-brand-pink'
                        : 'hover:bg-brand-gray-50'
                    }`}
                  >
                    <AvatarBadge avatar={choice.value} size="sm" />
                    <span className="text-[10px] text-brand-accent/60">{choice.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ['first_name', 'First name'],
                    ['last_name', 'Last name'],
                    ['phone', 'Phone'],
                    ['city', 'City'],
                    ['state', 'State'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="mb-1.5 block text-sm font-medium">{label}</label>
                    <input
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full rounded-xl border border-brand-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">Address</label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-xl border border-brand-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
                  />
                </div>
              </div>

              {saveMsg && <p className="mt-4 text-sm text-green-600">{saveMsg}</p>}
              <button
                type="button"
                disabled={updateMutation.isPending}
                onClick={() => updateMutation.mutate()}
                className="btn-primary mt-6 disabled:opacity-60"
              >
                {updateMutation.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
