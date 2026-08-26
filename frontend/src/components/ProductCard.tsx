import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MultiCurrencyPrice from '@/components/MultiCurrencyPrice';
import ProductShare from '@/components/ProductShare';
import StarRating from '@/components/StarRating';
import type { Product } from '@/types';
import { truncateText } from '@/utils/format';
import { useCurrencyStore } from '@/store/currencyStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const currencySettings = useCurrencyStore((s) => s.settings);
  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/product/${product.slug}`
      : `/product/${product.slug}`;

  const reviewCount = product.review_count ?? 0;
  const averageRating = product.average_rating ?? 0;
  const showRating = reviewCount > 0 && averageRating > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="luxury-card group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-gray-50 dark:bg-dark-elevated">
        <Link to={`/product/${product.slug}`} className="block h-full">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-accent/30">
              <span className="text-3xl">✦</span>
            </div>
          )}
        </Link>
        {product.is_on_sale && (
          <span className="absolute left-2 top-2 z-[1] rounded-full bg-brand-black px-2 py-0.5 text-[10px] font-semibold text-white">
            -{product.discount_percentage}%
          </span>
        )}
        {product.is_new_arrival && (
          <span className="absolute right-2 top-2 z-[1] rounded-full bg-brand-black px-2 py-0.5 text-[10px] font-semibold text-white">
            New
          </span>
        )}
        <div
          className={`absolute z-[2] ${
            product.is_new_arrival ? 'right-2 top-9' : 'right-2 top-2'
          }`}
        >
          <ProductShare
            compact
            name={product.name}
            description={product.short_description}
            url={productUrl}
          />
        </div>
        {product.is_flash_sale && (
          <span className="absolute bottom-2 left-2 z-[1] rounded-full bg-brand-pink px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            Deal
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2.5 sm:gap-1.5 sm:p-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-brand-accent transition-colors group-hover:text-brand-black dark:text-gray-100 dark:group-hover:text-white sm:text-sm">
            {truncateText(product.name, 42)}
          </h3>
        </Link>

        {showRating && (
          <Link
            to={`/product/${product.slug}#reviews`}
            className="inline-flex items-center gap-0.5 leading-none"
            aria-label={`${averageRating} out of 5 stars, ${reviewCount} review${reviewCount !== 1 ? 's' : ''}`}
          >
            <StarRating value={averageRating} size="sm" />
            <span className="ml-0.5 text-[11px] font-medium text-brand-accent/55 dark:text-gray-400">
              ({reviewCount})
            </span>
          </Link>
        )}

        <MultiCurrencyPrice
          amountNgn={product.current_price}
          compareAtNgn={product.is_on_sale ? product.price : undefined}
          settings={currencySettings}
          compact
        />

        <Link
          to={`/product/${product.slug}`}
          className="btn-ghost mt-auto block w-full py-1.5 text-center text-[11px] sm:py-2 sm:text-xs"
        >
          Select Options
        </Link>
      </div>
    </motion.div>
  );
}
