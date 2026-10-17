import React from 'react';
import { SaleTransaction } from '../types/jewelry';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ReceiptModalProps {
  sale: SaleTransaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  const { currentTheme } = useTheme();

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-6 shadow-2xl space-y-6 my-8 transition-all`}>
        
        {/* Top Modal Controls */}
        <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-4`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-5 w-5 ${currentTheme.palette.accent}`} />
            <h3 className={`font-brand text-base font-bold ${currentTheme.palette.textPrimary}`}>
              Rəsmi Satış Qaiməsi və Zərgərlik Sertifikatı
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 ${currentTheme.palette.textMuted} hover:${currentTheme.palette.cardHeader} hover:${currentTheme.palette.textPrimary} transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* The Printable Certificate & Invoice Document */}
        <div id="printable-receipt" className="rounded-xl bg-white text-neutral-900 p-8 shadow-sm border border-neutral-200 font-sans space-y-6">
          
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b-2 border-amber-600 pb-4">
            <div>
              <div className="font-brand text-2xl font-bold tracking-wider text-amber-950">
                ZƏRQIZIL
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-800">
                Zərgərlik Evi və Qızıl Qalereyası
              </div>
              <div className="text-xs text-neutral-600 mt-1">
                Filial: {sale.branchName}
              </div>
              <div className="text-xs text-neutral-500">
                VÖEN: 1400829101 · Tel: +994 12 498 77 66
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-semibold text-neutral-500 uppercase">Qaimə №</div>
              <div className="font-mono text-base font-bold text-neutral-900">{sale.invoiceNo}</div>
              <div className="text-xs text-neutral-600 mt-1">Tarix: {sale.date}</div>
              <div className="text-xs text-neutral-500">Kassir: {sale.cashierName}</div>
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs">
            <div>
              <span className="text-neutral-500 block">Alıcı (Müştəri):</span>
              <span className="font-bold text-neutral-900">{sale.customerName}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block">Əlaqə Telefonu:</span>
              <span className="font-mono font-semibold text-neutral-800">{sale.customerPhone}</span>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
              Satılan Qızıl Məmulatları və Əyarlar
            </div>
            <table className="w-full text-left text-xs border border-neutral-200">
              <thead>
                <tr className="bg-neutral-100 text-neutral-700 font-semibold border-b border-neutral-200">
                  <th className="py-2 px-3">Məhsul / SKU</th>
                  <th className="py-2 px-2 text-center">Əyar</th>
                  <th className="py-2 px-2 text-right">Ümumi Çəki</th>
                  <th className="py-2 px-2 text-right">Xalis Qızıl</th>
                  <th className="py-2 px-3 text-right">Məbləğ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {sale.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-neutral-900">{it.item.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        SKU: {it.item.sku} · {it.item.stoneDetails.gemType !== 'Daşsız' ? `${it.item.stoneDetails.gemType} (${it.item.stoneDetails.carat || ''}ct)` : 'Daşsız'}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-amber-900">
                      {it.item.purity}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono">
                      {it.item.grossWeight.toFixed(2)} qr
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-semibold text-neutral-900">
                      {it.item.netGoldWeight.toFixed(2)} qr
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900">
                      {it.finalPrice.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Old Gold Barter / Trade-in Deduction if present */}
          {sale.oldGoldTradeIn && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs space-y-1">
              <div className="font-bold text-amber-950 flex items-center justify-between">
                <span>Köhnə Qızıl Barteri / Qəbul Edilən Hurda (Çıxılan Məbləğ)</span>
                <span className="font-mono text-emerald-800 font-black">
                  - {sale.oldGoldTradeIn.totalCredit.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                </span>
              </div>
              <div className="text-amber-900 text-[11px] font-mono flex items-center justify-between">
                <span>
                  Əyar: {sale.oldGoldTradeIn.purity} · Ümumi: {sale.oldGoldTradeIn.grossWeight.toFixed(2)} qr · Xalis Lom: {sale.oldGoldTradeIn.netScrapWeight.toFixed(2)} qr
                </span>
                <span>(Qramı: {sale.oldGoldTradeIn.ratePerGram.toFixed(2)} ₼)</span>
              </div>
            </div>
          )}

          {/* Totals & Payments Summary */}
          <div className="flex justify-between items-start pt-2 border-t-2 border-neutral-200 text-xs">
            <div className="space-y-1 text-neutral-600">
              <div><strong>Ödəniş Üsulu:</strong> {sale.paymentMethod}</div>
              <div><strong>Cəmi Təhvil Verilən Çəki:</strong> {sale.totalGrossWeight.toFixed(2)} qram</div>
              <div><strong>Xalis Metal Çəkisi:</strong> {sale.totalNetGoldWeight.toFixed(2)} qram</div>
              <div className="text-[11px] text-neutral-500 pt-2 italic max-w-xs">
                Bu sənəd məhsulun qızıl əyarının orijinallığına 5 il müddətində zəmanət verir.
              </div>
            </div>

            <div className="space-y-1.5 text-right font-mono min-w-[200px]">
              <div className="flex justify-between text-neutral-600">
                <span>Məhsul Cəmi:</span>
                <span>{sale.subtotal.toFixed(2)} ₼</span>
              </div>
              {sale.discountTotal > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Güzəşt:</span>
                  <span>- {sale.discountTotal.toFixed(2)} ₼</span>
                </div>
              )}
              {sale.oldGoldTradeIn && (
                <div className="flex justify-between text-emerald-700">
                  <span>Köhnə Qızıl Barteri:</span>
                  <span>- {sale.oldGoldTradeIn.totalCredit.toFixed(2)} ₼</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-neutral-950 pt-2 border-t border-neutral-300">
                <span>Yekun Ödənilən:</span>
                <span className="text-amber-950">{sale.netPayable.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼</span>
              </div>
            </div>
          </div>

          {/* Signature and Seal Area */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-neutral-600">
            <div className="border-t border-neutral-400 pt-1">
              <span>M.Y. / Təhvil verdi (Satıcı imza): ___________________</span>
            </div>
            <div className="border-t border-neutral-400 pt-1 text-right">
              <span>Təhvil aldı (Müştəri imza): ___________________</span>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className={`flex items-center justify-between border-t ${currentTheme.palette.cardBorder} pt-4`}>
          <div className={`flex items-center gap-2 text-xs ${currentTheme.palette.textSecondary}`}>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Maliyyə hesabatına və kassa jurnalına avtomatik qeyd olundu.</span>
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
              <span>Qaiməni Çap Et</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
