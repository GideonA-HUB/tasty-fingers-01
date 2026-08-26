import { useState, useEffect } from 'react';
import { readPersistedTheme } from '@/store/themeStore';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderOpen,
  Star,
  Bell,
  Mail,
  MessageSquare,
  Image,
  Newspaper,
  Sparkles,
  Settings,
  ScrollText,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  CalendarDays,
  Users,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/dashboard/customers' },
  { id: 'legal-agreements', label: 'Legal Agreements', icon: ShieldCheck, path: '/dashboard/legal-agreements' },
  { id: 'products', label: 'Meals', icon: Package, path: '/dashboard/products' },
  { id: 'categories', label: 'Categories', icon: FolderOpen, path: '/dashboard/categories' },
  { id: 'reviews', label: 'Reviews', icon: Star, path: '/dashboard/reviews' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
  { id: 'bookings', label: 'Bookings & Training', icon: CalendarDays, path: '/dashboard/bookings' },
  { id: 'contacts', label: 'Contacts', icon: Mail, path: '/dashboard/contacts' },
  { id: 'hero-images', label: 'Hero Images', icon: Image, path: '/dashboard/hero-images' },
  { id: 'newsletter', label: 'Newsletter', icon: Newspaper, path: '/dashboard/newsletter' },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, path: '/dashboard/testimonials' },
  { id: 'why-choose', label: 'Why Choose', icon: Sparkles, path: '/dashboard/why-choose' },
  { id: 'settings', label: 'Site Settings', icon: Settings, path: '/dashboard/settings' },
  { id: 'activity-logs', label: 'Activity Logs', icon: ScrollText, path: '/dashboard/activity-logs' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      navigate('/dashboard/login');
    } else {
      setUser(JSON.parse(adminUser));
    }
  }, [navigate]);

  // Owner dashboard keeps its own light UI — storefront dark mode must not bleed in
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ED7D2B');

    return () => {
      if (readPersistedTheme() === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
        if (meta) meta.setAttribute('content', '#0a0a0a');
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('admin_user');
    navigate('/dashboard/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const currentPage = navItems.find((item) => isActive(item.path))?.label || 'Dashboard';

  const SidebarContent = () => (
    <>
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pink text-sm font-bold text-white shadow-lg shadow-brand-pink/40">
            TF
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">Tasty Fingers</h1>
            <p className="text-xs text-white/50">Owner Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-brand-pink to-brand-pink-dark text-white shadow-lg shadow-brand-pink/30'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        {user && (
          <div className="mb-3 rounded-xl bg-white/5 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{user.username}</p>
            <p className="truncate text-xs text-white/50">{user.email}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed z-30 hidden h-full w-64 flex-col bg-gradient-to-b from-[#C65A12] via-[#ED7D2B] to-[#A04810] lg:flex shadow-orange"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-gradient-to-b from-[#C65A12] via-[#ED7D2B] to-[#A04810]">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => (window.innerWidth < 1024 ? setMobileOpen(true) : setSidebarOpen(!sidebarOpen))}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-brand-pink">Admin</p>
                <h2 className="text-lg font-semibold text-slate-900">{currentPage}</h2>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-pink/30 hover:text-brand-pink"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Website
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
