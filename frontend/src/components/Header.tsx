import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import BrandLogo from './BrandLogo';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import CurrencySelector from './CurrencySelector';
import { BRAND_WHATSAPP } from '@/constants/brand';

interface HeaderProps {
  whatsappNumber?: string;
}

export default function Header({ whatsappNumber }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { openCart, getItemCount } = useCartStore();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const whatsappUrl = `https://wa.me/${(whatsappNumber || BRAND_WHATSAPP).replace(/[^0-9]/g, '')}`;

  const iconBtn =
    'p-2 rounded-lg text-white hover:bg-white/15 active:bg-white/20 transition-colors';

  return (
    <>
      <div className="sticky top-0 z-50 bg-brand-gradient shadow-orange">
        {/* Utility Bar */}
        <div className="border-b border-white/15 text-xs">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-green-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact Us
            </a>
            <div className="flex items-center gap-3">
              <ThemeToggle compact />
              <CurrencySelector compact />
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <header className="border-b border-white/15">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-[4.75rem] sm:h-[5.5rem]">
            <button
              onClick={() => setMenuOpen(true)}
              className={`${iconBtn} -ml-1`}
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link
              to="/"
              className="absolute left-1/2 flex -translate-x-1/2 items-center rounded-xl bg-white px-3 py-1.5 shadow-md sm:px-4 sm:py-2"
            >
              <BrandLogo
                variant="navbar"
                className="h-14 w-auto max-w-[min(62vw,280px)] sm:h-16 md:h-[4.25rem]"
              />
            </Link>

            <div className="flex items-center gap-0.5">
              <button onClick={() => setSearchOpen(!searchOpen)} className={iconBtn} aria-label="Search">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button onClick={openCart} className={`${iconBtn} relative`} aria-label="Cart">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-white text-brand-pink text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="px-4 pb-3 border-t border-white/15 bg-brand-pink-dark/90">
              <form onSubmit={handleSearch}>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 bg-white text-brand-accent placeholder:text-brand-accent/45 text-sm outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/25"
                  autoFocus
                  autoComplete="off"
                />
              </form>
            </div>
          )}
        </header>
      </div>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
