import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/pages/admin/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ScrollToTop from '@/components/ScrollToTop';
import { useSiteAssets } from '@/hooks/useSiteAssets';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import CheckoutPage from '@/pages/CheckoutPage';
import CheckoutVerifyPage from '@/pages/CheckoutVerifyPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import CategoriesPage from '@/pages/CategoriesPage';
import PolicyPage from '@/pages/PolicyPage';
import BookingsPage from '@/pages/BookingsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AccountPage from '@/pages/AccountPage';
import TrackOrderPage from '@/pages/TrackOrderPage';

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'));
const AdminContacts = lazy(() => import('@/pages/admin/AdminContacts'));
const AdminHeroImages = lazy(() => import('@/pages/admin/AdminHeroImages'));
const AdminNewsletter = lazy(() => import('@/pages/admin/AdminNewsletter'));
const AdminTestimonials = lazy(() => import('@/pages/admin/AdminTestimonials'));
const AdminWhyChoose = lazy(() => import('@/pages/admin/AdminWhyChoose'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminActivityLogs = lazy(() => import('@/pages/admin/AdminActivityLogs'));
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'));
const AdminLegalAgreements = lazy(() => import('@/pages/admin/AdminLegalAgreements'));
const AdminBookings = lazy(() => import('@/pages/admin/AdminBookings'));
const AdminCustomers = lazy(() => import('@/pages/admin/AdminCustomers'));

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function SiteAssetsBootstrap() {
  useSiteAssets();
  return null;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <SiteAssetsBootstrap />
      <ScrollToTopOnRouteChange />
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/category/:slug" element={<ShopPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/verify" element={<CheckoutVerifyPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
          <Route path="privacy" element={<PolicyPage />} />
          <Route path="terms" element={<PolicyPage />} />
          <Route path="refund" element={<PolicyPage />} />
        </Route>

        <Route path="/dashboard/login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/orders" element={<AdminOrders />} />
          <Route path="/dashboard/customers" element={<AdminCustomers />} />
          <Route path="/dashboard/legal-agreements" element={<AdminLegalAgreements />} />
          <Route path="/dashboard/products" element={<AdminProducts />} />
          <Route path="/dashboard/categories" element={<AdminCategories />} />
          <Route path="/dashboard/reviews" element={<AdminReviews />} />
          <Route path="/dashboard/notifications" element={<AdminNotifications />} />
          <Route path="/dashboard/contacts" element={<AdminContacts />} />
          <Route path="/dashboard/bookings" element={<AdminBookings />} />
          <Route path="/dashboard/hero-images" element={<AdminHeroImages />} />
          <Route path="/dashboard/newsletter" element={<AdminNewsletter />} />
          <Route path="/dashboard/testimonials" element={<AdminTestimonials />} />
          <Route path="/dashboard/why-choose" element={<AdminWhyChoose />} />
          <Route path="/dashboard/settings" element={<AdminSettings />} />
          <Route path="/dashboard/activity-logs" element={<AdminActivityLogs />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
