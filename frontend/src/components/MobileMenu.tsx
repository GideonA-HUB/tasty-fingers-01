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
  { to: '/shop?filter=flash-sales', label: 'Flash Sales' },
  { to: '/shop?filter=new-arrivals', label: 'New Arrivals' },
  { to: '/shop?filter=bestsellers', label: 'Best Sellers' },
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
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-[min(100vw-3rem,18rem)] bg-white dark:bg-dark-card z-50 shadow-luxury-lg flex flex-col border-r border-brand-gray-100 dark:border-white/10"
          >
            <div className="flex items-center justify-between p-4 border-b border-brand-gray-100 dark:border-white/10">
              <BrandLogo variant="menu" className="h-11 w-auto max-w-[11rem] sm:h-12" />
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-gray-50 dark:hover:bg-white/10 rounded-full text-brand-accent dark:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 py-4">
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="block px-6 py-3.5 text-brand-accent dark:text-gray-200 hover:text-brand-pink hover:bg-brand-gray-50 dark:hover:bg-white/5 transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="p-4 border-t border-brand-gray-100 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-brand-gray-50 dark:bg-dark-elevated px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-brand-black dark:text-gray-100">Currency</p>
                  <p className="text-xs text-brand-accent/50 dark:text-gray-400">Price display preference</p>
                </div>
                <CurrencySelector variant="light" compact />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-gray-50 dark:bg-dark-elevated px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-brand-black dark:text-gray-100">Appearance</p>
                  <p className="text-xs text-brand-accent/50 dark:text-gray-400 capitalize">{theme} mode</p>
                </div>
                <ThemeToggle />
              </div>
              <p className="text-xs text-brand-accent/40 dark:text-gray-500 text-center">
                Delicious Meals, Delivered with Care
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
