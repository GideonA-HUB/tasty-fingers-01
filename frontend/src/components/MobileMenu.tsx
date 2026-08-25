import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';
import CurrencySelector from './CurrencySelector';
import { useThemeStore } from '@/store/themeStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'View Menu' },
  { to: '/categories', label: 'Categories' },
  { to: '/shop?filter=flash-sales', label: 'Tasty Specials' },
  { to: '/shop?filter=new-arrivals', label: 'Tasty Combos' },
  { to: '/bookings', label: 'Bookings & Training' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { theme } = useThemeStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/50 z-50"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-[min(100vw-3rem,20rem)] bg-white dark:bg-dark-card z-50 shadow-luxury-lg flex flex-col border-r border-brand-gray-100 dark:border-orange-900/30"
          >
            <div className="bg-brand-gradient px-4 py-5 border-b border-white/15">
              <div className="flex items-center justify-between">
                <BrandLogo variant="menu" className="h-11 w-auto max-w-[11rem] sm:h-12 brightness-0 invert" />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/15 rounded-full text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-white/80 text-xs mt-2 font-medium">Delicious Meals, Delivered with Care</p>
            </div>
            <div className="flex-1 py-3 overflow-y-auto">
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.to + link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="block px-6 py-3.5 text-brand-accent dark:text-orange-100 hover:text-brand-pink hover:bg-brand-orange-pale dark:hover:bg-orange-950/30 transition-colors font-medium border-l-4 border-transparent hover:border-brand-pink"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="p-4 border-t border-brand-gray-100 dark:border-orange-900/30 space-y-3 bg-brand-orange-pale/50 dark:bg-dark-elevated/50">
              <div className="flex items-center justify-between rounded-xl bg-white dark:bg-dark-elevated px-4 py-3 border border-brand-gray-100 dark:border-orange-900/30">
                <div>
                  <p className="text-sm font-medium text-brand-black dark:text-orange-50">Currency</p>
                  <p className="text-xs text-brand-accent/50 dark:text-orange-200/60">Price display</p>
                </div>
                <CurrencySelector variant="light" compact />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white dark:bg-dark-elevated px-4 py-3 border border-brand-gray-100 dark:border-orange-900/30">
                <div>
                  <p className="text-sm font-medium text-brand-black dark:text-orange-50">Appearance</p>
                  <p className="text-xs text-brand-accent/50 dark:text-orange-200/60 capitalize">{theme} mode</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
