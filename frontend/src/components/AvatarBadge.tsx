const AVATAR_VISUAL: Record<string, { emoji: string; bg: string }> = {
  chef: { emoji: '👨‍🍳', bg: 'from-orange-400 to-amber-500' },
  plate: { emoji: '🍽️', bg: 'from-rose-400 to-orange-400' },
  jollof: { emoji: '🍚', bg: 'from-amber-500 to-red-500' },
  pepper: { emoji: '🌶️', bg: 'from-red-500 to-orange-600' },
  fork: { emoji: '🍴', bg: 'from-stone-500 to-orange-500' },
  smile: { emoji: '😊', bg: 'from-yellow-400 to-orange-400' },
  star: { emoji: '⭐', bg: 'from-amber-300 to-orange-500' },
  heart: { emoji: '❤️', bg: 'from-rose-500 to-pink-500' },
};

interface AvatarBadgeProps {
  avatar: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarBadge({ avatar, size = 'md', className = '' }: AvatarBadgeProps) {
  const visual = AVATAR_VISUAL[avatar] || AVATAR_VISUAL.chef;
  const sizeClass =
    size === 'sm' ? 'h-10 w-10 text-lg' : size === 'lg' ? 'h-20 w-20 text-3xl' : 'h-14 w-14 text-2xl';

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${visual.bg} shadow-md ${sizeClass} ${className}`}
      aria-hidden
    >
      <span>{visual.emoji}</span>
    </div>
  );
}

export const ORDER_STATUS_STEPS = [
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'out_for_delivery', label: 'On the way' },
  { key: 'delivered', label: 'Delivered' },
] as const;

const LEGACY_STATUS_MAP: Record<string, string> = {
  processing: 'preparing',
  shipped: 'out_for_delivery',
};

export function normalizeOrderStatus(status: string): string {
  return LEGACY_STATUS_MAP[status] || status;
}

export function statusLabel(status: string): string {
  const normalized = normalizeOrderStatus(status);
  const found = ORDER_STATUS_STEPS.find((s) => s.key === normalized);
  if (found) return found.label;
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'refunded') return 'Refunded';
  return status.replace(/_/g, ' ');
}

export function OrderTimeline({ status }: { status: string }) {
  const normalized = normalizeOrderStatus(status);
  if (status === 'cancelled' || status === 'refunded') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Order {statusLabel(status)}
      </div>
    );
  }

  const activeIdx = ORDER_STATUS_STEPS.findIndex((s) => s.key === normalized);
  const idx = activeIdx >= 0 ? activeIdx : 0;

  return (
    <div className="space-y-3">
      {ORDER_STATUS_STEPS.map((step, i) => {
        const done = i <= idx;
        const current = i === idx;
        return (
          <div key={step.key} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? 'bg-brand-pink text-white shadow-sm shadow-brand-pink/40'
                  : 'bg-brand-gray-100 text-brand-accent/40'
              } ${current ? 'ring-2 ring-brand-pink/40 ring-offset-2' : ''}`}
            >
              {done ? '✓' : i + 1}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  done ? 'text-brand-black' : 'text-brand-accent/40'
                }`}
              >
                {step.label}
              </p>
              {current && (
                <p className="text-xs text-brand-pink">Current status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
