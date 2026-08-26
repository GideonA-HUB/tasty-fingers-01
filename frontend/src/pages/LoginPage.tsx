import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEO from '@/components/SEO';
import { customerAuthApi } from '@/api';
import { useCustomerStore } from '@/store/customerStore';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useCustomerStore((s) => s.setSession);
  const [error, setError] = useState('');
  const from = (location.state as { from?: string } | null)?.from || '/account';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await customerAuthApi.login(data.email, data.password);
      setSession(res.data.access, res.data.refresh, res.data.user);
      navigate(from);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string; non_field_errors?: string[] } } };
      const msg =
        axiosErr.response?.data?.non_field_errors?.[0] ||
        axiosErr.response?.data?.detail ||
        'Invalid email or password.';
      setError(typeof msg === 'string' ? msg : 'Invalid email or password.');
    }
  };

  return (
    <>
      <SEO title="Sign In" description="Sign in to your Tasty Fingers account" />
      <div className="relative min-h-[70vh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-pink/20 via-brand-cream to-brand-pink-dark/10" />
        <div className="relative section-padding mx-auto max-w-md">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-pink">Account</p>
          <h1 className="mb-2 font-display text-3xl font-semibold text-brand-black">Welcome back</h1>
          <p className="mb-8 text-sm text-brand-accent/65">
            Sign in to track orders, manage your profile, and reorder favourites.
          </p>

          <div className="rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-luxury md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-accent">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-brand-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-accent">Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-brand-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-brand-accent/60">
              New here?{' '}
              <Link to="/register" className="font-semibold text-brand-pink hover:underline">
                Create an account
              </Link>
            </p>
            <p className="mt-3 text-center text-sm text-brand-accent/50">
              <Link to="/track-order" className="hover:text-brand-pink hover:underline">
                Track an order without signing in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
