import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import CategoryCard from '@/components/CategoryCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productsApi } from '@/api';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => productsApi.categories(),
  });

  return (
    <>
      <SEO
        title="Menu Categories"
        description="Browse Tasty Fingers by category — jollof, soups, rice dishes, grilled meals, and more."
      />

      <div className="section-padding max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-luxury bg-gradient-to-br from-brand-pink-dark via-brand-pink to-brand-pink-dark px-6 py-10 md:px-10 md:py-12 mb-8 md:mb-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl"
          />
          <div className="relative text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/90 mb-3">
              Browse the Menu
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white mb-4">
              Menu Categories
            </h1>
            <p className="text-white/85 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Explore our food categories — jollof, soups, rice dishes, grilled specialties,
              sides, and drinks for delivery or pickup.
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <LoadingSpinner fullScreen={false} />
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-luxury shadow-card border border-brand-gray-100">
            <p className="text-4xl mb-3">✦</p>
            <p className="text-brand-accent/60">No categories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-block rounded-full border border-brand-pink px-8 py-3 text-sm font-semibold text-brand-pink transition-all hover:bg-brand-pink hover:text-white"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </>
  );
}
