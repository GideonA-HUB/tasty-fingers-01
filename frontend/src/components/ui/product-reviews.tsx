import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import StarRating from '@/components/StarRating';
import { productsApi } from '@/api';
import type { ProductReview } from '@/types';

interface ProductReviewsProps {
  productSlug: string;
  averageRating?: number | null;
  reviewCount?: number;
}

export default function ProductReviews({
  productSlug,
  averageRating,
  reviewCount = 0,
}: ProductReviewsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productsApi
      .reviews(productSlug)
      .then((data) => {
        if (!cancelled) setReviews(data);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  const displayAverage =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : averageRating?.toFixed(1) ?? '0.0';

  const displayCount = reviews.length > 0 ? reviews.length : reviewCount;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    return {
      rating,
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.comment.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      await productsApi.createReview(productSlug, formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', rating: 5, comment: '' });
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 4000);
    } catch {
      setError('Could not submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-gray-50 dark:bg-dark-surface"
    >
      <div className="relative section-padding max-w-7xl mx-auto">
        {/* Heading block (pink only here) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-luxury bg-gradient-to-br from-brand-pink-dark via-brand-pink to-brand-pink-dark px-6 py-10 md:px-10 md:py-12 mb-10 md:mb-14"
        >
          <motion.div
            style={{ y: parallaxY, opacity: parallaxOpacity }}
            className="pointer-events-none absolute inset-0"
            aria-hidden
          >
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-28 -left-28 h-[24rem] w-[24rem] rounded-full bg-black/10 blur-3xl" />
          </motion.div>

          <div className="relative text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/90 mb-3">
              Guest Reviews
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white mb-4">
              Customer Reviews
            </h2>
            <p className="text-white/85 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Real experiences from our guests — share yours and help others discover their next favourite meal.
            </p>
          </div>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-luxury shadow-luxury border border-white/80 p-6 md:p-10 mb-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-6xl md:text-7xl font-display font-semibold text-brand-pink leading-none">
                {displayAverage}
              </span>
              <StarRating value={Number(displayAverage)} size="lg" />
              <p className="mt-3 text-sm text-brand-accent/60">
                Based on {displayCount} review{displayCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-3">
              {ratingDistribution.map((item, index) => (
                <motion.div
                  key={item.rating}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm text-brand-accent w-10 shrink-0">{item.rating} ★</span>
                  <div className="flex-1 h-2.5 bg-brand-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.05 }}
                      className="h-full bg-gradient-to-r from-brand-pink to-brand-pink/70 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-brand-accent/50 w-6 text-right">{item.count}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reviews grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-pink border-t-transparent" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10">
            {reviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-luxury shadow-card border border-brand-gray-100 p-6 md:p-7 transition-shadow hover:shadow-luxury"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-brand-pink to-brand-pink/60 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-black">{review.name}</h4>
                      <time className="text-xs text-brand-accent/40">
                        {new Date(review.created_at).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>
                  <StarRating value={review.rating} size="sm" />
                </div>
                <p className="text-brand-accent/80 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-14 bg-white rounded-luxury shadow-card border border-brand-gray-100 mb-10"
          >
            <p className="text-4xl mb-3">✦</p>
            <p className="text-brand-accent/60">No reviews yet. Be the first to share your experience.</p>
          </motion.div>
        )}

        {/* CTA / Form */}
        {!showForm && !submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={() => setShowForm(true)}
              className="inline-block bg-white text-brand-pink font-semibold py-3.5 px-10 rounded-full text-sm tracking-wide transition-all hover:bg-white/95 hover:shadow-luxury-lg active:scale-95"
            >
              Write a Review
            </button>
          </motion.div>
        )}

        {showForm && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-6 md:p-10 mt-6"
          >
            <h3 className="text-xl md:text-2xl font-display font-semibold text-brand-black mb-2">
              Share Your Experience
            </h3>
            <p className="text-sm text-brand-accent/60 mb-8">
              Your name will be shown publicly. Email is required for verification only.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-accent mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-luxury"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-accent mb-2">Your Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Your Rating *</label>
                <StarRating
                  value={formData.rating}
                  size="lg"
                  interactive
                  onChange={(rating) => setFormData({ ...formData, rating })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Your Review *</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={5}
                  className="input-luxury resize-none"
                  required
                  placeholder="Tell us about the quality, fit, and how you feel wearing it..."
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3 rounded-full"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline px-8 py-3 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-brand-pink to-brand-pink/90 text-white text-center py-10 px-6 rounded-luxury shadow-luxury mt-6"
          >
            <p className="text-3xl mb-2">✦</p>
            <h3 className="text-xl font-display font-semibold mb-2">Thank You!</h3>
            <p className="text-white/90 text-sm md:text-base">
              Your review has been submitted and will appear after our team approves it.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
