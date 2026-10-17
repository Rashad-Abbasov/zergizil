import React, { useState } from 'react';
import { GoldRates } from '../types/jewelry';
import { X, Check, Calculator, AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface RatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRates: GoldRates;
  onSaveRates: (newRates: GoldRates) => void;
}

export const RatesModal: React.FC<RatesModalProps> = ({
  isOpen,
  onClose,
  currentRates,
  onSaveRates
}) => {
  const { currentTheme } = useTheme();

  const [spotUSD, setSpotUSD] = useState(currentRates.spotGoldUSDPerOz);
  const [usdAzn, setUsdAzn] = useState(currentRates.usdAznRate);
  
  // Custom manual or auto overrides
  const [rate585, setRate585] = useState(currentRates.gram585Azn);
  const [rate750, setRate750] = useState(currentRates.gram750Azn);
  const [rate999, setRate999] = useState(currentRates.gram999Azn);

  const [scrap585, setScrap585] = useState(currentRates.scrapBuy585Azn);
  const [scrap750, setScrap750] = useState(currentRates.scrapBuy750Azn);
  const [scrap999, setScrap999] = useState(currentRates.scrapBuy999Azn);

  if (!isOpen) return null;

  // Formula:
  // 1 Ounce = 31.1035 grams
  // Price of 1g pure 999.9 in USD = Spot / 31.1035
  // Price of 1g pure 999.9 in AZN = (Spot / 31.1035) * USD_AZN
  const handleRecalculateFromSpot = () => {
    const gramPureAzn = (spotUSD / 31.1035) * usdAzn;
    const g999 = Math.round(gramPureAzn * 100) / 100;
    const g750 = Math.round((gramPureAzn * 0.750) * 100) / 100;
    const g585 = Math.round((gramPureAzn * 0.585) * 100) / 100;

    setRate999(g999);
    setRate750(g750);
    setRate585(g585);

    // Default scrap is usually 5% - 8% below spot metal value for refining loss
    setScrap999(Math.round(g999 * 0.96 * 100) / 100);
    setScrap750(Math.round(g750 * 0.95 * 100) / 100);
    setScrap585(Math.round(g585 * 0.94 * 100) / 100);
  };

  const handleSave = () => {
    const now = new Date();
    const formattedDate = `${now.getDate()} Oktyabr ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} (Bakı Vaxtı)`;

    onSaveRates({
      spotGoldUSDPerOz: spotUSD,
      usdAznRate: usdAzn,
      gram999Azn: rate999,
      gram750Azn: rate750,
      gram585Azn: rate585,
      scrapBuy585Azn: scrap585,
      scrapBuy750Azn: scrap750,
      scrapBuy999Azn: scrap999,
      lastUpdated: formattedDate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className={`w-full max-w-xl rounded-2xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-6 shadow-2xl space-y-6 transition-all`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-4`}>
          <div>
            <h3 className={`font-brand text-lg font-bold ${currentTheme.palette.textPrimary}`}>
              Qızıl Birjası və Məzənnə Tənzimlənməsi
            </h3>
            <p className={`text-xs ${currentTheme.palette.textSecondary} mt-0.5`}>
              Son yenilənmə: {currentRates.lastUpdated}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 ${currentTheme.palette.textMuted} hover:${currentTheme.palette.cardHeader} hover:${currentTheme.palette.textPrimary} transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Market Spot Input */}
        <div className={`grid grid-cols-2 gap-4 rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-4`}>
          <div>
            <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
              Beynəlxalq ONS (USD/oz)
            </label>
            <div className="relative">
              <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono ${currentTheme.palette.textMuted}`}>$</span>
              <input
                type="number"
                step="0.10"
                value={spotUSD}
                onChange={(e) => setSpotUSD(parseFloat(e.target.value) || 0)}
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} pl-7 pr-3 py-2 text-sm font-mono-num font-semibold ${currentTheme.palette.accent} focus:outline-none`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
              USD / AZN Məzənnəsi
            </label>
            <div className="relative">
              <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono ${currentTheme.palette.textMuted}`}>₼</span>
              <input
                type="number"
                step="0.0001"
                value={usdAzn}
                onChange={(e) => setUsdAzn(parseFloat(e.target.value) || 0)}
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} pl-7 pr-3 py-2 text-sm font-mono-num font-semibold ${currentTheme.palette.textPrimary} focus:outline-none`}
              />
            </div>
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="button"
              onClick={handleRecalculateFromSpot}
              className={`flex items-center gap-1.5 rounded-lg border ${currentTheme.palette.accentBorder} ${currentTheme.palette.accentMutedBg} px-3 py-1.5 text-xs font-medium ${currentTheme.palette.accent} hover:opacity-90 transition-opacity`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>ONS üzrə Qram Qiymətlərini Avtomatik Hesabla</span>
            </button>
          </div>
        </div>

        {/* Metal Selling Base Rates */}
        <div className="space-y-3">
          <div className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.palette.textSecondary}`}>
            Satış üçün Standart Metal Qram Maya Dəyəri (AZN)
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>585 Əyar (14K)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.10"
                  value={rate585}
                  onChange={(e) => setRate585(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num font-semibold ${currentTheme.palette.textPrimary} focus:outline-none`}
                />
                <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.palette.textMuted} text-xs`}>₼/qr</span>
              </div>
            </div>

            <div>
              <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>750 Əyar (18K)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.10"
                  value={rate750}
                  onChange={(e) => setRate750(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num font-semibold ${currentTheme.palette.accent} focus:outline-none`}
                />
                <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.palette.textMuted} text-xs`}>₼/qr</span>
              </div>
            </div>

            <div>
              <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>999.9 (24K Xalis)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.10"
                  value={rate999}
                  onChange={(e) => setRate999(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num font-semibold ${currentTheme.palette.accent} focus:outline-none`}
                />
                <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.palette.textMuted} text-xs`}>₼/qr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrap Buyback (Lom) Rates */}
        <div className="space-y-3">
          <div className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.palette.textSecondary}`}>
            Köhnə Qızıl Alışı / Lom Qəbul Məzənnəsi (AZN/qr)
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>Lom 585 (14K)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.10"
                  value={scrap585}
                  onChange={(e) => setScrap585(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num font-semibold text-emerald-700 dark:text-emerald-400 focus:outline-none`}
                />
                <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.palette.textMuted} text-xs`}>₼/qr</span>
              </div>
            </div>

            <div>
              <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>Lom 750 (18K)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.10"
                  value={scrap750}
                  onChange={(e) => setScrap750(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num font-semibold text-emerald-700 dark:text-emerald-400 focus:outline-none`}
                />
                <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.palette.textMuted} text-xs`}>₼/qr</span>
              </div>
            </div>

            <div>
              <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>Lom 999 (24K)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.10"
                  value={scrap999}
                  onChange={(e) => setScrap999(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num font-semibold text-emerald-700 dark:text-emerald-400 focus:outline-none`}
                />
                <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.palette.textMuted} text-xs`}>₼/qr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className={`flex items-center justify-between border-t ${currentTheme.palette.cardBorder} pt-4`}>
          <div className={`flex items-center gap-2 text-xs ${currentTheme.palette.textSecondary}`}>
            <AlertCircle className={`h-4 w-4 ${currentTheme.palette.accent} shrink-0`} />
            <span>Məzənnə bütün vitrin və POS kassalarda dərhal tətbiq olunur.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`rounded-lg border ${currentTheme.palette.cardBorder} px-4 py-2 text-xs font-medium ${currentTheme.palette.textSecondary} hover:${currentTheme.palette.cardHeader} transition-colors`}
            >
              Ləğv et
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-4 py-2 text-xs font-semibold ${currentTheme.palette.buttonText} hover:opacity-95 transition-opacity shadow-sm`}
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>Yadda Saxla & Yenilə</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
