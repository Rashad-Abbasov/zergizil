import React from 'react';
import { GoldRates } from '../types/jewelry';
import { Sliders, Store, Plus, ShoppingBag, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  rates: GoldRates;
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
  onOpenRatesModal: () => void;
  onOpenNewItemModal: () => void;
  onOpenPos: () => void;
  onOpenThemeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  rates,
  selectedBranch,
  onBranchChange,
  onOpenRatesModal,
  onOpenNewItemModal,
  onOpenPos,
  onOpenThemeModal
}) => {
  const { currentTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-30 border-b ${currentTheme.palette.cardBorder} ${currentTheme.palette.card}/95 backdrop-blur-md shadow-xs transition-colors duration-200`}>
      {/* Top Main Bar: Strict 3-zone contract */}
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-8 px-6">
        
        {/* Zone 1: Single text element wordmark in luxury display font */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${currentTheme.palette.gradient} text-white shadow-sm font-bold`}
          >
            <span className="font-brand text-xl">Z</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-brand text-lg font-bold tracking-wider ${currentTheme.palette.textPrimary} whitespace-nowrap shrink-0`}>
              ZƏRQIZIL <span className={`${currentTheme.palette.accent} font-sans text-xs tracking-normal font-bold ml-1`}>ERP</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation & Live Market Rates Strip */}
        <div className={`hidden lg:flex items-center gap-6 overflow-x-auto text-xs ${currentTheme.palette.textSecondary}`}>
          {/* Live Spot ONS */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className={`${currentTheme.palette.textMuted} font-medium`}>ONS:</span>
            <span className={`font-mono-num font-bold ${currentTheme.palette.accent}`}>${rates.spotGoldUSDPerOz.toFixed(2)}</span>
          </div>

          <span className={currentTheme.palette.textMuted} aria-hidden="true">·</span>

          {/* 585 Carat 1g */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className={`${currentTheme.palette.textMuted} font-medium`}>585 (14K):</span>
            <span className={`font-mono-num font-semibold ${currentTheme.palette.textPrimary}`}>{rates.gram585Azn.toFixed(2)} ₼/qr</span>
          </div>

          <span className={currentTheme.palette.textMuted} aria-hidden="true">·</span>

          {/* 750 Carat 1g */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className={`${currentTheme.palette.textMuted} font-medium`}>750 (18K):</span>
            <span className={`font-mono-num font-bold ${currentTheme.palette.accentLight}`}>{rates.gram750Azn.toFixed(2)} ₼/qr</span>
          </div>

          <span className={currentTheme.palette.textMuted} aria-hidden="true">·</span>

          {/* 999 Carat 1g */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className={`${currentTheme.palette.textMuted} font-medium`}>999.9 (Xalis):</span>
            <span className={`font-mono-num font-bold ${currentTheme.palette.accent}`}>{rates.gram999Azn.toFixed(2)} ₼/qr</span>
          </div>

          <span className={currentTheme.palette.textMuted} aria-hidden="true">·</span>

          {/* Scrap buy 585 */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className={`${currentTheme.palette.textMuted} font-medium`}>Lom 585:</span>
            <span className="font-mono-num font-semibold text-emerald-600 dark:text-emerald-400">{rates.scrapBuy585Azn.toFixed(2)} ₼</span>
          </div>

          {/* Rates Config Button */}
          <button
            onClick={onOpenRatesModal}
            title="Birja məzənnələrini tənzimlə"
            className={`flex items-center gap-1.5 rounded-md border ${currentTheme.palette.cardBorder} ${currentTheme.palette.inputBg} px-2.5 py-1 ${currentTheme.palette.textSecondary} hover:${currentTheme.palette.textPrimary} hover:${currentTheme.palette.accentBorder} transition-colors shrink-0`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Məzənnə</span>
          </button>
        </div>

        {/* Zone 3: Branch switcher, Theme picker, and primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Branch Selector */}
          <div className="relative hidden xl:block">
            <select
              value={selectedBranch}
              onChange={(e) => onBranchChange(e.target.value)}
              className={`appearance-none rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} py-1.5 pl-8 pr-8 text-xs font-medium ${currentTheme.palette.textPrimary} shadow-xs hover:${currentTheme.palette.accentBorder} focus:outline-none cursor-pointer`}
            >
              <option value="all">Bütün Filiallar (Şəbəkə)</option>
              <option value="b1">Nizami Butik #104 (Mərkəz)</option>
              <option value="b2">Gənclik Mall Zərgərlik Qalereyası</option>
              <option value="b3">Mərkəzi Emalatxana & Seyf</option>
            </select>
            <Store className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${currentTheme.palette.accent}`} />
          </div>

          {/* Theme Palette Switcher Button */}
          <button
            onClick={onOpenThemeModal}
            title="Rəng çalarlarını dəyişdir"
            className={`flex items-center gap-2 rounded-lg border ${currentTheme.palette.accentBorder} ${currentTheme.palette.accentMutedBg} px-3 py-1.5 text-xs font-semibold ${currentTheme.palette.accent} hover:opacity-90 shadow-xs transition-all`}
          >
            <div className="flex items-center -space-x-1">
              {currentTheme.palette.swatch.slice(0, 2).map((col, idx) => (
                <div
                  key={idx}
                  className="h-3.5 w-3.5 rounded-full border border-neutral-300 shadow-2xs"
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
            <span className="hidden sm:inline">{currentTheme.name}</span>
            <Palette className="h-3.5 w-3.5" />
          </button>

          {/* Fast POS Button */}
          <button
            onClick={onOpenPos}
            className={`flex items-center gap-2 rounded-lg border ${currentTheme.palette.accentBorder} ${currentTheme.palette.accentMutedBg} px-3.5 py-2 text-xs font-semibold ${currentTheme.palette.accent} hover:opacity-90 shadow-xs transition-colors whitespace-nowrap shrink-0`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>POS Kassa</span>
          </button>

          {/* Primary Action: New Item */}
          <button
            onClick={onOpenNewItemModal}
            className={`flex items-center gap-2 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-4 py-2 text-xs font-semibold ${currentTheme.palette.buttonText} shadow-sm hover:opacity-95 transition-all whitespace-nowrap shrink-0`}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Yeni Qızıl</span>
          </button>
        </div>

      </div>
    </header>
  );
};
