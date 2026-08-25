import { useSearchParams, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { productsApi } from '@/api';
import type { Product } from '@/types';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || '';
  const category = categorySlug || searchParams.get('category') || '';

  const { data: categoryData } = useQuery({
    queryKey: ['category', category],
    queryFn: () => productsApi.category(category).then((r) => r.data),
    enabled: !!category,
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
    ? 'New Arrivals'
    : filter === 'bestsellers'
    ? 'Best Sellers'
    : filter === 'featured'
    ? 'Featured'
    : filter === 'flash-sales'
    ? 'Flash Sales'
    : 'All Meals';

  const description = categoryData?.description
    ? categoryData.description
    : `Browse ${title.toLowerCase()} at Tasty Fingers`;

  return (
    <>
      <SEO title={title} description={description} />
      <div className="section-padding max-w-7xl mx-auto">
        {categoryData && (
          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-brand-pink mb-3 hover:underline"
          >
            ← All Categories
          </Link>
        )}

        <h1 className="text-2xl md:text-3xl font-display font-semibold mb-2">{title}</h1>
        <p className="text-sm text-brand-accent/50 mb-6">
          {data?.count ?? 0} item{(data?.count ?? 0) !== 1 ? 's' : ''} available
        </p>

        {categoryData?.description && (
          <p className="text-sm text-brand-accent/70 max-w-2xl mb-6 leading-relaxed">
            {categoryData.description}
          </p>
        )}

        {isLoading ? (
          <LoadingSpinner fullScreen={false} />
        ) : data?.results.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-luxury shadow-card border border-brand-gray-100">
            <p className="text-4xl mb-3">✦</p>
            <p className="text-brand-accent/60">No products found in this category yet.</p>
            <Link to="/categories" className="btn-outline text-sm mt-6 inline-block">
              Browse Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.results.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
