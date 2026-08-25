import { Helmet } from 'react-helmet-async';
import { getBrandLogoUrl, useSiteAssets } from '@/hooks/useSiteAssets';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  schema?: Record<string, unknown>;
}

const SITE_NAME = 'Tasty Fingers';
const DEFAULT_DESCRIPTION =
  'Order delicious Nigerian and continental meals online from Tasty Fingers — jollof rice, soups, peppered meats, seafood, snacks, and drinks. Delivery, takeaway, and pickup.';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image,
  type = 'website',
  schema,
}: SEOProps) {
  const { assets } = useSiteAssets();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Premium Restaurant & Food Ordering`;
  const siteUrl = window.location.origin;
  const canonicalUrl = canonical || window.location.href;
  const resolvedImage = image || getBrandLogoUrl(assets);
  const imageUrl = resolvedImage.startsWith('http') ? resolvedImage : `${siteUrl}${resolvedImage}`;

  const restaurantSchema = schema || {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: siteUrl,
    image: imageUrl,
    servesCuisine: ['Nigerian', 'African', 'Continental'],
    priceRange: '₦₦',
    acceptsReservations: false,
    hasMenu: `${siteUrl}/shop`,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(restaurantSchema)}</script>
    </Helmet>
  );
}
