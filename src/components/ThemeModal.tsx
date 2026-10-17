import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Check, Palette, Sparkles, Sun, Moon } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, themeId, setThemeId, availableThemes } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className={`w-full max-w-2xl rounded-2xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-6 shadow-2xl space-y-6 transition-all`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-4`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${currentTheme.palette.accentMutedBg} ${currentTheme.palette.accent}`}>
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className={`font-brand text-lg font-bold ${currentTheme.palette.textPrimary}`}>
                ERP Rəng Çalarları və Fon İşıqlığı
              </h3>
              <p className={`text-xs ${currentTheme.palette.textSecondary} mt-0.5`}>
                Gözoxşayan butik işıqlandırması və zövqünüzə uyğun qiymətli metal çalarları
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 ${currentTheme.palette.textMuted} hover:${currentTheme.palette.textPrimary} hover:${currentTheme.palette.cardHeader} transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {availableThemes.map((thm) => {
            const isSelected = themeId === thm.id;
            return (
              <div
                key={thm.id}
                onClick={() => setThemeId(thm.id)}
                className={`group cursor-pointer rounded-xl border p-4 transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? `border-2 bg-white ${thm.palette.accentBorder} shadow-md ring-2 ring-amber-500/20`
                    : `border-neutral-200 bg-neutral-50/70 hover:bg-white hover:border-neutral-300 shadow-2xs`
                }`}
              >
                <div>
                  {/* Top Swatch & Mode Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      {thm.palette.swatch.map((color, i) => (
                        <div
                          key={i}
                          className="h-5 w-5 rounded-full border border-neutral-300/80 shadow-2xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {thm.mode === 'light' ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded font-semibold border border-amber-300/80">
                          <Sun className="h-3 w-3 text-amber-600" />
                          <span>Aydın Fon</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded font-medium border border-neutral-300">
                          <Moon className="h-3 w-3 text-neutral-600" />
                          <span>Axşam</span>
                        </span>
                      )}

                      {isSelected && (
                        <div className={`h-5 w-5 rounded-full bg-gradient-to-r ${thm.palette.gradient} flex items-center justify-center text-white shadow-xs`}>
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className={`font-brand font-bold text-sm ${currentTheme.palette.textPrimary} group-hover:${thm.palette.accent} transition-colors`}>
                    {thm.name}
                  </div>
                  <p className={`text-xs ${currentTheme.palette.textSecondary} mt-1 line-clamp-2`}>
                    {thm.subtitle}
                  </p>
                </div>

                {/* Simulated UI Snippet Preview */}
                <div className={`mt-3 pt-2.5 border-t ${currentTheme.palette.cardBorder} flex items-center justify-between text-[11px] font-mono`}>
                  <span className={currentTheme.palette.textMuted}>Açar çalar:</span>
                  <span
                    className="font-bold px-2 py-0.5 rounded text-[10px]"
                    style={{
                      color: thm.palette.primary,
                      backgroundColor: `${thm.palette.primary}15`,
                      border: `1px solid ${thm.palette.primary}35`
                    }}
                  >
                    {thm.palette.primary}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between border-t ${currentTheme.palette.cardBorder} pt-4 text-xs ${currentTheme.palette.textSecondary}`}>
          <div className="flex items-center gap-1.5">
            <Sparkles className={`h-4 w-4 ${currentTheme.palette.accent}`} />
            <span>Seçilən rəng çaları dərhal yadda saxlanılır və vitrinləri aydınlaşdırır.</span>
          </div>

          <button
            onClick={onClose}
            className={`rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-5 py-2 text-xs font-bold ${currentTheme.palette.buttonText} hover:opacity-95 transition-all shadow-sm`}
          >
            Təsdiq Et
          </button>
        </div>

      </div>
    </div>
  );
};
