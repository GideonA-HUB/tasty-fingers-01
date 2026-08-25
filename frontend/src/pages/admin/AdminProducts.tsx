import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetch, adminFetchList } from '@/lib/adminApi';

interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

interface ProductVideo {
  id: number;
  video: string;
  title: string;
  order: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  category: number | null;
  category_name: string;
  description: string;
  short_description: string;
  price: string;
  sale_price: string | null;
  current_price: string;
  is_on_sale: boolean;
  length: string;
  density: string;
  lace_type: string;
  color: string;
  stock: number;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_flash_sale: boolean;
  flash_sale_start_at: string | null;
  flash_sale_end_at: string | null;
  primary_image: string | null;
  images?: ProductImage[];
  videos?: ProductVideo[];
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductFormState {
  name: string;
  slug: string;
  category: string;
  sku: string;
  price: string;
  sale_price: string;
  stock: string;
  description: string;
  short_description: string;
  length: string;
  density: string;
  lace_type: string;
  color: string;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_flash_sale: boolean;
  flash_sale_start_at: string;
  flash_sale_end_at: string;
  is_active: boolean;
  images: File[];
  videos: File[];
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  slug: '',
  category: '',
  sku: '',
  price: '',
  sale_price: '',
  stock: '0',
  description: '',
  short_description: '',
  length: '',
  density: '',
  lace_type: '',
  color: '',
  is_featured: false,
  is_bestseller: false,
  is_new_arrival: false,
  is_flash_sale: false,
  flash_sale_start_at: '',
  flash_sale_end_at: '',
  is_active: true,
  images: [],
  videos: [],
};

const LENGTH_OPTIONS = [
  '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '40',
];

const LACE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Select lace type' },
  { value: 'hd_lace', label: 'HD Lace' },
  { value: 'transparent_lace', label: 'Transparent Lace' },
  { value: 'swiss_lace', label: 'Swiss Lace' },
  { value: 'frontal', label: 'Frontal' },
  { value: 'closure', label: 'Closure' },
  { value: 'fringe', label: 'Fringe' },
  { value: 'full_lace', label: 'Full Lace' },
  { value: 'glueless', label: 'Glueless' },
  { value: 'none', label: 'None' },
];

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all';
const labelClass = 'block text-sm font-medium text-brand-accent mb-2';

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Convert API ISO datetime → value for <input type="datetime-local"> */
function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Convert datetime-local value → ISO for API */
function fromDatetimeLocalValue(local: string): string {
  if (!local.trim()) return '';
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
}

function productToForm(product: Product): ProductFormState {
  return {
    name: product.name || '',
    slug: product.slug || '',
    category: product.category ? String(product.category) : '',
    sku: product.sku || '',
    price: product.price || '',
    sale_price: product.sale_price || '',
    stock: String(product.stock ?? 0),
    description: product.description || '',
    short_description: product.short_description || '',
    length: product.length || '',
    density: product.density || '',
    lace_type: product.lace_type || '',
    color: product.color || '',
    is_featured: !!product.is_featured,
    is_bestseller: !!product.is_bestseller,
    is_new_arrival: !!product.is_new_arrival,
    is_flash_sale: !!product.is_flash_sale,
    flash_sale_start_at: toDatetimeLocalValue(product.flash_sale_start_at),
    flash_sale_end_at: toDatetimeLocalValue(product.flash_sale_end_at),
    is_active: product.is_active !== false,
    images: [],
    videos: [],
  };
}

function buildProductFormData(form: ProductFormState): FormData {
  const formData = new FormData();
  formData.append('name', form.name.trim());
  if (form.slug.trim()) formData.append('slug', form.slug.trim());
  if (form.category) formData.append('category', form.category);
  formData.append('sku', form.sku.trim());
  formData.append('price', form.price);
  if (form.sale_price.trim()) {
    formData.append('sale_price', form.sale_price);
  } else {
    formData.append('sale_price', '');
  }
  formData.append('stock', form.stock || '0');
  formData.append('description', form.description || form.name);
  formData.append('short_description', form.short_description);
  formData.append('length', form.length);
  formData.append('density', form.density);
  formData.append('lace_type', form.lace_type);
  formData.append('color', form.color);
  formData.append('is_featured', String(form.is_featured));
  formData.append('is_bestseller', String(form.is_bestseller));
  formData.append('is_new_arrival', String(form.is_new_arrival));
  formData.append('is_flash_sale', String(form.is_flash_sale));
  if (form.is_flash_sale) {
    const startIso = fromDatetimeLocalValue(form.flash_sale_start_at);
    const endIso = fromDatetimeLocalValue(form.flash_sale_end_at);
    formData.append('flash_sale_start_at', startIso);
    formData.append('flash_sale_end_at', endIso);
  } else {
    formData.append('flash_sale_start_at', '');
    formData.append('flash_sale_end_at', '');
  }
  formData.append('is_active', String(form.is_active));
  form.images.forEach((image) => formData.append('images', image));
  form.videos.forEach((video) => formData.append('videos', video));
  return formData;
}

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [existingVideos, setExistingVideos] = useState<ProductVideo[]>([]);
  const [formError, setFormError] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(false);
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: () => adminFetchList<Product>('/api/v1/products/admin/'),
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: () => adminFetchList<Category>('/api/v1/products/admin/categories/'),
  });

  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (statusFilter === 'active') return product.is_active;
      if (statusFilter === 'inactive') return !product.is_active;
      if (statusFilter === 'featured') return product.is_featured;
      if (statusFilter === 'bestseller') return product.is_bestseller;
      if (statusFilter === 'new') return product.is_new_arrival;
      return true;
    }) || [];

  const toggleProductStatus = useMutation({
    mutationFn: ({ productId, isActive }: { productId: number; isActive: boolean }) =>
      adminFetch(`/api/v1/products/admin/${productId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !isActive }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.name.trim() || !form.price) {
        throw new Error('Name and price are required.');
      }
      const formData = buildProductFormData(form);
      if (modalMode === 'edit' && editingId) {
        return adminFetch<Product>(`/api/v1/products/admin/${editingId}/`, {
          method: 'PATCH',
          body: formData,
        });
      }
      return adminFetch<Product>('/api/v1/products/admin/', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message || 'Failed to save product'),
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: number) =>
      adminFetch(`/api/v1/products/admin/${productId}/`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setExistingImages([]);
    setExistingVideos([]);
    setFormError('');
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setForm(EMPTY_FORM);
    setExistingImages([]);
    setExistingVideos([]);
    setFormError('');
  };

  const openEditModal = async (productId: number) => {
    setModalMode('edit');
    setEditingId(productId);
    setLoadingEdit(true);
    setFormError('');
    try {
      const product = await adminFetch<Product>(`/api/v1/products/admin/${productId}/`);
      setForm(productToForm(product));
      setExistingImages(product.images || []);
      setExistingVideos(product.videos || []);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone and will remove it from the website.`,
    );
    if (!confirmed) return;
    deleteMutation.mutate(product.id);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load products</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-brand-pink text-white px-6 py-2 rounded-xl"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <h1 className="text-2xl font-bold text-brand-black">Meals Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={openAddModal}
          className="bg-brand-pink text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-brand-pink/90 transition-all shadow-lg shadow-brand-pink/30"
        >
          Add New Product
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputClass}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink outline-none"
          >
            <option value="all">All Meals</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
            <option value="bestseller">Bestsellers</option>
            <option value="new">New Arrivals</option>
          </select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-brand-accent/50">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Badges</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-brand-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.primary_image ? (
                          <img
                            src={product.primary_image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-brand-gray-100 flex items-center justify-center text-brand-accent/30">
                            ✦
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-brand-black">{product.name}</p>
                          <p className="text-sm text-brand-accent/60">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-accent">
                      {product.category_name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-brand-accent">₦{product.current_price}</p>
                        {product.is_on_sale && (
                          <p className="text-sm text-brand-accent/40 line-through">₦{product.price}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          toggleProductStatus.mutate({
                            productId: product.id,
                            isActive: product.is_active,
                          })
                        }
                        disabled={toggleProductStatus.isPending}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {product.is_featured && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-pink/10 text-brand-pink">
                            Featured
                          </span>
                        )}
                        {product.is_bestseller && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Bestseller
                          </span>
                        )}
                        {product.is_new_arrival && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            New
                          </span>
                        )}
                        {product.is_flash_sale && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Flash Sale
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(product.id)}
                          className="text-brand-pink hover:text-brand-pink/80 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {modalMode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 md:p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-brand-black">
                {modalMode === 'edit' ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button type="button" onClick={closeModal} className="text-brand-accent/50 hover:text-brand-accent text-xl">
                ✕
              </button>
            </div>

            {loadingEdit ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
              </div>
            ) : (
              <>
                {formError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          name,
                          slug:
                            modalMode === 'add' && (!prev.slug || prev.slug === slugifyName(prev.name))
                              ? slugifyName(name)
                              : prev.slug,
                        }));
                      }}
                      className={inputClass}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className={inputClass}
                      placeholder="product-slug (auto if blank)"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select category</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className={inputClass}
                      placeholder="Optional SKU"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Price (NGN) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={inputClass}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Sale Price (NGN)</label>
                    <input
                      type="number"
                      value={form.sale_price}
                      onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                      className={inputClass}
                      placeholder="Leave blank if none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stock *</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className={inputClass}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Length</label>
                    <select
                      value={form.length}
                      onChange={(e) => setForm({ ...form, length: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select length</option>
                      {LENGTH_OPTIONS.map((len) => (
                        <option key={len} value={len}>
                          {len}&quot;
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Grams</label>
                    <input
                      type="text"
                      value={form.density}
                      onChange={(e) => setForm({ ...form, density: e.target.value })}
                      className={inputClass}
                      placeholder="e.g., 200g"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Lace Type</label>
                    <select
                      value={form.lace_type}
                      onChange={(e) => setForm({ ...form, lace_type: e.target.value })}
                      className={inputClass}
                    >
                      {LACE_OPTIONS.map((opt) => (
                        <option key={opt.value || 'empty'} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Color</label>
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className={inputClass}
                      placeholder="e.g., Natural Black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Short Description</label>
                    <textarea
                      value={form.short_description}
                      onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                      className={`${inputClass} resize-none`}
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={`${inputClass} resize-none`}
                      rows={4}
                    />
                  </div>

                  {modalMode === 'edit' && existingImages.length > 0 && (
                    <div className="md:col-span-2">
                      <label className={labelClass}>Current Images</label>
                      <div className="flex flex-wrap gap-3">
                        {existingImages.map((img) => (
                          <img
                            key={img.id}
                            src={img.image}
                            alt={img.alt_text || form.name}
                            className="h-20 w-20 rounded-lg object-cover border border-brand-gray-100"
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-brand-accent/50">
                        Upload new images below to add more (existing images are kept).
                      </p>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      {modalMode === 'edit' ? 'Add Images' : 'Images'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setForm({ ...form, images: Array.from(e.target.files || []) })
                      }
                      className={inputClass}
                    />
                  </div>

                  {modalMode === 'edit' && existingVideos.length > 0 && (
                    <div className="md:col-span-2">
                      <label className={labelClass}>Current Videos</label>
                      <ul className="space-y-1 text-sm text-brand-accent/70">
                        {existingVideos.map((vid) => (
                          <li key={vid.id}>
                            <a
                              href={vid.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-pink hover:underline"
                            >
                              {vid.title || `Video #${vid.id}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-xs text-brand-accent/50">
                        Upload new videos below to add more (existing videos are kept).
                      </p>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      {modalMode === 'edit' ? 'Add Videos' : 'Videos'}
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) =>
                        setForm({ ...form, videos: Array.from(e.target.files || []) })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(
                      [
                        ['is_active', 'Active (visible on website)'],
                        ['is_featured', 'Featured'],
                        ['is_bestseller', 'Bestseller'],
                        ['is_new_arrival', 'New Arrival'],
                        ['is_flash_sale', 'Flash Sale'],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form[key]}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (key === 'is_flash_sale' && !checked) {
                              setForm({
                                ...form,
                                is_flash_sale: false,
                                flash_sale_start_at: '',
                                flash_sale_end_at: '',
                              });
                            } else {
                              setForm({ ...form, [key]: checked });
                            }
                          }}
                          className="w-4 h-4 rounded border-brand-gray-300 text-brand-pink focus:ring-brand-pink accent-brand-pink"
                        />
                        <span className="text-sm font-medium text-brand-accent">{label}</span>
                      </label>
                    ))}
                  </div>

                  {form.is_flash_sale && (
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-brand-pink/20 bg-brand-pink/5 p-4">
                      <div>
                        <label className={labelClass}>Flash Sale Starts At</label>
                        <input
                          type="datetime-local"
                          value={form.flash_sale_start_at}
                          onChange={(e) =>
                            setForm({ ...form, flash_sale_start_at: e.target.value })
                          }
                          className={inputClass}
                        />
                        <p className="mt-1 text-xs text-brand-accent/50">
                          Countdown shows &quot;Starts in&quot; until this time.
                        </p>
                      </div>
                      <div>
                        <label className={labelClass}>Flash Sale Ends At</label>
                        <input
                          type="datetime-local"
                          value={form.flash_sale_end_at}
                          onChange={(e) =>
                            setForm({ ...form, flash_sale_end_at: e.target.value })
                          }
                          className={inputClass}
                        />
                        <p className="mt-1 text-xs text-brand-accent/50">
                          After the start time, countdown shows &quot;Ends in&quot; until this time.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 rounded-xl border border-brand-gray-200 text-brand-accent font-semibold hover:bg-brand-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormError('');
                      saveMutation.mutate();
                    }}
                    disabled={saveMutation.isPending}
                    className="flex-1 px-6 py-3 rounded-xl bg-brand-pink text-white font-semibold hover:bg-brand-pink/90 transition-all disabled:opacity-50"
                  >
                    {saveMutation.isPending
                      ? 'Saving...'
                      : modalMode === 'edit'
                        ? 'Save Changes'
                        : 'Add Product'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
