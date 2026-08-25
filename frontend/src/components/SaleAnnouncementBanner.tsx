import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { siteApi } from '@/api';

const DEFAULT_MARQUEE =
  'Tasty Fingers presents Mid Year Preorder Sales — bringing special meal deals to your doorstep with 30% off website orders, 20% off WhatsApp orders, and free extras. Running July 20th – 25th, 2026. Please read our Terms of Service before ordering. · ';

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) return 'July 20th – 25th, 2026';
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const s = start ? new Date(start).toLocaleDateString('en-US', opts) : '';
  const e = end ? new Date(end).toLocaleDateString('en-US', opts) : '';
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

export default function SaleAnnouncementBanner() {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['sale-announcements'],
    queryFn: () => siteApi.saleAnnouncements(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return null;

  const announcement = announcements[0];
  if (!announcement) return null;

  const megaphone =
    announcement.megaphone_image || `${import.meta.env.BASE_URL}announcements/megaphone.png`;
  const poster =
    announcement.poster_image || `${import.meta.env.BASE_URL}announcements/poster.png`;
  const marquee = (announcement.marquee_text || DEFAULT_MARQUEE).trim();
  const marqueeLoop = `${marquee}  ·  ${marquee}  ·  `;
  const ctaPath = announcement.cta_url?.startsWith('http')
    ? announcement.cta_url
    : announcement.cta_url || '/shop';
  const dateLabel = formatDateRange(announcement.start_date, announcement.end_date);

  return (
    <section className="relative overflow-hidden border-y border-brand-pink/30 bg-brand-gradient">
      {/* Continuous marquee */}
      <div className="border-b border-brand-pink/25 bg-brand-pink py-2.5 overflow-hidden">
        <div className="animate-announcement-marquee flex w-max whitespace-nowrap">
          <span className="px-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white">
            {marqueeLoop}
          </span>
          <span
            className="px-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white"
            aria-hidden
          >
            {marqueeLoop}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)_minmax(0,0.95fr)] lg:items-center lg:gap-8">
          {/* Megaphone graphic */}
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
            <div className="absolute inset-0 rounded-full bg-brand-pink/25 blur-3xl scale-90" aria-hidden />
            <img
              src={megaphone}
              alt="Sale announcement"
              className="relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(230,46,114,0.35)]"
              loading="lazy"
            />
          </div>

          {/* Copy */}
          <div className="text-center lg:text-left space-y-4">
            {announcement.badge_text && (
              <span className="inline-flex items-center rounded-full border border-brand-pink/50 bg-brand-pink/15 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-brand-pink">
                {announcement.badge_text}
              </span>
            )}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight">
              {announcement.title}
            </h2>
            {announcement.headline && (
              <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto lg:mx-0">
                {announcement.headline}
              </p>
            )}

            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {announcement.offer_website && (
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-white">
                  {announcement.offer_website}
                </span>
              )}
              {announcement.offer_whatsapp && (
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-white">
                  {announcement.offer_whatsapp}
                </span>
              )}
              {announcement.offer_extra && (
                <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white sm:text-xs">
                  {announcement.offer_extra}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-white/55">
              Dates: <span className="text-white font-medium">{dateLabel}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              {ctaPath.startsWith('http') ? (
                <a
                  href={ctaPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-pink shadow-lg transition hover:bg-brand-orange-pale"
                >
                  {announcement.cta_label || 'Order Now'}
                </a>
              ) : (
                <Link
                  to={ctaPath}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-pink shadow-lg transition hover:bg-brand-orange-pale"
                >
                  {announcement.cta_label || 'Order Now'}
                </Link>
              )}
              <Link
                to="/terms"
                className="text-xs text-white/60 underline-offset-4 hover:text-white hover:underline sm:text-sm"
              >
                Read Terms of Service
              </Link>
            </div>
          </div>

          {/* Poster */}
          <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] lg:max-w-none">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-brand-pink-dark/40 shadow-[0_24px_60px_rgba(0,0,0,0.45)] rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <img
                src={poster}
                alt={announcement.title}
                className="w-full h-auto object-cover aspect-[3/4]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
