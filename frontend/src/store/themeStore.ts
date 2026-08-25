import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'tasty-fingers-theme';
const LEGACY_THEME_KEY = 'jbluxe-theme';

export function readPersistedTheme(): Theme {
  try {
    let raw = localStorage.getItem(THEME_KEY);
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_THEME_KEY);
      if (legacy) {
        localStorage.setItem(THEME_KEY, legacy);
        localStorage.removeItem(LEGACY_THEME_KEY);
        raw = legacy;
      }
    }
    if (!raw) return 'light';
    if (raw === 'dark' || raw === 'light') return raw;
    const parsed = JSON.parse(raw) as { state?: { theme?: Theme } };
    return parsed?.state?.theme === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#1A1208' : '#ED7D2B');
  }
}

export function initTheme() {
  const theme = readPersistedTheme();
  applyTheme(theme);
  return theme;
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: THEME_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);
