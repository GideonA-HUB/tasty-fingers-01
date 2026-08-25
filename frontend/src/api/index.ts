import { apiClient } from './client';
import { unwrapList } from '@/utils/api';
import type {
  BookingInquiry,
  Category,
  CheckoutFormData,
  CurrencySettings,
  DashboardMetrics,
  EventServiceType,
  Order,
  PaginatedResponse,
  Product,
  ProductReview,
  SaleAnnouncement,
  SiteSettings,
  Testimonial,
  TrainingProgram,
  WhyChooseItem,
} from '@/types';

export const productsApi = {
  list: (params?: Record<string, string | number>) =>
    apiClient.get<PaginatedResponse<Product>>('/products/', { params }),
  get: (slug: string) => apiClient.get<Product>(`/products/${slug}/`),
  featured: (): Promise<Product[]> =>
    apiClient
      .get<Product[] | PaginatedResponse<Product>>('/products/featured/')
      .then((r) => unwrapList<Product>(r.data)),
  bestsellers: (): Promise<Product[]> =>
    apiClient
      .get<Product[] | PaginatedResponse<Product>>('/products/bestsellers/')
      .then((r) => unwrapList<Product>(r.data)),
  newArrivals: (): Promise<Product[]> =>
    apiClient
      .get<Product[] | PaginatedResponse<Product>>('/products/new-arrivals/')
      .then((r) => unwrapList<Product>(r.data)),
  flashSales: (): Promise<Product[]> =>
    apiClient
      .get<Product[] | PaginatedResponse<Product>>('/products/flash-sales/')
      .then((r) => unwrapList<Product>(r.data)),
  search: (q: string) =>
    apiClient.get<{ results: Product[]; count: number }>('/products/search/', { params: { q } }),
  categories: (params?: { featured?: boolean }): Promise<Category[]> =>
    apiClient
      .get<Category[] | PaginatedResponse<Category>>('/products/categories/', {
        params: params?.featured ? { featured: 'true' } : undefined,
      })
      .then((r) => unwrapList<Category>(r.data)),
  category: (slug: string) => apiClient.get<Category>(`/products/categories/${slug}/`),
  reviews: (slug: string): Promise<ProductReview[]> =>
    apiClient
      .get<ProductReview[] | PaginatedResponse<ProductReview>>(`/products/${slug}/reviews/`)
      .then((r) => unwrapList<ProductReview>(r.data)),
  createReview: (
    slug: string,
    data: { name: string; email: string; rating: number; comment: string }
  ) => apiClient.post(`/products/${slug}/reviews/`, data),
};

export const siteApi = {
  settings: () => apiClient.get<SiteSettings>('/site/settings/'),
  currencySettings: () => apiClient.get<CurrencySettings>('/site/currency-settings/'),
  saleAnnouncements: (): Promise<SaleAnnouncement[]> =>
    apiClient
      .get<SaleAnnouncement[] | PaginatedResponse<SaleAnnouncement>>('/site/sale-announcements/')
      .then((r) => unwrapList<SaleAnnouncement>(r.data)),
  adminCurrencySettings: () => apiClient.get<CurrencySettings>('/site/admin/currency-settings/'),
  updateCurrencySettings: (data: Partial<CurrencySettings>) =>
    apiClient.patch<CurrencySettings>('/site/admin/currency-settings/', data),
  assets: () => apiClient.get<Record<string, { image: string }>>('/site/assets/'),
  testimonials: (): Promise<Testimonial[]> =>
    apiClient
      .get<Testimonial[] | PaginatedResponse<Testimonial>>('/site/testimonials/')
      .then((r) => unwrapList<Testimonial>(r.data)),
  whyChoose: (): Promise<WhyChooseItem[]> =>
    apiClient
      .get<WhyChooseItem[] | PaginatedResponse<WhyChooseItem>>('/site/why-choose/')
      .then((r) => unwrapList<WhyChooseItem>(r.data)),
  contact: (data: { name: string; email: string; phone?: string; message: string }) =>
    apiClient.post('/site/contact/', data),
  newsletter: (email: string) => apiClient.post('/site/newsletter/', { email }),
  eventServices: (): Promise<EventServiceType[]> =>
    apiClient
      .get<EventServiceType[] | PaginatedResponse<EventServiceType>>('/site/event-services/')
      .then((r) => unwrapList<EventServiceType>(r.data)),
  trainingPrograms: (): Promise<TrainingProgram[]> =>
    apiClient
      .get<TrainingProgram[] | PaginatedResponse<TrainingProgram>>('/site/training-programs/')
      .then((r) => unwrapList<TrainingProgram>(r.data)),
  submitBooking: (data: FormData) =>
    apiClient.post('/site/bookings/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  adminBookings: (): Promise<BookingInquiry[]> =>
    apiClient
      .get<BookingInquiry[] | PaginatedResponse<BookingInquiry>>('/site/admin/bookings/')
      .then((r) => unwrapList<BookingInquiry>(r.data)),
  adminUpdateBooking: (id: number, data: Partial<BookingInquiry>) =>
    apiClient.patch<BookingInquiry>(`/site/admin/bookings/${id}/`, data),
};

export const ordersApi = {
  checkout: (data: CheckoutFormData) => apiClient.post<Order>('/orders/checkout/', data),
  get: (orderNumber: string) => apiClient.get<Order>(`/orders/${orderNumber}/`),
  adminList: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<Order>>('/orders/admin/list/', { params }),
  adminUpdate: (orderNumber: string, data: { status: string }) =>
    apiClient.patch(`/orders/admin/${orderNumber}/`, data),
};

export const paymentsApi = {
  initialize: (orderNumber: string, provider: 'paystack' | 'flutterwave') =>
    apiClient.post<{ authorization_url: string; reference: string }>('/payments/initialize/', {
      order_number: orderNumber,
      provider,
    }),
  verify: (reference: string, provider: string) =>
    apiClient.post('/payments/verify/', { reference, provider }),
  keys: () =>
    apiClient.get<{ paystack_public_key: string; flutterwave_public_key: string }>('/payments/keys/'),
};

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<{ access: string; refresh: string }>('/accounts/login/', { username, password }),
  profile: () => apiClient.get('/accounts/profile/'),
};

export const analyticsApi = {
  dashboard: () => apiClient.get<DashboardMetrics>('/analytics/dashboard/'),
  salesTrend: (days = 30) => apiClient.get('/analytics/sales-trend/', { params: { days } }),
  topProducts: () => apiClient.get('/analytics/top-products/'),
};

export const notificationsApi = {
  list: () => apiClient.get('/notifications/admin/list/'),
  unreadCount: () => apiClient.get<{ count: number }>('/notifications/admin/unread-count/'),
  markRead: (id: number) => apiClient.post(`/notifications/admin/${id}/read/`),
};
