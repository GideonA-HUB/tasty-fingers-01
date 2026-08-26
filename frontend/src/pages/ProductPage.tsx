import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductReviews from '@/components/ui/product-reviews';
import StarRating from '@/components/StarRating';
import MultiCurrencyPrice from '@/components/MultiCurrencyPrice';
import ProductShare from '@/components/ProductShare';
import { productsApi } from '@/api';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { formatGrams, formatPrice } from '@/utils/format';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const currencySettings = useCurrencyStore((s) => s.settings);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.get(slug!).then((r) => r.data),
    enabled: !!slug,
    retry: 1,
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;
  if (error) {
    return (
      <div className="section-padding text-center py-20">
        <p className="text-brand-accent/50">Something went wrong. Please try again.</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="section-padding text-center py-20">
        <p className="text-brand-accent/50">Product not found</p>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : product.primary_image
    ? [{ id: 0, image: product.primary_image, alt_text: product.name, is_primary: true, order: 0 }]
    : [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.primary_image,
    offers: {
      '@type': 'Offer',
      price: product.current_price,
      priceCurrency: 'NGN',
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <SEO
        title={product.meta_title || product.name}
        description={
          product.meta_description ||
          product.short_description ||
          product.description?.slice(0, 160)
        }
        image={product.primary_image || undefined}
        canonical={`${window.location.origin}/product/${product.slug}`}
        type="product"
        schema={productSchema}
      />

      <div className="bg-brand-gradient py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white text-sm">
          <span className="font-medium">{product.category_name || 'Menu'}</span>
          <span className="text-white/80 hidden sm:inline">Freshly prepared · Order online</span>
        </div>
      </div>

      <div className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr] gap-6 lg:gap-10 items-start">
          {/* Gallery */}
          <div className="w-full max-w-md mx-auto lg:max-w-[360px] lg:mx-0">
            {images.length > 1 ? (
              <Swiper modules={[Pagination, Navigation]} pagination navigation className="rounded-card overflow-hidden">
                {images.map((img) => (
                  <SwiperSlide key={img.id}>
                    <div className="aspect-[4/5] lg:aspect-[3/4] lg:max-h-[380px] bg-brand-gray-50">
                      <img
                        src={img.image}
                        alt={img.alt_text || product.name}
                        className="w-full h-full object-cover object-[center_top]"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : images.length === 1 ? (
              <div className="aspect-[4/5] lg:aspect-[3/4] lg:max-h-[380px] rounded-card overflow-hidden bg-brand-gray-50">
                <img
                  src={images[0].image}
                  alt={product.name}
                  className="w-full h-full object-cover object-[center_top]"
                />
              </div>
            ) : (
              <div className="aspect-[4/5] lg:aspect-[3/4] lg:max-h-[380px] rounded-card bg-brand-gray-50 flex items-center justify-center text-brand-accent/20 text-6xl">
                ✦
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {product.category_name && (
              <p className="text-xs text-brand-pink font-medium uppercase tracking-wider">
                {product.category_name}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-display font-semibold">{product.name}</h1>

            {(product.review_count ?? 0) > 0 && product.average_rating != null && (
              <a href="#reviews" className="inline-flex items-center gap-1.5">
                <StarRating value={product.average_rating} size="md" />
                <span className="text-sm font-medium text-brand-accent/60 dark:text-gray-400">
                  ({product.review_count})
                </span>
              </a>
            )}

            <div className="flex items-start gap-3 flex-wrap">
              <MultiCurrencyPrice
                amountNgn={product.current_price}
                settings={currencySettings}
                size="lg"
              />
              {product.is_on_sale && (
                <>
                  <span className="text-lg text-brand-accent/40 line-through self-center">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-brand-pink text-white text-xs font-semibold px-2 py-1 rounded-full self-center">
                    -{product.discount_percentage}%
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {product.density && (
                <span className="px-3 py-1.5 rounded-full bg-brand-gray-50 text-brand-accent/70">
                  Portion: {formatGrams(product.density)}
                </span>
              )}
            </div>

            <p className={`text-sm font-medium ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
              {product.in_stock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>

            {product.in_stock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-brand-gray-200 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:text-brand-black dark:hover:text-white"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:text-brand-black dark:hover:text-white"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 min-h-[44px]"
                >
                  {added ? 'Added to Cart ✓' : 'Add to Cart'}
                </button>
              </div>
            )}

            <ProductShare
              name={product.name}
              description={product.short_description || product.description}
              url={`${window.location.origin}/product/${product.slug}`}
            />

            <div className="pt-6 border-t border-brand-gray-100">
              <h3 className="font-semibold mb-3">Description</h3>
              <div className="text-sm text-brand-accent/70 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Reviews */}
      <ProductReviews
        productSlug={slug!}
        averageRating={product.average_rating}
        reviewCount={product.review_count}
      />
    </>
  );
}
