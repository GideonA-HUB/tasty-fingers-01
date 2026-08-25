import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { siteApi } from '@/api';

export default function AboutPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  const title = settings?.about_title || 'About Tasty Fingers';
  const subtitle = settings?.about_subtitle || settings?.tagline || 'Delicious Meals, Delivered with Care';

  return (
    <>
      <SEO title="About Us" description="Discover the Tasty Fingers story — authentic Nigerian meals, delivered fresh" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-pink-dark via-brand-pink to-brand-pink-dark">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-black/10 blur-3xl" />
        <div className="relative section-padding max-w-6xl mx-auto text-center py-14 md:py-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-white/90 mb-3"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-5xl font-display font-semibold text-white mb-4"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/85 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>
      </section>

      <div className="section-padding max-w-6xl mx-auto -mt-6 md:-mt-10 relative z-10">
        {/* CEO + Brand Story */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 overflow-hidden mb-8 md:mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative bg-brand-gray-50 min-h-[280px] lg:min-h-[400px] flex items-center justify-center p-8">
              {settings?.ceo_photo ? (
                <img
                  src={settings.ceo_photo}
                  alt={settings.ceo_name || 'CEO'}
                  className="w-full max-w-sm aspect-[3/4] object-cover object-top rounded-luxury shadow-luxury"
                />
              ) : (
                <div className="text-center text-brand-accent/30">
                  <p className="text-6xl mb-3">✦</p>
                  <p className="text-sm">Upload CEO photo in Django Admin</p>
                  <p className="text-xs mt-1">Site Settings → About Page</p>
                </div>
              )}
            </div>

            <div className="p-6 md:p-10 flex flex-col justify-center">
              {settings?.ceo_name && (
                <div className="mb-6 pb-6 border-b border-brand-gray-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-brand-pink mb-1">
                    {settings.ceo_title || 'Founder & CEO'}
                  </p>
                  <h2 className="text-2xl font-display font-semibold text-brand-black">
                    {settings.ceo_name}
                  </h2>
                  {settings.ceo_bio && (
                    <p className="text-sm text-brand-accent/70 mt-3 leading-relaxed whitespace-pre-line">
                      {settings.ceo_bio}
                    </p>
                  )}
                </div>
              )}

              {settings?.brand_story ? (
                <div>
                  <h3 className="text-lg font-display font-semibold text-brand-black mb-3">
                    The Tasty Fingers Story
                  </h3>
                  <p className="text-sm md:text-base text-brand-accent/70 leading-relaxed whitespace-pre-line">
                    {settings.brand_story}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-brand-accent/60 leading-relaxed">
                  Tasty Fingers is a premium restaurant specializing in authentic Nigerian meals —
                  jollof, soups, rice dishes, grilled specialties, and more — prepared fresh for
                  delivery and pickup by food lovers who demand excellence.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* About content */}
        {settings?.about_content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-luxury shadow-card border border-brand-gray-100 p-6 md:p-10 mb-8 md:mb-12"
          >
            <p className="text-sm md:text-base text-brand-accent/70 leading-relaxed whitespace-pre-line">
              {settings.about_content}
            </p>
          </motion.div>
        )}

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings?.mission && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-luxury bg-gradient-to-br from-brand-pink/5 to-brand-gray-50 border border-brand-pink/10 p-6 md:p-8"
            >
              <div className="absolute top-4 right-4 text-brand-pink/20 text-4xl font-display">M</div>
              <h2 className="font-display font-semibold text-brand-pink text-lg mb-3">Our Mission</h2>
              <p className="text-sm text-brand-accent/70 leading-relaxed whitespace-pre-line">
                {settings.mission}
              </p>
            </motion.div>
          )}
          {settings?.vision && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="relative overflow-hidden rounded-luxury bg-gradient-to-br from-brand-black/5 to-brand-gray-50 border border-brand-gray-200 p-6 md:p-8"
            >
              <div className="absolute top-4 right-4 text-brand-black/10 text-4xl font-display">V</div>
              <h2 className="font-display font-semibold text-brand-black text-lg mb-3">Our Vision</h2>
              <p className="text-sm text-brand-accent/70 leading-relaxed whitespace-pre-line">
                {settings.vision}
              </p>
            </motion.div>
          )}
        </div>

        {/* Values strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Authentic', desc: 'Homestyle Nigerian meals' },
            { label: 'Fresh', desc: 'Made to order daily' },
            { label: 'Premium', desc: 'Quality ingredients' },
            { label: 'Trusted', desc: 'Delivery & pickup' },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-4 rounded-card bg-white shadow-card border border-brand-gray-100"
            >
              <p className="text-brand-pink font-display font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-brand-accent/50 mt-1">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
