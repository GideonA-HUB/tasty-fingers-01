import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import SEO from '@/components/SEO';
import { ordersApi, paymentsApi } from '@/api';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useCustomerStore } from '@/store/customerStore';
import { saveCheckoutDraft, loadCheckoutDraft, savePendingOrder } from '@/lib/checkoutSession';
import { formatPrice } from '@/utils/format';

const checkoutSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: z.string().min(5, 'Delivery address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State / Province is required'),
    country: z.string().optional(),
    order_notes: z.string().optional(),
    payment_method: z.enum(['paystack', 'flutterwave']),
    agreed_to_terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to our Terms of Service and Refund Policy before placing your order.',
    }),
    is_international_delivery: z.boolean(),
    international_region: z.enum(['US', 'UK', 'CA', '']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.is_international_delivery && !data.international_region) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select whether you are in the US, UK, or Canada.',
        path: ['international_region'],
      });
    }
  });

type CheckoutForm = z.infer<typeof checkoutSchema>;

const labelClass = 'text-sm font-medium mb-2 block text-brand-accent';
const errorClass = 'text-red-500 text-xs mt-1';

const REGION_LABELS: Record<'US' | 'UK' | 'CA', string> = {
  US: 'United States',
  UK: 'United Kingdom',
  CA: 'Canada',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal } = useCartStore();
  const currencySettings = useCurrencyStore((s) => s.settings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotal();
  const localDeliveryFee = parseFloat(currencySettings.local_delivery_fee) || 4000;
  const internationalDeliveryFee =
    parseFloat(currencySettings.international_delivery_fee) || 50000;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'Nigeria',
      payment_method: 'paystack',
      agreed_to_terms: false,
      is_international_delivery: false,
      international_region: '',
    },
  });

  const agreedToTerms = watch('agreed_to_terms');
  const isInternational = watch('is_international_delivery');
  const internationalRegion = watch('international_region');
  const paymentMethod = watch('payment_method');

  const deliveryFee = isInternational ? internationalDeliveryFee : localDeliveryFee;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    const draft = loadCheckoutDraft<CheckoutForm>();
    if (draft) {
      reset({
        ...draft,
        payment_method: draft.payment_method === 'flutterwave' ? 'flutterwave' : 'paystack',
        agreed_to_terms: draft.agreed_to_terms ?? false,
        is_international_delivery: draft.is_international_delivery ?? false,
        international_region: draft.international_region ?? '',
      });
      return;
    }
    const user = useCustomerStore.getState().user;
    if (user) {
      reset({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: 'Nigeria',
        payment_method: 'paystack',
        agreed_to_terms: false,
        is_international_delivery: false,
        international_region: '',
      });
    }
  }, [reset]);

  if (items.length === 0) {
    return (
      <div className="section-padding text-center py-20">
        <p className="text-brand-accent/50 mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/shop')} className="btn-primary rounded-full px-8">
          Continue Shopping
        </button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        ...data,
        international_region: data.is_international_delivery ? data.international_region : '',
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
      };
      const orderRes = await ordersApi.checkout(orderData);
      const order = orderRes.data;

      saveCheckoutDraft(data);
      savePendingOrder(order.order_number);

      const paymentRes = await paymentsApi.initialize(
        order.order_number,
        data.payment_method,
      );
      window.location.href = paymentRes.data.authorization_url;
    } catch (err: unknown) {
      let message = err instanceof Error ? err.message : 'Checkout failed. Please try again.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as {
          response?: {
            data?: {
              detail?: string;
              agreed_to_terms?: string[];
              international_region?: string[];
            };
          };
        };
        const responseData = axiosErr.response?.data;
        if (responseData?.agreed_to_terms?.[0]) {
          message = responseData.agreed_to_terms[0];
        } else if (responseData?.international_region?.[0]) {
          message = responseData.international_region[0];
        } else if (responseData?.detail) {
          message = responseData.detail;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const stateLabel = isInternational
    ? internationalRegion === 'US'
      ? 'State *'
      : internationalRegion === 'CA'
        ? 'Province *'
        : 'County / Region *'
    : 'State *';

  const addressPlaceholder = isInternational
    ? 'Full street address including apartment, suite, or unit number...'
    : 'Street address, building, apartment...';

  return (
    <>
      <SEO title="Checkout" description="Complete your Tasty Fingers meal order" />

      <div className="section-padding max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-pink mb-2">
            Secure Checkout
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-brand-black">
            Checkout
          </h1>
          <p className="text-sm text-brand-accent/60 mt-1">
            Complete your delivery details and pay securely.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="order-1 lg:order-2 lg:col-span-5">
            <div className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-5 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-display font-semibold text-brand-black mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-start">
                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-brand-gray-50 shrink-0">
                      {item.product.primary_image ? (
                        <img
                          src={item.product.primary_image}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-[center_top]"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-brand-pink/30 text-lg">
                          ✦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-black truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-brand-accent/50">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap">
                      {formatPrice(parseFloat(item.product.current_price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-gray-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-accent/60">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-accent/60">
                    {isInternational
                      ? `International Delivery (${internationalRegion ? REGION_LABELS[internationalRegion as 'US' | 'UK' | 'CA'] : 'US / UK / Canada'})`
                      : 'Delivery (Nigeria)'}
                  </span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-brand-gray-100">
                  <span>Total</span>
                  <span className="text-brand-pink">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-brand-accent/40 pt-1">
                  All payments are processed in Nigerian Naira (NGN) via Flutterwave.
                </p>
              </div>
            </div>
          </aside>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="order-2 lg:order-1 lg:col-span-7 space-y-6"
          >
            <div className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-5 md:p-8">
              <h2 className="text-lg font-display font-semibold text-brand-black mb-1">
                Delivery Details
              </h2>
              <p className="text-sm text-brand-accent/60 mb-6">
                All fields marked with * are required.
              </p>

              <div className="space-y-5">
                <div
                  className={`rounded-xl border p-4 transition-colors ${
                    isInternational
                      ? 'border-brand-pink bg-brand-pink/5'
                      : 'border-brand-gray-200 dark:border-white/15'
                  }`}
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      {...register('is_international_delivery')}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-gray-300 accent-brand-pink"
                    />
                    <span className="text-sm leading-relaxed text-brand-accent dark:text-gray-200">
                      <span className="font-semibold text-brand-black dark:text-white block mb-1">
                        International delivery (US, UK, or Canada)
                      </span>
                      Check this box if your order should be shipped outside Nigeria. You must
                      provide your complete and accurate international address so we can deliver
                      correctly.
                    </span>
                  </label>

                  {isInternational && (
                    <div className="mt-4 pl-7">
                      <label className={labelClass}>Your location *</label>
                      <select
                        {...register('international_region')}
                        className="input-luxury"
                        defaultValue=""
                      >
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                      </select>
                      {errors.international_region && (
                        <p className={errorClass}>{errors.international_region.message}</p>
                      )}
                      <p className="mt-2 text-xs text-brand-accent/50">
                        International delivery fee: {formatPrice(internationalDeliveryFee)}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    {...register('full_name')}
                    className="input-luxury"
                    placeholder="Your full name"
                    required
                  />
                  {errors.full_name && <p className={errorClass}>{errors.full_name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input-luxury"
                      placeholder="you@example.com"
                      required
                    />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="input-luxury"
                      placeholder={isInternational ? '+1...' : '+234...'}
                      required
                    />
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Delivery Address *</label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="input-luxury resize-none"
                    placeholder={addressPlaceholder}
                    required
                  />
                  {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      {...register('city')}
                      className="input-luxury"
                      placeholder="City"
                      required
                    />
                    {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>{stateLabel}</label>
                    <input
                      {...register('state')}
                      className="input-luxury"
                      placeholder={isInternational ? 'State / Province / County' : 'State'}
                      required
                    />
                    {errors.state && <p className={errorClass}>{errors.state.message}</p>}
                  </div>
                </div>

                {!isInternational && <input type="hidden" {...register('country')} value="Nigeria" />}

                <div>
                  <label className={labelClass}>Order Notes (optional)</label>
                  <textarea
                    {...register('order_notes')}
                    rows={3}
                    className="input-luxury resize-none"
                    placeholder="Special delivery instructions..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-5 md:p-8">
              <h2 className="text-lg font-display font-semibold text-brand-black mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 p-4 rounded-card border transition-all ${
                    paymentMethod === 'paystack'
                      ? 'border-brand-pink bg-brand-pink/5 shadow-sm'
                      : 'border-brand-gray-200 hover:border-brand-pink/40'
                  }`}
                >
                  <input
                    type="radio"
                    value="paystack"
                    {...register('payment_method')}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      paymentMethod === 'paystack'
                        ? 'border-brand-pink bg-brand-pink'
                        : 'border-brand-gray-300'
                    }`}
                  >
                    {paymentMethod === 'paystack' && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-brand-black block">Paystack</span>
                    <span className="text-xs text-brand-accent/50">
                      Cards, bank transfer &amp; USSD
                    </span>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 p-4 rounded-card border transition-all ${
                    paymentMethod === 'flutterwave'
                      ? 'border-brand-pink bg-brand-pink/5 shadow-sm'
                      : 'border-brand-gray-200 hover:border-brand-pink/40'
                  }`}
                >
                  <input
                    type="radio"
                    value="flutterwave"
                    {...register('payment_method')}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      paymentMethod === 'flutterwave'
                        ? 'border-brand-pink bg-brand-pink'
                        : 'border-brand-gray-300'
                    }`}
                  >
                    {paymentMethod === 'flutterwave' && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-brand-black block">Flutterwave</span>
                    <span className="text-xs text-brand-accent/50">
                      Card, bank transfer &amp; mobile money (international cards accepted)
                    </span>
                  </div>
                </label>
              </div>

              <p className="mt-3 text-xs text-brand-accent/50 dark:text-gray-500">
                All payments are processed securely. Choose your preferred payment provider.
              </p>
            </div>

            <div className="surface-card p-5 md:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold page-heading">
                    Legal Agreement
                  </h2>
                  <p className="text-sm page-muted mt-0.5">
                    Please review our policies before completing your purchase.
                  </p>
                </div>
              </div>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
                  agreedToTerms
                    ? 'border-brand-pink bg-brand-pink/5 shadow-sm'
                    : errors.agreed_to_terms
                      ? 'border-red-300 bg-red-50/80 dark:border-red-500/40 dark:bg-red-950/30'
                      : 'border-brand-gray-200 hover:border-brand-pink/40 dark:border-white/15'
                }`}
              >
                <input
                  type="checkbox"
                  {...register('agreed_to_terms')}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-gray-300 accent-brand-pink"
                />
                <span className="text-sm leading-relaxed text-brand-accent dark:text-gray-200">
                  I have read and agree to the{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-pink hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/refund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-pink hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Refund Policy
                  </Link>
                  . I understand these agreements are binding and apply to this order.
                </span>
              </label>
              {errors.agreed_to_terms && (
                <p className={`${errorClass} mt-2`}>{errors.agreed_to_terms.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="btn-primary w-full rounded-full py-3.5 text-sm md:text-base"
            >
              {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>

            <p className="text-center text-xs text-brand-accent/40 pb-2">
              Your payment is processed securely via your selected provider.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
