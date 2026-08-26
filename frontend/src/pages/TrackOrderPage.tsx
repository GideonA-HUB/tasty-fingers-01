import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEO from '@/components/SEO';
import { OrderTimeline, statusLabel } from '@/components/AvatarBadge';
import { ordersApi } from '@/api';
import { formatNaira } from '@/lib/adminApi';
import type { Order } from '@/types';

const schema = z.object({
  order_number: z.string().min(3, 'Enter your order number'),
  email: z.string().email('Enter the email used at checkout'),
});

type FormData = z.infer<typeof schema>;

export default function TrackOrderPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    setOrder(null);
    try {
      const res = await ordersApi.track(data.order_number.trim(), data.email.trim());
      setOrder(res.data);
    } catch {
      setError('No order found with that number and email. Please check and try again.');
    }
  };

  return (
    <>
      <SEO title="Track Order" description="Track your Tasty Fingers order in real time" />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-pink/15 via-transparent to-transparent" />
        <div className="relative section-padding mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-pink">
            Order tracking
          </p>
          <h1 className="mb-2 font-display text-3xl font-semibold text-brand-black md:text-4xl">
            Track your order
          </h1>
          <p className="mb-8 max-w-xl text-sm text-brand-accent/65">
            Enter your order number and the email you used at checkout to see kitchen progress and
            delivery status.
          </p>

          <div className="rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-luxury md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium">Order number</label>
                <input
                  placeholder="e.g. TF-123456"
                  className="w-full rounded-xl border border-brand-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
                  {...register('order_number')}
                />
                {errors.order_number && (
                  <p className="mt-1 text-xs text-red-600">{errors.order_number.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-brand-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
              {error && (
                <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="sm:col-span-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
                  {isSubmitting ? 'Looking up…' : 'Track order'}
                </button>
              </div>
            </form>
          </div>

          {order && (
            <div className="mt-8 rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-luxury md:p-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-brand-pink">{order.order_number}</p>
                  <h2 className="font-display text-xl font-semibold">{statusLabel(order.status)}</h2>
                  <p className="text-sm text-brand-accent/55">
                    Placed {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="font-display text-xl font-semibold">{formatNaira(order.total)}</p>
              </div>
              <OrderTimeline status={order.status} />
              <div className="mt-6 space-y-2 border-t border-brand-gray-100 pt-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}× {item.product_name}
                    </span>
                    <span className="font-medium">{formatNaira(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-brand-accent/55">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-pink hover:underline">
              Sign in
            </Link>{' '}
            to see your full order history.
          </p>
        </div>
      </div>
    </>
  );
}
