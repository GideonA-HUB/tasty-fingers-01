export interface Product {
  id: number;
  name: string;
  slug: string;
  category: number | null;
  category_name: string;
  short_description: string;
  price: string;
  sale_price: string | null;
  current_price: string;
  is_on_sale: boolean;
  discount_percentage: number;
  length: string;
  density: string;
  lace_type: string;
  color: string;
  stock: number;
  in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_flash_sale?: boolean;
  flash_sale_start_at?: string | null;
  flash_sale_end_at?: string | null;
  primary_image: string | null;
  average_rating?: number;
  review_count?: number;
  description?: string;
  sku?: string;
  images?: ProductImage[];
  videos?: ProductVideo[];
  meta_title?: string;
  meta_description?: string;
  views_count?: number;
  created_at?: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface ProductReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ProductVideo {
  id: number;
  video: string;
  title: string;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count: number;
  is_featured: boolean;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DisplayCurrency = 'NGN' | 'USD' | 'GBP' | 'CAD';

export interface CurrencySettings {
  ngn_per_usd: string;
  ngn_per_gbp: string;
  ngn_per_cad: string;
  local_delivery_fee: string;
  international_delivery_fee: string;
  updated_at: string;
}

export interface SaleAnnouncement {
  id: number;
  title: string;
  badge_text: string;
  headline: string;
  offer_website: string;
  offer_whatsapp: string;
  offer_extra: string;
  marquee_text: string;
  megaphone_image: string | null;
  poster_image: string | null;
  cta_label: string;
  cta_url: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  order: number;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  meta_description: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  tiktok_url: string;
  youtube_url: string;
  delivery_fee: string;
  currency: string;
  currency_symbol: string;
  about_title: string;
  about_subtitle: string;
  about_content: string;
  mission: string;
  vision: string;
  brand_story: string;
  ceo_name: string;
  ceo_title: string;
  ceo_bio: string;
  ceo_photo: string | null;
  privacy_policy: string;
  terms_of_service: string;
  refund_policy: string;
  why_choose_title?: string;
  why_choose_subtitle?: string;
  testimonials_title?: string;
  testimonials_subtitle?: string;
  hero_eyebrow?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_primary_cta_label?: string;
  hero_primary_cta_url?: string;
  hero_secondary_cta_label?: string;
  hero_secondary_cta_url?: string;
  hero_disclaimer?: string;
  hero_social_proof_text?: string;
}

export interface WhyChooseItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  alt_text: string;
  order: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  delivery_type?: 'local' | 'international';
  international_region?: '' | 'US' | 'UK' | 'CA';
  delivery_type_display?: string;
  international_region_display?: string;
  subtotal: string;
  delivery_fee: string;
  total: string;
  status: string;
  payment_method: string;
  payment_method_display?: string;
  payment_reference?: string;
  is_paid: boolean;
  agreed_to_terms?: boolean;
  terms_agreed_at?: string | null;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_slug: string;
  product_image: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  order_notes?: string;
  payment_method: 'paystack' | 'flutterwave';
  agreed_to_terms: boolean;
  is_international_delivery: boolean;
  international_region?: '' | 'US' | 'UK' | 'CA';
  items: { product_id: number; quantity: number }[];
}

export interface DashboardMetrics {
  total_sales: string;
  daily_sales: string;
  weekly_sales: string;
  monthly_sales: string;
  yearly_sales: string;
  total_orders: number;
  pending_orders: number;
  delivered_orders: number;
  total_revenue: string;
}

export interface EventServiceType {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  starting_price: string | null;
  is_active: boolean;
  order: number;
}

export interface TrainingProgram {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: string;
  image: string | null;
  highlights: string;
  highlights_list: string[];
  is_active: boolean;
  order: number;
}

export interface BookingInquiry {
  id: number;
  inquiry_type: 'event' | 'training';
  inquiry_type_display: string;
  event_service: number | null;
  event_service_name: string;
  training_program: number | null;
  training_program_title: string;
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  event_date: string | null;
  event_time: string | null;
  event_location: string;
  guest_count: number | null;
  event_size: string;
  event_size_display: string;
  budget: string | null;
  menu_preferences: string;
  message: string;
  reference_image: string | null;
  status: string;
  status_display: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}
