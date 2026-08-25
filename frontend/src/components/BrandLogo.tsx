import { cn } from '@/lib/utils';
import { getBrandLogoUrl, useSiteAssets } from '@/hooks/useSiteAssets';
import { useThemeStore } from '@/store/themeStore';

interface BrandLogoProps {
  /** Where the logo is shown — picks light/dark asset when available */
  variant?: 'navbar' | 'menu' | 'footer' | 'default';
  alt?: string;
  className?: string;
}

/**
 * Renders the logo from Django Site Assets (admin), with static fallback.
 * Navbar sits on black with a white pad — uses primary/dark logo (readable on white).
 * Menu/footer adapt to theme / dark background.
 */
export default function BrandLogo({
  variant = 'default',
  alt = 'Tasty Fingers',
  className,
}: BrandLogoProps) {
  const { assets, isLoading } = useSiteAssets();
  const theme = useThemeStore((s) => s.theme);

  // Avoid flashing the old static casseo fallback while the admin assets load.
  if (isLoading && !assets) {
    return (
      <span
        className={cn('inline-block bg-transparent', className)}
        style={{ minWidth: '4rem' }}
        aria-hidden
      />
    );
  }

  let src: string;
  if (variant === 'navbar') {
    // White plate on black bar → prefer dark/primary mark
    src = getBrandLogoUrl(assets, { prefer: 'dark' });
  } else if (variant === 'footer') {
    src = getBrandLogoUrl(assets, { prefer: 'light', onDarkBackground: true });
  } else if (variant === 'menu') {
    src = getBrandLogoUrl(assets, {
      prefer: theme === 'dark' ? 'light' : 'dark',
    });
  } else {
    src = getBrandLogoUrl(assets);
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('object-contain', className)}
      loading="eager"
      decoding="async"
    />
  );
}
