import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEO from '@/components/SEO';
import { siteApi } from '@/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setError('');
    try {
      await siteApi.contact(data);
      setSubmitted(true);
      reset();
    } catch {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with Tasty Fingers" />
      <div className="section-padding max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-pink mb-3">
              Contact
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-semibold mb-3 text-brand-black">
              Contact Us
            </h1>
            <p className="text-brand-accent/70 text-sm md:text-base max-w-md">
              We’d love to hear from you. Send a message and our team will get back to you shortly.
            </p>

            <div className="mt-6 rounded-luxury bg-gradient-to-br from-brand-pink-dark via-brand-pink to-brand-pink-dark p-6 text-white shadow-luxury">
              <p className="text-sm font-medium">Delicious Meals, Delivered with Care</p>
              <p className="text-white/85 text-sm mt-2">
                Share what you’re craving (jollof, soups, grilled meals, or catering) and we’ll help you place the perfect order.
              </p>
            </div>
          </div>

        {submitted ? (
          <div className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-8 md:p-10">
            <div className="text-center py-8">
              <p className="text-4xl mb-3">✦</p>
              <p className="text-brand-pink font-medium mb-2">Message Sent!</p>
              <p className="text-sm text-brand-accent/60">We’ll get back to you shortly.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline text-sm mt-6">
                Send Another
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-6 md:p-10">
            <h2 className="text-xl md:text-2xl font-display font-semibold text-brand-black mb-2">
              Send a Message
            </h2>
            <p className="text-sm text-brand-accent/60 mb-8">
              We typically respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium mb-2 block text-brand-accent">Name *</label>
                  <input {...register('name')} className="input-luxury" placeholder="Your full name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-brand-accent">Email *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-luxury"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-brand-accent">Phone (optional)</label>
                <input {...register('phone')} className="input-luxury" placeholder="+234..." />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-brand-accent">Message *</label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="input-luxury resize-none"
                  placeholder="Tell us what you're craving (meals, catering, delivery)..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 rounded-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
