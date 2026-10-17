import React from 'react';
import { JewelryItem } from '../types/jewelry';
import { X, Printer, Tag, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BarcodeTagModalProps {
  item: JewelryItem | null;
  onClose: () => void;
}

export const BarcodeTagModal: React.FC<BarcodeTagModalProps> = ({ item, onClose }) => {
  const { currentTheme } = useTheme();

  if (!item) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className={`w-full max-w-lg rounded-2xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-6 shadow-2xl space-y-6 transition-all`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-4`}>
          <div className="flex items-center gap-2">
            <Tag className={`h-5 w-5 ${currentTheme.palette.accent}`} />
            <h3 className={`font-brand text-base font-bold ${currentTheme.palette.textPrimary}`}>
              Zərgərlik Mikro-Etiketi (Birka Çapı)
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 ${currentTheme.palette.textMuted} hover:${currentTheme.palette.cardHeader} hover:${currentTheme.palette.textPrimary} transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Realistic Jewelry String Tag (Dual side preview) */}
        <div className="space-y-3">
          <div className={`text-xs ${currentTheme.palette.textSecondary}`}>
            Termal Zərgərlik Saplı Etiket Ölçüsü: <span className={`${currentTheme.palette.textPrimary} font-mono-num font-semibold`}>80mm × 12mm (İkiqat qatlanan)</span>
          </div>

          <div className={`rounded-xl border border-dashed ${currentTheme.palette.accentBorder} ${currentTheme.palette.cardHeader} p-6 flex flex-col items-center justify-center`}>
            
            {/* The Physical Jewelry Tag Preview */}
            <div className="w-full max-w-sm rounded-lg bg-white text-neutral-950 p-4 shadow-xl border border-neutral-200 text-[11px] font-sans">
              
              {/* String loop visual */}
              <div className="flex items-center justify-between border-b border-neutral-300 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-brand font-black text-xs tracking-wider text-amber-900">ZƏRQIZIL</span>
                  <span className="text-[9px] bg-neutral-100 px-1 py-0.2 rounded font-semibold text-neutral-700">BAKU</span>
                </div>
                <div className="font-mono text-[10px] font-bold text-neutral-800">
                  {item.sku}
                </div>
              </div>

              {/* Item Name */}
              <div className="font-semibold text-neutral-900 line-clamp-1 mb-2 text-xs">
                {item.name}
              </div>

              {/* Main Specs Grid */}
              <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-2 rounded border border-neutral-200 mb-2 font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 block">ƏYAR / CARAT</span>
                  <span className="font-bold text-xs text-amber-900">{item.purity} ({item.purity === '585' ? '14K' : item.purity === '750' ? '18K' : '24K'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">ÜMUMİ ÇƏKİ</span>
                  <span className="font-bold text-xs text-neutral-900">{item.grossWeight.toFixed(2)} qr</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">XALİS QIZIL</span>
                  <span className="font-bold text-xs text-neutral-900">{item.netGoldWeight.toFixed(2)} qr</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">DAŞ ÇƏKİSİ</span>
                  <span className="font-bold text-xs text-neutral-700">
                    {item.stoneWeight > 0 ? `${item.stoneWeight.toFixed(2)} qr` : 'Daşsız'}
                  </span>
                </div>
              </div>

              {/* Stone specs & Origin */}
              {item.stoneDetails.gemType !== 'Daşsız' && (
                <div className="text-[10px] text-neutral-600 mb-2">
                  <span className="font-bold text-neutral-800">Daş:</span> {item.stoneDetails.gemType} {item.stoneDetails.carat ? `(${item.stoneDetails.carat} ct)` : ''} · {item.stoneDetails.clarity || 'Təbii'} {item.stoneDetails.color || ''}
                </div>
              )}

              {/* Barcode & Price Row */}
              <div className="flex items-end justify-between border-t border-neutral-300 pt-2">
                <div>
                  {/* Simulated barcode bars */}
                  <div className="h-7 w-28 flex items-center justify-between bg-neutral-100 p-0.5 border border-neutral-200">
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-0.5 h-full bg-black"></div>
                    <div className="w-1.5 h-full bg-black"></div>
                    <div className="w-0.5 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-2 h-full bg-black"></div>
                    <div className="w-0.5 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                    <div className="w-1.5 h-full bg-black"></div>
                    <div className="w-0.5 h-full bg-black"></div>
                    <div className="w-1 h-full bg-black"></div>
                  </div>
                  <div className="font-mono text-[9px] text-neutral-600 mt-0.5">
                    {item.barcode}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-neutral-500 block">SATIŞ QİYMƏTİ</span>
                  <span className="font-mono text-sm font-black text-neutral-950">
                    {item.retailPrice.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-between border-t ${currentTheme.palette.cardBorder} pt-4`}>
          <div className={`flex items-center gap-2 text-xs ${currentTheme.palette.textSecondary}`}>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Zebra / TSC Zərgərlik Termal Çap formatına uyğundur.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`rounded-lg border ${currentTheme.palette.cardBorder} px-4 py-2 text-xs font-medium ${currentTheme.palette.textSecondary} hover:${currentTheme.palette.cardHeader} transition-colors`}
            >
              Bağla
            </button>
            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-4 py-2 text-xs font-semibold ${currentTheme.palette.buttonText} hover:opacity-95 transition-opacity shadow-sm`}
            >
              <Printer className="h-4 w-4 stroke-[2.5]" />
              <span>Etiketi Çap Et</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
