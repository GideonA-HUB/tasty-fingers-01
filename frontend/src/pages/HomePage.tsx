import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import PaginatedProductGrid from '@/components/PaginatedProductGrid';
import SaleAnnouncementBanner from '@/components/SaleAnnouncementBanner';
import CategoryCard from '@/components/CategoryCard';
import CommunityTestimonialsSection from '@/components/CommunityTestimonialsSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import HomeHero from '@/components/HomeHero';
import { productsApi } from '@/api';
import type { Category, Product } from '@/types';

export default function HomePage() {
  const [now, setNow] = useState(() => Date.now());

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories', 'featured'],
    queryFn: () => productsApi.categories({ featured: true }),
  });

  const { data: featured = [] } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.featured(),
  });

  const { data: newArrivals = [] } = useQuery<Product[]>({
    queryKey: ['new-arrivals'],
    queryFn: () => productsApi.newArrivals(),
  });

  const { data: bestsellers = [] } = useQuery<Product[]>({
    queryKey: ['bestsellers'],
    queryFn: () => productsApi.bestsellers(),
  });

  const { data: flashSales = [] } = useQuery<Product[]>({
    queryKey: ['flash-sales'],
    queryFn: () => productsApi.flashSales(),
  });

  const heroCategory = categories[0];
  const gridCategories = categories.slice(1, 3);
  const desktopCategories = categories.slice(0, 3);

  const flashTimer = useMemo(() => {
    if (!flashSales.length) return null;

    const windows = flashSales.map((product) => {
      const start = product.flash_sale_start_at
        ? new Date(product.flash_sale_start_at).getTime()
        : null;
      const end = product.flash_sale_end_at
        ? new Date(product.flash_sale_end_at).getTime()
        : null;
      return {
        start: start && !Number.isNaN(start) ? start : null,
        end: end && !Number.isNaN(end) ? end : null,
      };
    });

    const activeEnds = windows
      .filter((w) => w.end && w.end > now && (!w.start || w.start <= now))
      .map((w) => w.end as number);
    if (activeEnds.length) {
      return { mode: 'ends' as const, target: Math.min(...activeEnds) };
    }

    const upcomingStarts = windows
      .filter((w) => w.start && w.start > now && (!w.end || w.end > now))
      .map((w) => w.start as number);
    if (upcomingStarts.length) {
      return { mode: 'starts' as const, target: Math.min(...upcomingStarts) };
    }

    const futureEnds = windows
      .filter((w) => w.end && w.end > now)
      .map((w) => w.end as number);
    if (futureEnds.length) {
      return { mode: 'ends' as const, target: Math.min(...futureEnds) };
    }

    return null;
  }, [flashSales, now]);

  useEffect(() => {
    if (!flashTimer) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [flashTimer]);

  const countdown = useMemo(() => {
    if (!flashTimer) return null;
    const ms = Math.max(0, flashTimer.target - now);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return { mode: flashTimer.mode, days, hours, minutes, seconds };
  }, [flashTimer, now]);

  return (
    <>
      <SEO />

      <HomeHero />
      <SaleAnnouncementBanner />

      {categories.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          <div className="lg:hidden">
            {heroCategory && (
              <div className="mb-4">
                <CategoryCard category={heroCategory} variant="hero" />
              </div>
            )}
            {gridCategories.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {gridCategories.map((cat, i) => (
                  <CategoryCard key={cat.id} category={cat} index={i} />
                ))}
              </div>
            )}
          </div>

          {desktopCategories.length >= 3 && (
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {desktopCategories.slice(0, 3).map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Today's Deals (formerly Flash Sales) */}
      <section className="section-padding max-w-7xl mx-auto bg-brand-gradient text-white rounded-card shadow-orange">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 mb-1">Limited Time</p>
            <h2 className="text-xl md:text-2xl font-display font-semibold">Today&apos;s Deals</h2>
            {countdown ? (
              <p className="text-sm text-white/80 mt-1">
                {countdown.mode === 'starts' ? 'Starts in' : 'Ends in'}{' '}
                {countdown.days}d : {String(countdown.hours).padStart(2, '0')}h :{' '}
                {String(countdown.minutes).padStart(2, '0')}m :{' '}
                {String(countdown.seconds).padStart(2, '0')}s
              </p>
            ) : (
              <p className="text-sm text-white/75 mt-1">Check back soon for hot meal deals</p>
            )}
          </div>
          <Link to="/shop?filter=flash-sales" className="rounded-full border-2 border-white bg-white/10 px-5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-brand-pink">
            View All Deals →
          </Link>
        </div>

        {flashSales.length > 0 ? (
          <PaginatedProductGrid products={flashSales} itemLabel="deals" dark />
        ) : (
          <div className="text-sm text-white/70 py-6">No deals running right now — explore our full menu.</div>
        )}
      </section>

      {featured.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Chef&apos;s Picks</h2>
            <Link to="/shop?filter=featured" className="btn-ghost text-xs">
              View Full Menu →
            </Link>
          </div>
          <PaginatedProductGrid products={featured} itemLabel="chef picks" />
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto bg-brand-orange-pale/60 dark:bg-dark-elevated">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Tasty Combos</h2>
            <Link to="/shop?filter=new-arrivals" className="btn-ghost text-xs">View All →</Link>
          </div>
          <PaginatedProductGrid products={newArrivals} itemLabel="tasty combos" />
        </section>
      )}

      {bestsellers.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Popular Meals</h2>
            <Link to="/shop?filter=bestsellers" className="btn-ghost text-xs">View All →</Link>
          </div>
          <PaginatedProductGrid products={bestsellers} itemLabel="popular meals" />
        </section>
      )}

      <WhyChooseSection />
      <CommunityTestimonialsSection />
    </>
  );
}
