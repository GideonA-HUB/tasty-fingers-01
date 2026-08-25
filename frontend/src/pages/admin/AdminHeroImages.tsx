import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface HeroImage {
  id: number;
  image: string;
  alt_text: string;
  category: string;
  title: string;
  link_url: string;
  order: number;
  is_active: boolean;
}

export default function AdminHeroImages() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('COLLECTION');
  const [uploadLink, setUploadLink] = useState('/shop');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    link_url: '',
    alt_text: '',
    order: 0,
  });

  const { data: heroImages, isLoading, refetch } = useQuery<HeroImage[]>({
    queryKey: ['admin-hero-images'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/site/admin/hero-images/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch hero images');
      return response.json();
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('alt_text', uploadTitle || 'Hero image');
    formData.append('title', uploadTitle || 'Featured Meal');
    formData.append('category', uploadCategory || 'MENU');
    formData.append('link_url', uploadLink || '/shop');

    await fetch('/api/v1/site/admin/hero-images/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setSelectedFile(null);
    setUploadTitle('');
    setUploadCategory('COLLECTION');
    setUploadLink('/shop');
    refetch();
  };

  const toggleActive = async (imageId: number, isActive: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/admin/hero-images/${imageId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: !isActive }),
    });
    refetch();
  };

  const deleteImage = async (imageId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/admin/hero-images/${imageId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    refetch();
  };

  const startEdit = (image: HeroImage) => {
    setEditingId(image.id);
    setEditForm({
      title: image.title || '',
      category: image.category || 'COLLECTION',
      link_url: image.link_url || '/shop',
      alt_text: image.alt_text || '',
      order: image.order || 0,
    });
  };

  const saveEdit = async (imageId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/admin/hero-images/${imageId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Hero Images Management</h1>
          <p className="mt-1 text-sm text-brand-accent/60">
            These images power the scrolling cards on the homepage hero.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <h3 className="text-lg font-semibold text-brand-black mb-4">Upload New Hero Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Card title</label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Party Jollof Special"
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Category label</label>
            <input
              type="text"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              placeholder="e.g. JOLLOF"
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Link URL</label>
            <input
              type="text"
              value={uploadLink}
              onChange={(e) => setUploadLink(e.target.value)}
              placeholder="/shop"
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Image file</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink outline-none"
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={!selectedFile}
          className="bg-brand-pink text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload Card
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : heroImages && heroImages.length > 0 ? (
          heroImages.map((heroImage, index) => (
            <motion.div
              key={heroImage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 overflow-hidden"
            >
              <div className="aspect-[3/4] bg-brand-gray-50">
                <img
                  src={heroImage.image}
                  alt={heroImage.alt_text || heroImage.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      heroImage.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {heroImage.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-brand-accent/60">Order: {heroImage.order}</span>
                </div>

                {editingId === heroImage.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-brand-gray-200 text-sm outline-none focus:border-brand-pink"
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-brand-gray-200 text-sm outline-none focus:border-brand-pink"
                      placeholder="Category"
                    />
                    <input
                      type="text"
                      value={editForm.link_url}
                      onChange={(e) => setEditForm({ ...editForm, link_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-brand-gray-200 text-sm outline-none focus:border-brand-pink"
                      placeholder="Link URL"
                    />
                    <input
                      type="number"
                      value={editForm.order}
                      onChange={(e) =>
                        setEditForm({ ...editForm, order: Number(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-brand-gray-200 text-sm outline-none focus:border-brand-pink"
                      placeholder="Order"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(heroImage.id)}
                        className="flex-1 bg-brand-pink text-white py-2 rounded-lg text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-brand-gray-100 text-brand-accent py-2 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-brand-pink font-semibold">
                        {heroImage.category || 'COLLECTION'}
                      </p>
                      <p className="font-semibold text-brand-black">
                        {heroImage.title || heroImage.alt_text || 'Untitled'}
                      </p>
                      <p className="text-xs text-brand-accent/50 mt-1">{heroImage.link_url || '/shop'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(heroImage)}
                        className="flex-1 bg-brand-gray-100 text-brand-accent py-2 rounded-lg hover:bg-brand-gray-200 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(heroImage.id, heroImage.is_active)}
                        className="flex-1 bg-brand-gray-100 text-brand-accent py-2 rounded-lg hover:bg-brand-gray-200 transition-colors text-sm"
                      >
                        {heroImage.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteImage(heroImage.id)}
                        className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-brand-accent/60">
            No hero images found. Upload cards to replace the default carousel.
          </div>
        )}
      </motion.div>
    </div>
  );
}
