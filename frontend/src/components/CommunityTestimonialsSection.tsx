import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import TestimonialsSection, {
  type TestimonialsSectionData,
} from '@/components/ui/community-testimonial';
import { siteApi } from '@/api';
import type { Testimonial } from '@/types';

const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80',
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=128&h=128&q=80',
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Blogger',
    content:
      'Tasty Fingers has completely elevated my meal times. The quality of their jollof and soups is unmatched — I\'ve never received so many compliments!',
    rating: 5,
    image: FALLBACK_AVATARS[0],
  },
  {
    id: 2,
    name: 'Amaka Okafor',
    role: 'Business Owner',
    content:
      'The customer service is exceptional. They helped me place a catering order for my anniversary and I couldn\'t be happier.',
    rating: 5,
    image: FALLBACK_AVATARS[1],
  },
  {
    id: 3,
    name: 'Chioma Eze',
    role: 'Event Planner',
    content:
      'I recommend Tasty Fingers to all my clients. The meals are premium quality and always arrive fresh. Worth every naira!',
    rating: 5,
    image: FALLBACK_AVATARS[2],
  },
  {
    id: 4,
    name: 'Ngozi Adewale',
    role: 'Influencer',
    content:
      'The variety is amazing. From jollof and soups to grills and sides, they have everything you need for any occasion.',
    rating: 5,
    image: FALLBACK_AVATARS[3],
  },
  {
    id: 5,
    name: 'Tunde Bakare',
    role: 'Photographer',
    content:
      'I\'ve ordered from many restaurants, but Tasty Fingers stands out for their attention to flavour and consistently delicious meals.',
    rating: 5,
    image: FALLBACK_AVATARS[4],
  },
  {
    id: 6,
    name: 'Folake Adeyemi',
    role: 'Creative Director',
    content:
      'Their grilled specialties and soup selection are outstanding. My team loves every order. Tasty Fingers is my go-to restaurant.',
    rating: 5,
    image: FALLBACK_AVATARS[5],
  },
];

const ROW_CONFIG: Array<{ id: string; speed: string; direction: 'left' | 'right' }> = [
  { id: 'row1', speed: '50s', direction: 'left' },
  { id: 'row2', speed: '40s', direction: 'right' },
  { id: 'row3', speed: '60s', direction: 'left' },
];

function toCard(t: Testimonial, index: number) {
  return {
    id: String(t.id),
    quote: t.content,
    authorName: t.name,
    authorTitle: t.role || 'Customer',
    avatarUrl: t.image || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length],
  };
}

/** Split testimonials across up to 3 marquee rows; pad short rows for a smooth loop. */
function buildRows(items: Testimonial[]): TestimonialsSectionData['rows'] {
  const source = items.length > 0 ? items : FALLBACK_TESTIMONIALS;
  const rowCount = source.length <= 3 ? 1 : source.length <= 6 ? 2 : 3;
  const buckets: Testimonial[][] = Array.from({ length: rowCount }, () => []);

  source.forEach((item, index) => {
    buckets[index % rowCount].push(item);
  });

  return buckets.map((bucket, rowIndex) => {
    const config = ROW_CONFIG[rowIndex];
    let cards = bucket.map((t, i) => toCard(t, rowIndex * 10 + i));
    // Ensure enough cards so the marquee never looks sparse on mobile
    while (cards.length < 3) {
      cards = [...cards, ...cards.map((c, i) => ({ ...c, id: `${c.id}-dup-${i}` }))];
    }
    return {
      id: config.id,
      speed: config.speed,
      direction: config.direction,
      testimonials: cards,
    };
  });
}

export default function CommunityTestimonialsSection() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: () => siteApi.testimonials(),
  });

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  const data = useMemo<TestimonialsSectionData>(
    () => ({
      title: settings?.testimonials_title || 'What Our Clients Say',
      subtitle:
        settings?.testimonials_subtitle ||
        'Real stories from real customers who have experienced the Tasty Fingers difference',
      rows: buildRows(testimonials),
    }),
    [settings?.testimonials_title, settings?.testimonials_subtitle, testimonials],
  );

  return (
    <section className="w-full overflow-hidden bg-brand-gray-50 dark:bg-dark-surface">
      <TestimonialsSection data={data} />
    </section>
  );
}
