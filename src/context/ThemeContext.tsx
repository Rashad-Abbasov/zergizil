import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 
  | 'luxury-light' 
  | 'warm-cream' 
  | 'pure-pearl' 
  | 'rose-gold-light' 
  | 'emerald-light' 
  | 'soft-graphite';

export interface ColorTheme {
  id: ThemeId;
  name: string;
  subtitle: string;
  mode: 'light' | 'dark';
  palette: {
    primary: string;
    secondary: string;
    bg: string;              // overall page background
    card: string;            // container & card surface
    cardHeader: string;      // card header or table head
    cardBorder: string;      // divider & card border
    textPrimary: string;     // main headings & titles
    textSecondary: string;   // body text & descriptions
    textMuted: string;       // small indicators & footnotes
    inputBg: string;         // form input background
    inputBorder: string;     // form input border
    tableHead: string;       // table header surface
    tableRowHover: string;   // table row hover state
    accent: string;          // vibrant accent text
    accentLight: string;     // secondary accent text
    accentDark: string;      // contrasting accent text
    accentMutedBg: string;   // pill & badge background
    accentBorder: string;    // badge border
    gradient: string;        // button & banner gradient
    buttonText: string;      // button text color
    swatch: string[];        // 3 preview colors
  };
}

export const THEMES: Record<ThemeId, ColorTheme> = {
  'luxury-light': {
    id: 'luxury-light',
    name: 'İşıqlı Butik (Klassik Qızıl)',
    subtitle: 'Aydın mirvari fon, təmiz ağ vitrinlər və parıldayan zərgərlik qızılı',
    mode: 'light',
    palette: {
      primary: '#D97706',
      secondary: '#B45309',
      bg: 'bg-[#F9FAF6]',
      card: 'bg-white',
      cardHeader: 'bg-[#F4F3EE]',
      cardBorder: 'border-[#E5E3D8]',
      textPrimary: 'text-neutral-900',
      textSecondary: 'text-neutral-600',
      textMuted: 'text-neutral-400',
      inputBg: 'bg-white',
      inputBorder: 'border-neutral-300',
      tableHead: 'bg-[#F6F5F0]',
      tableRowHover: 'hover:bg-amber-50/50',
      accent: 'text-amber-700',
      accentLight: 'text-amber-800',
      accentDark: 'text-white',
      accentMutedBg: 'bg-amber-500/10',
      accentBorder: 'border-amber-300',
      gradient: 'from-amber-600 via-amber-600 to-amber-700',
      buttonText: 'text-white font-bold',
      swatch: ['#F9FAF6', '#D97706', '#FFFFFF']
    }
  },
  'warm-cream': {
    id: 'warm-cream',
    name: 'İsti Krem & Travertin',
    subtitle: 'İtalyan zərgərlik salonları üçün isti krem və bal qızılı çalarları',
    mode: 'light',
    palette: {
      primary: '#B45309',
      secondary: '#92400E',
      bg: 'bg-[#FAF6F0]',
      card: 'bg-white',
      cardHeader: 'bg-[#F4EFE6]',
      cardBorder: 'border-[#E6DDD0]',
      textPrimary: 'text-[#2C2724]',
      textSecondary: 'text-[#5C5651]',
      textMuted: 'text-[#A39C94]',
      inputBg: 'bg-white',
      inputBorder: 'border-[#D9CFBF]',
      tableHead: 'bg-[#F5EFE6]',
      tableRowHover: 'hover:bg-[#F7F2EA]',
      accent: 'text-amber-800',
      accentLight: 'text-amber-900',
      accentDark: 'text-white',
      accentMutedBg: 'bg-amber-100/70',
      accentBorder: 'border-amber-300',
      gradient: 'from-amber-600 via-amber-700 to-yellow-800',
      buttonText: 'text-white font-bold',
      swatch: ['#FAF6F0', '#B45309', '#FFFFFF']
    }
  },
  'pure-pearl': {
    id: 'pure-pearl',
    name: 'Ağ Mirvari & Platin',
    subtitle: 'Ultra-təmiz işıqlı fon, brilyant parıltısı və zərif göy-platin tonları',
    mode: 'light',
    palette: {
      primary: '#0284C7',
      secondary: '#0369A1',
      bg: 'bg-[#F8FAFC]',
      card: 'bg-white',
      cardHeader: 'bg-slate-50',
      cardBorder: 'border-slate-200',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      inputBg: 'bg-white',
      inputBorder: 'border-slate-300',
      tableHead: 'bg-slate-100/80',
      tableRowHover: 'hover:bg-sky-50/50',
      accent: 'text-sky-700',
      accentLight: 'text-sky-800',
      accentDark: 'text-white',
      accentMutedBg: 'bg-sky-500/10',
      accentBorder: 'border-sky-300',
      gradient: 'from-sky-600 via-sky-600 to-cyan-700',
      buttonText: 'text-white font-bold',
      swatch: ['#F8FAFC', '#0284C7', '#FFFFFF']
    }
  },
  'rose-gold-light': {
    id: 'rose-gold-light',
    name: 'Rozovı Qızıl & Pudra',
    subtitle: 'Zərif çəhrayı qızıl, mirvari parıltısı və isti tunc zərifliyi',
    mode: 'light',
    palette: {
      primary: '#E11D48',
      secondary: '#BE123C',
      bg: 'bg-[#FFF8F8]',
      card: 'bg-white',
      cardHeader: 'bg-[#FFF0F2]',
      cardBorder: 'border-rose-200/80',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-600',
      textMuted: 'text-stone-400',
      inputBg: 'bg-white',
      inputBorder: 'border-rose-200',
      tableHead: 'bg-[#FFF0F2]',
      tableRowHover: 'hover:bg-rose-50/60',
      accent: 'text-rose-700',
      accentLight: 'text-rose-800',
      accentDark: 'text-white',
      accentMutedBg: 'bg-rose-500/10',
      accentBorder: 'border-rose-300',
      gradient: 'from-rose-500 via-rose-600 to-pink-700',
      buttonText: 'text-white font-bold',
      swatch: ['#FFF8F8', '#E11D48', '#FFFFFF']
    }
  },
  'emerald-light': {
    id: 'emerald-light',
    name: 'Zümrüd & Şahzadə Yaşılı',
    subtitle: 'Zərif nanə fonunda təmiz Kolumbiya zümrüdü və zərgərlik qızılı',
    mode: 'light',
    palette: {
      primary: '#059669',
      secondary: '#047857',
      bg: 'bg-[#F2FBF6]',
      card: 'bg-white',
      cardHeader: 'bg-[#E7F7EE]',
      cardBorder: 'border-emerald-200/80',
      textPrimary: 'text-zinc-900',
      textSecondary: 'text-zinc-600',
      textMuted: 'text-zinc-400',
      inputBg: 'bg-white',
      inputBorder: 'border-emerald-200',
      tableHead: 'bg-[#E7F7EE]',
      tableRowHover: 'hover:bg-emerald-50/60',
      accent: 'text-emerald-700',
      accentLight: 'text-emerald-800',
      accentDark: 'text-white',
      accentMutedBg: 'bg-emerald-500/10',
      accentBorder: 'border-emerald-300',
      gradient: 'from-emerald-600 via-emerald-600 to-teal-700',
      buttonText: 'text-white font-bold',
      swatch: ['#F2FBF6', '#059669', '#FFFFFF']
    }
  },
  'soft-graphite': {
    id: 'soft-graphite',
    name: 'Yumşaq Qrafit (Axşam Rejimi)',
    subtitle: 'Gözü yormayan yumşaq tünd qrafit fon və parlaq qızıl vurğuları',
    mode: 'dark',
    palette: {
      primary: '#F59E0B',
      secondary: '#D97706',
      bg: 'bg-[#1E1E24]',
      card: 'bg-[#282830]',
      cardHeader: 'bg-[#212128]',
      cardBorder: 'border-[#383844]',
      textPrimary: 'text-neutral-100',
      textSecondary: 'text-neutral-300',
      textMuted: 'text-neutral-400',
      inputBg: 'bg-[#1E1E24]',
      inputBorder: 'border-[#444452]',
      tableHead: 'bg-[#212128]',
      tableRowHover: 'hover:bg-[#32323C]',
      accent: 'text-amber-400',
      accentLight: 'text-amber-300',
      accentDark: 'text-neutral-950',
      accentMutedBg: 'bg-amber-500/15',
      accentBorder: 'border-amber-500/40',
      gradient: 'from-amber-500 via-amber-600 to-amber-700',
      buttonText: 'text-neutral-950 font-bold',
      swatch: ['#1E1E24', '#F59E0B', '#282830']
    }
  }
};

interface ThemeContextType {
  currentTheme: ColorTheme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  availableThemes: ColorTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('zq_theme');
      // If the saved theme was dark or classic-dark, prefer the bright light theme!
      if (saved && saved in THEMES && saved !== 'soft-graphite' && saved !== 'classic-dark') {
        return saved as ThemeId;
      }
    } catch (e) {
      // ignore
    }
    // Default to bright, luminous luxury showroom theme
    return 'luxury-light';
  });

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    try {
      localStorage.setItem('zq_theme', id);
    } catch (e) {
      // ignore
    }
  };

  const currentTheme = THEMES[themeId] || THEMES['luxury-light'];

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId,
        setThemeId,
        availableThemes: Object.values(THEMES)
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
