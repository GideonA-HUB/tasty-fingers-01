import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PulseFitHero } from '@/components/ui/pulse-fit-hero';
import { siteApi } from '@/api';
import type { SiteSettings } from '@/types';

interface HeroImageApi {
  id: number;
  image: string;
  alt_text: string;
  category: string;
  title: string;
  link_url: string;
  order: number;
  is_active: boolean;
}

const FALLBACK_CARDS = [
  {
    image:
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'JOLLOF',
    title: 'Party Jollof & Rice Specials',
    link_url: '/shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'SOUPS',
    title: 'Egusi, Okra & Native Soups',
    link_url: '/shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'GRILLS',
    title: 'Suya, Chicken & BBQ',
    link_url: '/shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'SIDES',
    title: 'Plantain, Fries & Extras',
    link_url: '/shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1544145945-f904253e6167?w=800&h=1000&fit=crop&auto=format&q=80',
    category: 'DRINKS',
    title: 'Fresh Juices & Soft Drinks',
    link_url: '/shop',
  },
];

const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&auto=format&q=80',
];

function resolvePath(path: string | undefined, fallback: string) {
  const value = (path || fallback).trim();
  if (!value) return fallback;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return value.startsWith('/') ? value : `/${value}`;
}

export default function HomeHero() {
  const navigate = useNavigate();

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: heroImages = [] } = useQuery<HeroImageApi[]>({
    queryKey: ['hero-images'],
    queryFn: async () => {
      const response = await fetch('/api/v1/site/hero-images/');
      if (!response.ok) return [];
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const go = (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      window.location.href = path;
      return;
    }
    navigate(path);
  };

  const title =
    settings?.hero_title?.trim() ||
    'Order Your Favourite Meals';
  const subtitle =
    settings?.hero_subtitle?.trim() ||
    settings?.meta_description?.trim() ||
    'Explore our menu of jollof, soups, grilled specialties, sides, and drinks. Fresh meals for delivery or pickup.';
  const eyebrow =
    settings?.hero_eyebrow?.trim() ||
    settings?.tagline?.trim() ||
    settings?.site_name ||
    'Premium Restaurant & Food Ordering';

  const primaryLabel = settings?.hero_primary_cta_label?.trim() || 'Order Now';
  const primaryUrl = resolvePath(settings?.hero_primary_cta_url, '/shop');
  const secondaryLabel = settings?.hero_secondary_cta_label?.trim() || 'Browse Menu';
  const secondaryUrl = resolvePath(settings?.hero_secondary_cta_url, '/categories');

  const cards =
    heroImages.length > 0
      ? heroImages.map((img) => ({
          image: img.image,
          category: img.category?.trim() || 'MENU',
          title: img.title?.trim() || img.alt_text?.trim() || 'Featured Meal',
          onClick: () => go(resolvePath(img.link_url, '/shop')),
        }))
      : FALLBACK_CARDS.map((card) => ({
          ...card,
          onClick: () => go(card.link_url),
        }));

  return (
    <PulseFitHero
      showHeader={false}
      logo={settings?.site_name || 'Tasty Fingers'}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryAction={{
        label: primaryLabel,
        onClick: () => go(primaryUrl),
      }}
      secondaryAction={{
        label: secondaryLabel,
        onClick: () => go(secondaryUrl),
      }}
      disclaimer={
        settings?.hero_disclaimer?.trim() ||
        'Nationwide delivery · Secure checkout · Fresh meals guaranteed'
      }
      socialProof={{
        avatars: FALLBACK_AVATARS,
        text:
          settings?.hero_social_proof_text?.trim() ||
          'Trusted by food lovers across Nigeria',
      }}
      programs={cards}
    />
  );
}
