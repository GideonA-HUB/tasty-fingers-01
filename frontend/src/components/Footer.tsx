import { Link } from 'react-router-dom';
import { useState } from 'react';
import { siteApi } from '@/api';
import BrandLogo from '@/components/BrandLogo';

interface FooterProps {
  siteName?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}

export default function Footer({
  siteName = 'Tasty Fingers',
  instagramUrl,
  facebookUrl,
  twitterUrl,
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

  return (
    <footer className="bg-brand-accent text-white">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Newsletter */}
        <div className="text-center mb-10 pb-10 border-b border-white/10">
          <h3 className="text-xl font-display font-semibold mb-2">Join Our Food Circle</h3>
          <p className="text-white/60 text-sm mb-6">Exclusive access to new menu items, promotions & offers</p>
          {subscribed ? (
            <p className="font-medium text-white">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-medium text-brand-black transition hover:bg-brand-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <BrandLogo variant="footer" alt={siteName} className="mb-4 h-8 w-auto" />
            <p className="text-white/50 text-sm leading-relaxed">
              Authentic Nigerian meals for delivery and pickup — jollof, soups, grills, and more.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/shop" className="transition-colors hover:text-white">All Products</Link></li>
              <li><Link to="/shop?filter=new-arrivals" className="transition-colors hover:text-white">New Arrivals</Link></li>
              <li><Link to="/shop?filter=bestsellers" className="transition-colors hover:text-white">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/about" className="transition-colors hover:text-white">About</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-white">Terms of Service</Link></li>
              <li><Link to="/refund" className="transition-colors hover:text-white">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {(instagramUrl || facebookUrl || twitterUrl) && (
          <div className="flex justify-center gap-4 mb-8">
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white">
                Instagram
              </a>
            )}
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white">
                Facebook
              </a>
            )}
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-white">
                Twitter
              </a>
            )}
          </div>
        )}

        <div className="text-center text-xs text-white/30 pt-6 border-t border-white/10">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
