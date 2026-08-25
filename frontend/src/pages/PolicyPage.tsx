import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';
import { siteApi } from '@/api';
import { POLICY_META, type PolicyType } from '@/constants/policies';

function PolicySection({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        const firstLine = lines[0]?.trim() || '';

        if (/^\d+\.\s/.test(firstLine) && lines.length === 1) {
          return (
            <h2 key={i} className="text-lg font-display font-semibold text-brand-black pt-2">
              {firstLine}
            </h2>
          );
        }

        if (/^\d+\.\s/.test(firstLine)) {
          return (
            <div key={i}>
              <h2 className="text-lg font-display font-semibold text-brand-black mb-2">
                {firstLine}
              </h2>
              <div className="text-sm text-brand-accent/75 leading-relaxed space-y-2">
                {lines.slice(1).map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            </div>
          );
        }

        return (
          <p key={i} className="text-sm text-brand-accent/75 leading-relaxed">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export default function PolicyPage() {
  const location = useLocation();
  const pageType = (location.pathname.replace('/', '') || 'privacy') as PolicyType;
  const policy = POLICY_META[pageType] || POLICY_META.privacy;

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => siteApi.settings().then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  const adminContent = settings?.[policy.field];
  const rawContent = adminContent?.trim() ? adminContent : policy.defaultContent;
  const content = rawContent
    .replace(
      /jbluxeaccessories-project-production\.up\.railway\.app/gi,
      'tasty-fingers-01-production.up.railway.app',
    )
    .replace(/www\.jbluxeaccessories\.com/gi, 'tastyfingers.com')
    .replace(/jbluxeaccessories\.com/gi, 'tastyfingers.com')
    .replace(/contact@jbluxeaccessories\.com/gi, 'contact@tastyfingers.com');

  const otherPolicies = (Object.keys(POLICY_META) as PolicyType[]).filter((k) => k !== pageType);

  return (
    <>
      <SEO title={policy.title} description={policy.subtitle} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-pink-dark via-brand-pink to-brand-pink-dark">
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative section-padding max-w-4xl mx-auto text-center py-12 md:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/90 mb-3">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-white mb-3">
            {policy.title}
          </h1>
          <p className="text-white/85 text-sm md:text-base max-w-xl mx-auto">
            {policy.subtitle}
          </p>
        </div>
      </section>

      <div className="section-padding max-w-4xl mx-auto -mt-6 relative z-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-luxury shadow-luxury border border-brand-gray-100 p-6 md:p-10 mb-8"
        >
          <PolicySection text={content} />
        </motion.div>

        {/* Cross-links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherPolicies.map((key) => (
            <Link
              key={key}
              to={`/${key}`}
              className="group flex items-center justify-between p-5 rounded-luxury bg-white border border-brand-gray-100 shadow-card hover:border-brand-pink/30 hover:shadow-luxury transition-all"
            >
              <div>
                <p className="font-display font-semibold text-brand-black group-hover:text-brand-pink transition-colors">
                  {POLICY_META[key].title}
                </p>
                <p className="text-xs text-brand-accent/50 mt-1 line-clamp-1">
                  {POLICY_META[key].subtitle}
                </p>
              </div>
              <span className="text-brand-pink text-lg">→</span>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-brand-accent/40 mt-8">
          Questions? Contact us at{' '}
          <a href="mailto:contact@tastyfingers.com" className="text-brand-pink hover:underline">
            contact@tastyfingers.com
          </a>
        </p>
      </div>
    </>
  );
}
