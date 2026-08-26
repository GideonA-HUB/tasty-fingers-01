import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productsApi } from '@/api';
import type { Product } from '@/types';

const FILTERS = [
  { id: '', label: 'Full Menu', hint: 'All meals' },
  { id: 'flash-sales', label: "Today's Deals", hint: 'Limited offers' },
  { id: 'new-arrivals', label: 'Tasty Combos', hint: 'Bundles & sets' },
  { id: 'bestsellers', label: 'Popular Meals', hint: 'Guest favourites' },
  { id: 'featured', label: "Chef's Picks", hint: 'Recommended' },
] as const;

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || '';
  const category = categorySlug || searchParams.get('category') || '';

  const { data: categoryData } = useQuery({
    queryKey: ['category', category],
    queryFn: () => productsApi.category(category).then((r) => r.data),
    enabled: !!category,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-filter'],
    queryFn: () => productsApi.categories(),
  });

  const { data, isLoading } = useQuery<{ results: Product[]; count: number }>({
    queryKey: ['products', search, filter, category],
    queryFn: async () => {
      if (search) {
        const res = await productsApi.search(search);
        return { results: res.data.results, count: res.data.count };
      }
      if (filter === 'featured') {
        const results = await productsApi.featured();
        return { results, count: results.length };
      }
      if (filter === 'new-arrivals') {
        const results = await productsApi.newArrivals();
        return { results, count: results.length };
      }
      if (filter === 'bestsellers') {
        const results = await productsApi.bestsellers();
        return { results, count: results.length };
      }
      if (filter === 'flash-sales') {
        const results = await productsApi.flashSales();
        return { results, count: results.length };
      }
      const params: Record<string, string> = {};
      if (category) params.category = category;
      const res = await productsApi.list(params);
      return { results: res.data.results, count: res.data.count };
    },
  });

  const title = search
    ? `Search: ${search}`
    : categoryData?.name
      ? categoryData.name
      : filter === 'new-arrivals'
        ? 'Tasty Combos'
        : filter === 'bestsellers'
          ? 'Popular Meals'
          : filter === 'featured'
            ? "Chef's Picks"
            : filter === 'flash-sales'
              ? "Today's Deals"
              : 'Full Menu';

  const description = categoryData?.description
    ? categoryData.description
    : `Browse ${title.toLowerCase()} at Tasty Fingers`;

  const setFilter = (id: string) => {
    if (id) {
      navigate(`/shop?filter=${encodeURIComponent(id)}`);
      return;
    }
    navigate('/shop');
  };

  return (
    <>
      <SEO title={title} description={description} />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-pink/20 to-transparent" />
        <div className="relative section-padding mx-auto max-w-7xl">
          {categoryData && (
            <Link
              to="/categories"
              className="mb-3 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-brand-pink hover:underline"
            >
              ← All Categories
            </Link>
          )}

          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-brand-accent/50">
                {data?.count ?? 0} meal{(data?.count ?? 0) !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* Modern filter bar */}
          {!search && !category && (
            <div className="mb-8 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-2 rounded-2xl border border-brand-gray-100 bg-white/80 p-2 shadow-card backdrop-blur-sm dark:bg-brand-black/40">
                {FILTERS.map((f) => {
                  const active = filter === f.id;
                  return (
                    <button
                      key={f.id || 'all'}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={`group relative rounded-xl px-4 py-3 text-left transition ${
                        active
                          ? 'bg-gradient-to-br from-brand-pink to-brand-pink-dark text-white shadow-md shadow-brand-pink/30'
                          : 'hover:bg-brand-pink/5 text-brand-accent'
                      }`}
                    >
                      <span className={`block text-sm font-semibold ${active ? 'text-white' : ''}`}>
                        {f.label}
                      </span>
                      <span
                        className={`block text-[11px] ${
                          active ? 'text-white/75' : 'text-brand-accent/45'
                        }`}
                      >
                        {f.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category chips */}
          {!search && categories && categories.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  !category && !filter
                    ? 'bg-brand-black text-white'
                    : 'bg-white border border-brand-gray-200 text-brand-accent/70 hover:border-brand-pink'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigate(`/shop/category/${cat.slug}`)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    category === cat.slug
                      ? 'bg-brand-pink text-white shadow-sm'
                      : 'bg-white border border-brand-gray-200 text-brand-accent/70 hover:border-brand-pink'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {categoryData?.description && (
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-brand-accent/70">
              {categoryData.description}
            </p>
          )}

          {isLoading ? (
            <LoadingSpinner fullScreen={false} />
          ) : data?.results.length === 0 ? (
            <div className="rounded-2xl border border-brand-gray-100 bg-white py-20 text-center shadow-card">
              <p className="mb-3 text-4xl">✦</p>
              <p className="text-brand-accent/60">No meals found in this selection yet.</p>
              <Link to="/shop" className="btn-outline mt-6 inline-block text-sm">
                View Full Menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {data?.results.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
