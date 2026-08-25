import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PulseFitNavigationItem {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
}

export interface PulseFitProgramCard {
  image: string;
  category: string;
  title: string;
  onClick?: () => void;
}

export interface PulseFitHeroProps {
  logo?: string;
  showHeader?: boolean;
  navigation?: PulseFitNavigationItem[];
  ctaButton?: {
    label: string;
    onClick: () => void;
  };
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  disclaimer?: string;
  socialProof?: {
    avatars: string[];
    text: string;
  };
  programs?: PulseFitProgramCard[];
  className?: string;
  children?: React.ReactNode;
}

export function PulseFitHero({
  logo = 'Tasty Fingers',
  showHeader = false,
  navigation = [],
  ctaButton,
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  disclaimer,
  socialProof,
  programs = [],
  className,
  children,
}: PulseFitHeroProps) {
  const cardCount = Math.max(programs.length, 1);

  return (
    <section
      className={cn(
        'relative flex w-full min-h-[100dvh] flex-col overflow-hidden',
        className,
      )}
      style={{
        background: 'linear-gradient(180deg, #C65A12 0%, #ED7D2B 42%, #F5A623 78%, #FFF7ED 100%)',
      }}
      role="banner"
      aria-label="Hero section"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full bg-white/10 blur-3xl sm:-left-24 sm:top-10 sm:h-[28rem] sm:w-[28rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 bottom-16 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:-right-20 sm:bottom-24 sm:h-[22rem] sm:w-[22rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-hero-radial"
      />

      {showHeader && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 flex flex-row items-center justify-between px-4 py-5 sm:px-8 sm:py-8 lg:px-16"
        >
          <div className="font-display text-lg font-bold text-white sm:text-2xl">{logo}</div>

          <nav className="hidden flex-row items-center gap-8 lg:flex" aria-label="Main navigation">
            {navigation.map((item, index) => (
              <button
                key={`${item.label}-${index}`}
                type="button"
                onClick={item.onClick}
                className="flex flex-row items-center gap-1 text-base text-neutral-600 transition-opacity hover:opacity-70"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
              </button>
            ))}
          </nav>

          {ctaButton && (
            <button
              type="button"
              onClick={ctaButton.onClick}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition-all hover:scale-105 sm:px-6 sm:py-3 sm:text-base"
            >
              {ctaButton.label}
            </button>
          )}
        </motion.header>
      )}

      {children ? (
        <div className="relative z-10 flex w-full flex-1 items-center justify-center">
          {children}
        </div>
      ) : (
        <div
          className={cn(
            'relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6',
            showHeader ? 'pt-2 sm:pt-4' : 'pt-8 sm:pt-12 md:pt-16',
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex w-full max-w-4xl flex-col items-center gap-5 text-center sm:gap-7 md:gap-8"
          >
            {eyebrow && (
              <span className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur-sm sm:text-xs">
                {eyebrow}
              </span>
            )}

            <h1 className="font-display text-[clamp(1.85rem,8vw,4.5rem)] font-semibold leading-[1.08] tracking-tight text-white text-balance drop-shadow-sm">
              {title}
            </h1>

            <p className="max-w-xl text-[0.95rem] leading-relaxed text-white/90 sm:text-[clamp(1rem,2vw,1.25rem)]">
              {subtitle}
            </p>

            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:items-center sm:gap-4"
              >
                {primaryAction && (
                  <button
                    type="button"
                    onClick={primaryAction.onClick}
                    className="flex flex-row items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-brand-pink shadow-lg shadow-black/20 transition-all hover:scale-[1.02] hover:bg-brand-orange-pale active:scale-[0.98] sm:px-8 sm:py-4 sm:text-lg"
                  >
                    {primaryAction.label}
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}

                {secondaryAction && (
                  <button
                    type="button"
                    onClick={secondaryAction.onClick}
                    className="rounded-full border-2 border-white bg-transparent px-6 py-3.5 text-base font-medium text-white transition-all hover:scale-[1.02] hover:bg-white hover:text-brand-pink active:scale-[0.98] sm:px-8 sm:py-4 sm:text-lg"
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </motion.div>
            )}

            {disclaimer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="px-2 text-xs italic text-white/75 sm:text-sm"
              >
                {disclaimer}
              </motion.p>
            )}

            {socialProof && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3"
              >
                <div className="flex flex-row -space-x-2">
                  {socialProof.avatars.map((avatar, index) => (
                    <img
                      key={`${avatar}-${index}`}
                      src={avatar}
                      alt=""
                      className="h-8 w-8 rounded-full border-2 border-white object-cover sm:h-10 sm:w-10"
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-white/90 sm:text-sm">
                  {socialProof.text}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {programs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="relative z-10 w-full overflow-hidden py-8 sm:py-12 md:py-16"
        >
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-16 sm:block sm:w-[100px] md:w-[120px]"
            style={{
              background: 'linear-gradient(90deg, #FFF7ED 0%, rgba(255,247,237,0) 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-16 sm:block sm:w-[100px] md:w-[120px]"
            style={{
              background: 'linear-gradient(270deg, #FFF7ED 0%, rgba(255,247,237,0) 100%)',
            }}
          />

          <motion.div
            className="flex items-center gap-3 pl-4 sm:gap-5 sm:pl-6 md:gap-6"
            animate={{
              x: [0, -((cardCount * 300) / 2)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: Math.max(cardCount * 3.2, 16),
                ease: 'linear',
              },
            }}
          >
            {[...programs, ...programs].map((program, index) => (
              <motion.button
                key={`${program.title}-${index}`}
                type="button"
                whileHover={{ scale: 1.03, y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                onClick={program.onClick}
                className="relative h-[300px] w-[220px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl text-left shadow-xl shadow-black/15 sm:h-[380px] sm:w-[280px] sm:rounded-3xl md:h-[440px] md:w-[320px]"
              >
                <img
                  src={program.image}
                  alt={program.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.78) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1.5 p-4 sm:gap-2 sm:p-5 md:p-6">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 sm:text-xs">
                    {program.category}
                  </span>
                  <h3 className="font-display text-lg font-semibold leading-snug text-white sm:text-xl md:text-2xl">
                    {program.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
