import { Link } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { siteApi } from '@/api';
import BrandLogo from '@/components/BrandLogo';
import { BRAND_EMAIL, BRAND_INSTAGRAM, BRAND_TIKTOK } from '@/constants/brand';
import { cn } from '@/lib/utils';

interface FooterProps {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a2.994 2.994 0 00-2.11-2.12C19.576 3.5 12 3.5 12 3.5s-7.576 0-9.388.566A2.994 2.994 0 00.502 6.186C0 8.007 0 12 0 12s0 3.993.502 5.814a2.994 2.994 0 002.11 2.12C4.424 20.5 12 20.5 12 20.5s7.576 0 9.388-.566a2.994 2.994 0 002.11-2.12C24 15.993 24 12 24 12s0-3.993-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const DEFAULT_TAGLINE =
  'Authentic Nigerian meals for delivery and pickup — jollof, soups, grills, and more.';

const shopLinks = [
  { title: 'All Products', href: '/shop' },
  { title: 'Categories', href: '/categories' },
  { title: 'New Arrivals', href: '/shop?filter=new-arrivals' },
  { title: 'Best Sellers', href: '/shop?filter=bestsellers' },
  { title: 'Flash Sales', href: '/shop?filter=flash-sales' },
];

const companyLinks = [
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
];

const legalLinks = [
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Terms of Service', href: '/terms' },
  { title: 'Refund Policy', href: '/refund' },
];

function FooterLinkColumn({
  label,
  links,
}: {
  label: string;
  links: Array<{ title: string; href: string }>;
}) {
  return (
    <div className="col-span-2 w-full sm:col-span-1">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
        {label}
      </span>
      <div className="flex flex-col gap-0.5">
        {links.map(({ href, title }) => (
          <Link
            key={href}
            to={href}
            className="w-max py-1.5 text-sm text-white/75 transition-colors duration-200 hover:text-white hover:underline"
          >
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MinimalFooter({
  siteName = 'Tasty Fingers',
  tagline,
  contactEmail,
  instagramUrl,
  facebookUrl,
  twitterUrl,
  tiktokUrl,
  youtubeUrl,
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await siteApi.newsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const year = new Date().getFullYear();
  const resolvedEmail = contactEmail || BRAND_EMAIL;
  const resolvedTagline = tagline?.trim() || DEFAULT_TAGLINE;
  const resolvedInstagram = instagramUrl || BRAND_INSTAGRAM;
  const resolvedTiktok = tiktokUrl || BRAND_TIKTOK;

  const socialLinks: Array<{ href: string; label: string; icon: ReactNode; external?: boolean }> = [
    ...(resolvedInstagram
      ? [
          {
            href: resolvedInstagram,
            label: 'Instagram',
            icon: <InstagramIcon className="size-4" />,
            external: true,
          },
        ]
      : []),
    ...(resolvedTiktok
      ? [
          {
            href: resolvedTiktok,
            label: 'TikTok',
            icon: <TikTokIcon className="size-4" />,
            external: true,
          },
        ]
      : []),
    ...(facebookUrl
      ? [
          {
            href: facebookUrl,
            label: 'Facebook',
            icon: <FacebookIcon className="size-4" />,
            external: true,
          },
        ]
      : []),
    ...(twitterUrl
      ? [
          {
            href: twitterUrl,
            label: 'Twitter',
            icon: <TwitterIcon className="size-4" />,
            external: true,
          },
        ]
      : []),
    ...(youtubeUrl
      ? [
          {
            href: youtubeUrl,
            label: 'YouTube',
            icon: <YoutubeIcon className="size-4" />,
            external: true,
          },
        ]
      : []),
    {
      href: `mailto:${resolvedEmail}`,
      label: 'Email',
      icon: <MailIcon className="size-4" />,
      external: false,
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-brand-black text-white">
      {/* Newsletter — retained */}
      <div className="relative z-10 border-b border-white/10 px-4 py-10 sm:px-6 sm:py-12 md:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h3 className="mb-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Join Our Food Circle
          </h3>
          <p className="mb-6 text-sm text-white/55">
            Exclusive access to new menu items, promotions &amp; offers
          </p>
          {subscribed ? (
            <p className="font-medium text-white">Thank you for subscribing!</p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="min-h-[44px] flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white"
                required
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={loading}
                className="min-h-[44px] whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-medium text-brand-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 21st.dev-style minimal frame */}
      <div
        className={cn(
          'relative mx-auto max-w-5xl',
          'bg-[radial-gradient(35%_80%_at_30%_0%,rgba(255,255,255,0.08),transparent)]',
          'md:border-x md:border-white/10',
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px w-full bg-white/10" aria-hidden />

        <div className="grid grid-cols-2 gap-8 p-5 sm:grid-cols-6 sm:gap-6 sm:p-6 md:p-8">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-5 sm:col-span-6 md:col-span-3">
            <Link to="/" className="w-max rounded-lg bg-white px-2.5 py-1.5">
              <BrandLogo variant="navbar" alt={siteName} className="h-9 w-auto sm:h-10" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/50 text-balance">
              {resolvedTagline}
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className="rounded-md border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <a
              href={`mailto:${resolvedEmail}`}
              className="w-max text-sm text-white/55 transition-colors hover:text-white hover:underline"
            >
              {resolvedEmail}
            </a>
          </div>

          <FooterLinkColumn label="Shop" links={shopLinks} />
          <FooterLinkColumn label="Company" links={companyLinks} />
          <FooterLinkColumn label="Legal" links={legalLinks} />
        </div>

        <div className="absolute inset-x-0 h-px w-full bg-white/10" aria-hidden />

        <div className="flex flex-col items-center justify-between gap-2 px-4 py-5 sm:px-6 md:px-8">
          <p className="text-center text-xs font-light text-white/40">
            © {year} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default MinimalFooter;
