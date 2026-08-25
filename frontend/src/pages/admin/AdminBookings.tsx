import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteApi } from '@/api';
import type { BookingInquiry } from '@/types';

const STATUS_OPTIONS = [
  'pending', 'reviewing', 'quoted', 'confirmed', 'completed', 'cancelled',
];

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  reviewing: 'Under Review',
  quoted: 'Quote Sent',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  reviewing: 'bg-blue-100 text-blue-800',
  quoted: 'bg-purple-100 text-purple-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminBookings() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => siteApi.adminBookings(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BookingInquiry> }) =>
      siteApi.adminUpdateBooking(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.inquiry_type === filter);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Bookings & Training</h1>
          <p className="text-sm text-brand-accent/60 mt-1">Manage event catering and training inquiries</p>
        </div>
        <div className="flex gap-2">
          {['all', 'event', 'training'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f ? 'bg-brand-pink text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-pink/40'
              }`}
            >
              {f === 'all' ? 'All' : f === 'event' ? 'Events' : 'Training'}
            </button>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-pink border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-brand-accent/60 bg-white rounded-2xl border border-slate-100">
          No booking inquiries yet
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full text-left p-5 flex flex-wrap items-start justify-between gap-3 hover:bg-brand-orange-pale/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-brand-black">{booking.full_name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[booking.status] || STATUS_COLORS.pending}`}>
                      {STATUS_LABELS[booking.status] || booking.status}
                    </span>
                    <span className="text-xs bg-brand-orange-pale text-brand-pink px-2 py-0.5 rounded-full">
                      {booking.inquiry_type_display}
                    </span>
                  </div>
                  <p className="text-sm text-brand-accent/60 mt-1">
                    {booking.event_service_name || booking.training_program_title || '—'}
                    {booking.guest_count ? ` · ${booking.guest_count} guests` : ''}
                    {booking.event_date ? ` · ${booking.event_date}` : ''}
                  </p>
                </div>
                <p className="text-xs text-brand-accent/40">{new Date(booking.created_at).toLocaleString()}</p>
              </button>

              {expandedId === booking.id && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Phone:</strong> {booking.phone}</p>
                    {booking.organization && <p><strong>Organization:</strong> {booking.organization}</p>}
                    {booking.event_location && <p><strong>Location:</strong> {booking.event_location}</p>}
                    {booking.budget && <p><strong>Budget:</strong> ₦{parseFloat(booking.budget).toLocaleString()}</p>}
                    {booking.event_size_display && <p><strong>Size:</strong> {booking.event_size_display}</p>}
                  </div>
                  {booking.menu_preferences && (
                    <p className="text-sm"><strong>Menu:</strong> {booking.menu_preferences}</p>
                  )}
                  {booking.message && (
                    <p className="text-sm"><strong>Message:</strong> {booking.message}</p>
                  )}
                  {booking.reference_image && (
                    <img src={booking.reference_image} alt="Reference" className="max-h-40 rounded-xl border" />
                  )}
                  <div className="flex flex-wrap gap-3 items-end">
                    <div>
                      <label className="block text-xs font-medium text-brand-accent/60 mb-1">Status</label>
                      <select
                        value={booking.status}
                        onChange={(e) => updateMutation.mutate({ id: booking.id, data: { status: e.target.value } })}
                        className="input-luxury py-2 text-sm"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </div>
                    <a href={`mailto:${booking.email}`} className="btn-outline text-sm py-2">Email Client</a>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-accent/60 mb-1">Admin Notes</label>
                    <textarea
                      defaultValue={booking.admin_notes}
                      rows={2}
                      className="input-luxury text-sm resize-none"
                      onBlur={(e) => {
                        if (e.target.value !== booking.admin_notes) {
                          updateMutation.mutate({ id: booking.id, data: { admin_notes: e.target.value } });
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
