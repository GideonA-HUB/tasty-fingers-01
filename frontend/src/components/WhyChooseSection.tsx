import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import FeatureCarousel, {
  type FeatureCarouselItem,
} from '@/components/ui/feature-carousel';
import { siteApi } from '@/api';
import type { WhyChooseItem } from '@/types';

const FALLBACK_FEATURES: FeatureCarouselItem[] = [
  {
    id: 'authentic',
    label: 'Authentic Nigerian Flavours',
    description: 'Homestyle recipes prepared with quality ingredients.',
    image:
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'curated',
    label: 'Full Menu Selection',
    description: 'Jollof, soups, grills, sides, drinks & more.',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'her-him',
    label: 'Meals for Everyone',
    description: 'Portions and dishes for individuals, families & groups.',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'quality',
    label: 'Fresh Every Day',
    description: 'Made to order so every meal arrives hot and delicious.',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'elegance',
    label: 'Crowd Favourites',
    description: 'Signature dishes that keep customers coming back.',
    image:
      'https://images.unsplash.com/photo-1544145945-f904253e6167?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'delivery',
    label: 'Fast Delivery',
    description: 'Swift nationwide delivery and convenient pickup.',
    image:
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
  {
    id: 'gifts',
    label: 'Catering Ready',
    description: 'Perfect for parties, offices, and special occasions.',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=1500&fit=crop&auto=format&q=80',
  },
];

function toFeatures(items: WhyChooseItem[]): FeatureCarouselItem[] {
  if (!items.length) return FALLBACK_FEATURES;

  return items.map((item, index) => ({
    id: String(item.id),
    label: item.title,
    description: item.description,
    image:
      item.image ||
      FALLBACK_FEATURES[index % FALLBACK_FEATURES.length].image,
  }));
}

export default function WhyChooseSection() {
  const { data: items = [] } = useQuery({
    queryKey: ['why-choose'],
    queryFn: () => siteApi.whyChoose(),
  });

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  const title = settings?.why_choose_title || 'Why Choose Tasty Fingers';
  const subtitle =
    settings?.why_choose_subtitle || 'Authentic Nigerian meals, prepared fresh for you';

  const features = toFeatures(items);

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[40vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-14 text-center sm:px-6 sm:pb-8 sm:pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-2xl"
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
            The Tasty Fingers Difference
          </p>
          <h2 className="mb-3 font-display text-3xl font-semibold text-white sm:mb-4 sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-white/65 sm:text-base">{subtitle}</p>
        </motion.div>
      </div>

      <div className="relative pb-14 sm:pb-20 md:pb-24">
        <FeatureCarousel features={features} />
      </div>
    </section>
  );
}
