import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrencySettings, DisplayCurrency } from '@/types';

const DEFAULT_SETTINGS: CurrencySettings = {
  ngn_per_usd: '1450',
  ngn_per_gbp: '1920',
  ngn_per_cad: '1100',
  local_delivery_fee: '4000',
  international_delivery_fee: '50000',
  updated_at: '',
};

interface CurrencyState {
  displayCurrency: DisplayCurrency;
  settings: CurrencySettings;
  setDisplayCurrency: (currency: DisplayCurrency) => void;
  setSettings: (settings: CurrencySettings) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      displayCurrency: 'NGN',
      settings: DEFAULT_SETTINGS,
      setDisplayCurrency: (currency) => set({ displayCurrency: currency }),
      setSettings: (settings) => set({ settings }),
    }),
    {
      name: 'tasty-fingers-currency',
      partialize: (state) => ({ displayCurrency: state.displayCurrency }),
    },
  ),
);

export function convertNgnToCurrency(
  amountNgn: number,
  currency: DisplayCurrency,
  settings: CurrencySettings,
): number {
  if (currency === 'NGN' || !amountNgn) return amountNgn;
  const rates: Record<Exclude<DisplayCurrency, 'NGN'>, string> = {
    USD: settings.ngn_per_usd,
    GBP: settings.ngn_per_gbp,
    CAD: settings.ngn_per_cad,
  };
  const rate = parseFloat(rates[currency]);
  if (!rate || rate <= 0) return 0;
  return amountNgn / rate;
}

export function getCurrencySymbol(currency: DisplayCurrency): string {
  const symbols: Record<DisplayCurrency, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    CAD: 'C$',
  };
  return symbols[currency];
}

export function getCurrencyLabel(currency: DisplayCurrency): string {
  return currency;
}
