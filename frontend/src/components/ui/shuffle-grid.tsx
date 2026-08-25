"use client"

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const ShuffleHero = () => {
  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden bg-gradient-to-br from-brand-pink-dark via-brand-pink to-brand-pink-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 md:hidden bg-gradient-to-b from-black/50 via-black/15 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 md:hidden bg-gradient-to-t from-black/35 via-black/10 to-transparent"
      />

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto min-h-[calc(100dvh-6.25rem)]">
        <div className="text-center md:text-left">
          <span className="block mb-3 sm:mb-4 text-xs sm:text-sm text-white/90 font-medium uppercase tracking-[0.15em]">
            Premium Restaurant & Food Ordering
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white leading-tight text-balance">
            Order Your Favourite Meals
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/85 my-4 md:my-6 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Explore our menu of jollof, soups, grilled specialties, sides, and drinks.
            Fresh meals for delivery or pickup.
          </p>
          <Link
            to="/shop"
            className={cn(
              "inline-block bg-white text-brand-pink font-semibold py-3 px-8 rounded-full",
              "transition-all hover:bg-white/95 hover:shadow-luxury-lg active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-pink"
            )}
          >
            View Menu
          </Link>
        </div>
        <div className="relative w-full max-w-md mx-auto md:max-w-none">
          <ShuffleGrid />
        </div>
      </div>
    </section>
  );
};

interface HeroImage {
  id: number;
  src: string;
  alt?: string;
}

const shuffle = <T,>(array: T[]): T[] => {
  const copy = [...array];
  let currentIndex = copy.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
  }

  return copy;
};

const GRID_SIZE = 16;

const buildGridImages = (images: HeroImage[]): HeroImage[] => {
  if (images.length === 0) return [];
  if (images.length >= GRID_SIZE) return shuffle(images).slice(0, GRID_SIZE);

  const grid: HeroImage[] = [];
  const pool = shuffle(images);
  for (let i = 0; i < GRID_SIZE; i += 1) {
    grid.push(pool[i % pool.length]);
  }
  return grid;
};

const generateSquares = (images: HeroImage[]) => {
  return buildGridImages(images).map((img, index) => (
    <motion.div
      key={`${img.id}-${index}`}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-luxury overflow-hidden bg-brand-gray-100"
      style={{
        backgroundImage: `url(${img.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label={img.alt || "Hero image"}
    />
  ));
};

const PlaceholderGrid = () => (
  <>
    {Array.from({ length: GRID_SIZE }).map((_, index) => (
      <div
        key={index}
        className="w-full h-full rounded-luxury bg-white/10 animate-pulse"
        aria-hidden
      />
    ))}
  </>
);

const ShuffleGrid = () => {
  const [squares, setSquares] = useState<React.ReactNode[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const imagesRef = useRef<HeroImage[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/v1/site/hero-images/');
        if (!response.ok) return;

        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.results ?? [];
        if (!list.length) return;

        const images: HeroImage[] = list.map((img: { id: number; image: string; alt_text?: string }) => ({
          id: img.id,
          src: img.image,
          alt: img.alt_text || 'Hero image',
        }));

        if (!cancelled) {
          imagesRef.current = images;
          setHeroImages(images);
          setSquares(generateSquares(images));
        }
      } catch (error) {
        console.error('Failed to fetch hero images:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHeroImages();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return undefined;

    imagesRef.current = heroImages;
    setSquares(generateSquares(heroImages));

    const intervalId = window.setInterval(() => {
      setSquares(generateSquares(imagesRef.current));
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [heroImages]);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[280px] sm:h-[340px] md:h-[420px] lg:h-[450px] gap-1 rounded-luxury overflow-hidden ring-2 ring-white/20 shadow-luxury-lg">
      {loading && squares.length === 0 ? <PlaceholderGrid /> : squares}
    </div>
  );
};
