"use client";

import React, { useState, useEffect, useCallback, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Gift,
  Gem,
  Heart,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  Watch,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCarouselItem {
  id: string;
  label: string;
  description: string;
  image: string;
  icon?: ComponentType<LucideProps>;
}

const ICON_CYCLE: ComponentType<LucideProps>[] = [
  Gem,
  Package,
  Watch,
  ShieldCheck,
  Sparkles,
  Truck,
  Gift,
  Heart,
  Award,
];

const DEFAULT_FEATURES: FeatureCarouselItem[] = [
  {
    id: "authentic",
    label: "Authentic Nigerian Flavours",
    description: "Homestyle recipes prepared with quality ingredients.",
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1200&h=1500&fit=crop&auto=format&q=80",
  },
  {
    id: "curated",
    label: "Full Menu Selection",
    description: "Jollof, soups, grills, sides, drinks & more.",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&h=1500&fit=crop&auto=format&q=80",
  },
  {
    id: "her-him",
    label: "Meals for Everyone",
    description: "Portions and dishes for individuals, families & groups.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=1500&fit=crop&auto=format&q=80",
  },
  {
    id: "quality",
    label: "Fresh Every Day",
    description: "Made to order so every meal arrives hot and delicious.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=1500&fit=crop&auto=format&q=80",
  },
  {
    id: "elegance",
    label: "Crowd Favourites",
    description: "Signature dishes that keep customers coming back.",
    image:
      "https://images.unsplash.com/photo-1544145945-f904253e6167?w=1200&h=1500&fit=crop&auto=format&q=80",
  },
  {
    id: "delivery",
    label: "Fast Delivery",
    description: "Swift nationwide delivery and convenient pickup.",
    image:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&h=1500&fit=crop&auto=format&q=80",
  },
  {
    id: "gifts",
    label: "Catering Ready",
    description: "Perfect for parties, offices, and special occasions.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=1500&fit=crop&auto=format&q=80",
  },
];

const AUTO_PLAY_INTERVAL = 3500;
const ITEM_HEIGHT_MOBILE = 56;
const ITEM_HEIGHT_DESKTOP = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export interface FeatureCarouselProps {
  features?: FeatureCarouselItem[];
  className?: string;
}

export function FeatureCarousel({
  features = DEFAULT_FEATURES,
  className,
}: FeatureCarouselProps) {
  const items = features.length > 0 ? features : DEFAULT_FEATURES;
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemHeight, setItemHeight] = useState(ITEM_HEIGHT_MOBILE);

  useEffect(() => {
    const syncHeight = () => {
      setItemHeight(window.innerWidth >= 768 ? ITEM_HEIGHT_DESKTOP : ITEM_HEIGHT_MOBILE);
    };
    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, []);

  const currentIndex =
    ((step % items.length) + items.length) % items.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + items.length) % items.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused, items.length]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = items.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className={cn("mx-auto w-full max-w-7xl px-3 sm:px-4 md:p-8", className)}>
      <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white sm:min-h-[600px] sm:rounded-[2.5rem] lg:aspect-video lg:flex-row lg:rounded-[3.5rem]">
        {/* Feature chips — black brand panel */}
        <div className="relative z-30 flex min-h-[280px] w-full flex-col items-start justify-center overflow-hidden bg-black px-5 py-10 sm:min-h-[350px] sm:px-10 sm:py-12 md:min-h-[420px] md:px-14 lg:h-full lg:w-[40%] lg:px-12 lg:py-0">
          <div className="absolute inset-x-0 top-0 z-40 h-10 bg-gradient-to-b from-black via-black/80 to-transparent sm:h-16" />
          <div className="absolute inset-x-0 bottom-0 z-40 h-10 bg-gradient-to-t from-black via-black/80 to-transparent sm:h-16" />

          <div className="relative z-20 flex h-full w-full items-center justify-center lg:justify-start">
            {items.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(items.length / 2),
                items.length / 2,
                distance,
              );
              const Icon = feature.icon || ICON_CYCLE[index % ICON_CYCLE.length];

              return (
                <motion.div
                  key={feature.id}
                  style={{ height: itemHeight, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * itemHeight,
                    opacity: Math.max(0.62, 1 - Math.abs(wrappedDistance) * 0.16),
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    type="button"
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-full border px-4 py-3 text-left transition-all duration-500 sm:gap-4 sm:px-6 sm:py-3.5 md:px-8 md:py-4",
                      isActive
                        ? "z-10 border-white !bg-white !text-black shadow-lg"
                        : "border-white/35 bg-transparent !text-white/80 hover:border-white/70 hover:!text-white",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                        isActive ? "!text-black" : "!text-white/70",
                      )}
                    >
                      <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
                    </div>
                    <span className="max-w-[11rem] truncate text-xs font-medium uppercase tracking-tight sm:max-w-none sm:text-[13px] md:text-[15px]">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Image cards */}
        <div className="relative flex min-h-[420px] flex-1 items-center justify-center overflow-hidden border-t border-neutral-200 bg-neutral-50 px-4 py-10 sm:min-h-[520px] sm:px-8 sm:py-16 md:min-h-[600px] md:px-12 md:py-20 lg:h-full lg:border-l lg:border-t-0 lg:px-10 lg:py-16">
          <div className="relative flex aspect-[4/5] w-full max-w-[280px] items-center justify-center sm:max-w-[360px] md:max-w-[420px]">
            {items.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -72 : isNext ? 72 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.86 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.35 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 origin-center overflow-hidden rounded-[1.5rem] border-4 border-white bg-white shadow-2xl shadow-black/20 sm:rounded-[2rem] sm:border-[6px] md:rounded-[2.5rem] md:border-8"
                >
                  <img
                    src={feature.image}
                    alt={feature.label}
                    className={cn(
                      "h-full w-full object-cover transition-all duration-700",
                      isActive
                        ? "grayscale-0 blur-0"
                        : "brightness-75 grayscale blur-[2px]",
                    )}
                    loading="lazy"
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/45 to-transparent p-5 pt-24 sm:p-8 sm:pt-28 md:p-10 md:pt-32"
                      >
                        <div className="mb-2 w-fit rounded-full border border-neutral-200 !bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] !text-black shadow-lg sm:mb-3 sm:px-4 sm:py-1.5 sm:text-[11px]">
                          {index + 1} • {feature.label}
                        </div>
                        <p className="text-base font-medium leading-snug tracking-tight text-white drop-shadow-md sm:text-xl md:text-2xl">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute left-4 top-4 flex items-center gap-2 transition-opacity duration-300 sm:left-6 sm:top-6 sm:gap-3 md:left-8 md:top-8",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <span className="font-mono text-[9px] font-medium uppercase tracking-[0.28em] text-white/85 sm:text-[10px]">
                      Tasty Fingers
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
