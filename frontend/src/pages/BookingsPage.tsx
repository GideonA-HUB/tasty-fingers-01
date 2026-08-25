import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, MapPin, ChefHat, GraduationCap,
  PartyPopper, CheckCircle2, Upload, Phone, Mail,
} from 'lucide-react';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { siteApi } from '@/api';
import type { EventServiceType, TrainingProgram } from '@/types';
import { BRAND_WHATSAPP, BRAND_EMAIL } from '@/constants/brand';

type Tab = 'events' | 'training';

const EVENT_SIZES = [
  { value: 'small', label: 'Small (1–25 guests)' },
  { value: 'medium', label: 'Medium (26–75 guests)' },
  { value: 'large', label: 'Large (76–150 guests)' },
  { value: 'xlarge', label: 'Extra Large (150+ guests)' },
];

const EVENT_IMAGES: Record<string, string> = {
  'birthday-party': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
  'wedding-reception': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
  'outdoor-event': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
  'corporate-event': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
  'show-concert': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
  'family-gathering': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
};

function formatNaira(value: string | number | null | undefined) {
  if (!value) return null;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!num) return null;
  return `From ₦${num.toLocaleString('en-NG')}`;
}

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>('events');
  const [selectedEvent, setSelectedEvent] = useState<EventServiceType | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { data: eventServices = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['event-services'],
    queryFn: () => siteApi.eventServices(),
  });

  const { data: trainingPrograms = [], isLoading: loadingTraining } = useQuery({
    queryKey: ['training-programs'],
    queryFn: () => siteApi.trainingPrograms(),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('inquiry_type', tab === 'events' ? 'event' : 'training');
    if (tab === 'events' && selectedEvent) {
      fd.set('event_service', String(selectedEvent.id));
    }
    if (tab === 'training' && selectedProgram) {
      fd.set('training_program', String(selectedProgram.id));
    }
    try {
      await siteApi.submitBooking(fd);
      setSubmitted(true);
      form.reset();
    } catch {
      setError('Could not submit your request. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvents || loadingTraining) return <LoadingSpinner fullScreen={false} />;

  return (
    <>
      <SEO
        title="Bookings & Training"
        description="Book Tasty Fingers for birthdays, weddings, corporate events, outdoor celebrations, and culinary training programs."
      />

      {/* Hero — Blue Wardrobe style with orange gradient */}
      <section className="relative overflow-hidden bg-brand-gradient py-16 md:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-radial opacity-60" />
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative section-padding max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm"
          >
            <PartyPopper className="h-3.5 w-3.5" />
            Catering & Culinary Training
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight"
          >
            Bookings & Training
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-white/90 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Premium finger foods, sauced chicken & turkey, yogurt parfaits, and exceptional
            catering for every occasion — plus professional culinary training for aspiring chefs.
          </motion.p>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-[calc(4.75rem+2.25rem)] sm:top-[calc(5.5rem+2.25rem)] z-40 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-b border-brand-gray-100 dark:border-orange-900/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-2 py-3">
          <button
            type="button"
            onClick={() => { setTab('events'); setSubmitted(false); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              tab === 'events'
                ? 'bg-brand-pink text-white shadow-orange'
                : 'text-brand-accent dark:text-orange-100 hover:bg-brand-orange-pale dark:hover:bg-orange-950/30'
            }`}
          >
            <ChefHat className="h-4 w-4" />
            Event Catering
          </button>
          <button
            type="button"
            onClick={() => { setTab('training'); setSubmitted(false); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              tab === 'training'
                ? 'bg-brand-pink text-white shadow-orange'
                : 'text-brand-accent dark:text-orange-100 hover:bg-brand-orange-pale dark:hover:bg-orange-950/30'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Training Programs
          </button>
        </div>
      </div>

      <div className="section-padding max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {tab === 'events' ? (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-2xl font-display font-semibold text-brand-black dark:text-orange-50 mb-2">
                  Choose Your Event Type
                </h2>
                <p className="text-brand-accent/70 dark:text-orange-200/70 text-sm md:text-base">
                  Birthdays, weddings, outdoor events, corporate functions, shows, and more.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {eventServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedEvent(service)}
                    className={`group text-left rounded-luxury overflow-hidden border-2 transition-all hover:shadow-luxury ${
                      selectedEvent?.id === service.id
                        ? 'border-brand-pink shadow-orange'
                        : 'border-brand-gray-100 dark:border-orange-900/30 hover:border-brand-pink/50'
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-brand-orange-pale">
                      <img
                        src={service.image || EVENT_IMAGES[service.slug] || EVENT_IMAGES['family-gathering']}
                        alt={service.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 bg-white dark:bg-dark-card">
                      <h3 className="font-display font-semibold text-brand-black dark:text-orange-50">{service.name}</h3>
                      <p className="text-sm text-brand-accent/60 dark:text-orange-200/60 mt-1 line-clamp-2">{service.description}</p>
                      {formatNaira(service.starting_price) && (
                        <p className="text-sm font-semibold text-brand-pink mt-2">{formatNaira(service.starting_price)}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-2xl font-display font-semibold text-brand-black dark:text-orange-50 mb-2">
                  Culinary Training Programs
                </h2>
                <p className="text-brand-accent/70 dark:text-orange-200/70 text-sm md:text-base">
                  Hands-on classes for finger foods, Nigerian catering, and sauced meat techniques.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {trainingPrograms.map((program) => (
                  <button
                    key={program.id}
                    type="button"
                    onClick={() => setSelectedProgram(program)}
                    className={`group text-left rounded-luxury overflow-hidden border-2 transition-all hover:shadow-luxury flex flex-col ${
                      selectedProgram?.id === program.id
                        ? 'border-brand-pink shadow-orange'
                        : 'border-brand-gray-100 dark:border-orange-900/30 hover:border-brand-pink/50'
                    }`}
                  >
                    <div className="aspect-video overflow-hidden bg-brand-orange-pale">
                      <img
                        src={program.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop'}
                        alt={program.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 bg-white dark:bg-dark-card flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-brand-black dark:text-orange-50">{program.title}</h3>
                        {program.duration && (
                          <span className="shrink-0 text-xs font-medium bg-brand-orange-pale dark:bg-orange-950/40 text-brand-pink px-2 py-1 rounded-full">
                            {program.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-brand-accent/60 dark:text-orange-200/60 mt-2 flex-1">{program.description}</p>
                      {program.highlights_list?.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {program.highlights_list.slice(0, 3).map((h) => (
                            <li key={h} className="flex items-center gap-1.5 text-xs text-brand-accent/70 dark:text-orange-200/70">
                              <CheckCircle2 className="h-3 w-3 text-brand-pink shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-lg font-bold text-brand-pink mt-4">
                        ₦{parseFloat(program.price).toLocaleString('en-NG')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-luxury border border-brand-gray-100 dark:border-orange-900/30 bg-white dark:bg-dark-card shadow-luxury overflow-hidden"
        >
          <div className="bg-brand-gradient px-6 py-5 md:px-8">
            <h2 className="text-xl font-display font-semibold text-white">
              {tab === 'events' ? 'Request Event Quote' : 'Enroll in Training'}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Fill in your details and our team will respond within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-10 text-center">
              <CheckCircle2 className="h-14 w-14 text-brand-pink mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brand-black dark:text-orange-50">Request Received!</h3>
              <p className="text-brand-accent/70 dark:text-orange-200/70 mt-2 max-w-md mx-auto">
                Thank you for choosing Tasty Fingers. We will review your request and contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {tab === 'events' && !selectedEvent && (
                <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-4 py-3">
                  Please select an event type above before submitting.
                </p>
              )}
              {tab === 'training' && !selectedProgram && (
                <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-4 py-3">
                  Please select a training program above before submitting.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Full Name *</label>
                  <input name="full_name" required className="input-luxury" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Phone *</label>
                  <input name="phone" required type="tel" className="input-luxury" placeholder="+234..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Email *</label>
                  <input name="email" required type="email" className="input-luxury" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Organization</label>
                  <input name="organization" className="input-luxury" placeholder="Company or group name (optional)" />
                </div>
              </div>

              {tab === 'events' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">
                        <Calendar className="inline h-3.5 w-3.5 mr-1" /> Event Date
                      </label>
                      <input name="event_date" type="date" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Event Time</label>
                      <input name="event_time" type="time" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">
                        <Users className="inline h-3.5 w-3.5 mr-1" /> Number of Guests
                      </label>
                      <input name="guest_count" type="number" min="1" className="input-luxury" placeholder="e.g. 50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Event Size</label>
                      <select name="event_size" className="input-luxury">
                        <option value="">Select size</option>
                        {EVENT_SIZES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Estimated Budget (₦)</label>
                      <input name="budget" type="number" min="0" className="input-luxury" placeholder="e.g. 250000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">
                        <MapPin className="inline h-3.5 w-3.5 mr-1" /> Event Location
                      </label>
                      <input name="event_location" className="input-luxury" placeholder="Venue address or area" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Menu Preferences</label>
                    <textarea name="menu_preferences" rows={3} className="input-luxury resize-none" placeholder="Preferred meals, dietary requirements, service style..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">
                      <Upload className="inline h-3.5 w-3.5 mr-1" /> Reference Image (optional)
                    </label>
                    <input name="reference_image" type="file" accept="image/*" className="input-luxury file:mr-3 file:rounded-lg file:border-0 file:bg-brand-orange-pale file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-pink" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-brand-accent dark:text-orange-100 mb-1.5">Additional Message</label>
                <textarea name="message" rows={4} className="input-luxury resize-none" placeholder="Tell us more about your event or training goals..." />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-4 text-sm text-brand-accent/60 dark:text-orange-200/60">
                  <a href={`mailto:${BRAND_EMAIL}`} className="flex items-center gap-1 hover:text-brand-pink">
                    <Mail className="h-4 w-4" /> {BRAND_EMAIL}
                  </a>
                  <a href={`https://wa.me/${BRAND_WHATSAPP.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1 hover:text-brand-pink">
                    <Phone className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
                <button
                  type="submit"
                  disabled={submitting || (tab === 'events' ? !selectedEvent : !selectedProgram)}
                  className="btn-primary w-full sm:w-auto min-w-[200px] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : tab === 'events' ? 'Request Quote' : 'Apply for Training'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}
