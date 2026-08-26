import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEO from '@/components/SEO';
import { customerAuthApi } from '@/api';
import { useCustomerStore } from '@/store/customerStore';

const schema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirm: z.string(),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: 'Passwords do not match',
    path: ['password_confirm'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useCustomerStore((s) => s.setSession);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await customerAuthApi.register({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || '',
        password: data.password,
        password_confirm: data.password_confirm,
      });
      setSession(res.data.access, res.data.refresh, res.data.user);
      navigate('/account');
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: Record<string, string[] | string> };
      };
      const body = axiosErr.response?.data;
      if (body) {
        const first =
          (typeof body.email === 'object' && body.email?.[0]) ||
          (typeof body.detail === 'string' && body.detail) ||
          Object.values(body).flat?.()?.[0] ||
          'Registration failed. Please try again.';
        setError(String(first));
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <>
      <SEO title="Create Account" description="Join Tasty Fingers — register for order tracking and exclusive deals" />
      <div className="relative min-h-[70vh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-pink/20 via-brand-cream to-brand-pink-dark/10" />
        <div className="relative section-padding mx-auto max-w-md">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-pink">Join us</p>
          <h1 className="mb-2 font-display text-3xl font-semibold text-brand-black">Create your account</h1>
          <p className="mb-8 text-sm text-brand-accent/65">
            Get a unique customer ID, track every order, and save your favourites.
          </p>

          <div className="rounded-2xl border border-brand-gray-100 bg-white p-6 shadow-luxury md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {(
                [
                  ['full_name', 'Full name', 'text', 'name'],
                  ['email', 'Email', 'email', 'email'],
                  ['phone', 'Phone (optional)', 'tel', 'tel'],
                  ['password', 'Password', 'password', 'new-password'],
                  ['password_confirm', 'Confirm password', 'password', 'new-password'],
                ] as const
              ).map(([name, label, type, autoComplete]) => (
                <div key={name}>
                  <label className="mb-1.5 block text-sm font-medium text-brand-accent">{label}</label>
                  <input
                    type={type}
                    autoComplete={autoComplete}
                    className="w-full rounded-xl border border-brand-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
                    {...register(name)}
                  />
                  {errors[name] && (
                    <p className="mt-1 text-xs text-red-600">{errors[name]?.message}</p>
                  )}
                </div>
              ))}
              <p className="text-xs text-brand-accent/50">
                By creating an account you agree to our{' '}
                <Link to="/terms" className="text-brand-pink hover:underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-brand-pink hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-60"
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-brand-accent/60">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-pink hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
