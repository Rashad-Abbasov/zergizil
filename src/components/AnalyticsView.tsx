import React from 'react';
import { JewelryItem, SaleTransaction, ScrapGoldEntry, GoldRates } from '../types/jewelry';
import { Scale, Coins, Receipt, Sparkles, Eye, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AnalyticsViewProps {
  sales: SaleTransaction[];
  items: JewelryItem[];
  scrapEntries: ScrapGoldEntry[];
  rates: GoldRates;
  onViewReceipt: (sale: SaleTransaction) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  sales,
  items,
  scrapEntries,
  rates,
  onViewReceipt
}) => {
  const { currentTheme } = useTheme();

  // Financial summaries
  const totalRevenue = sales.reduce((acc, s) => acc + s.netPayable, 0);
  const totalGrossSold = sales.reduce((acc, s) => acc + s.totalGrossWeight, 0);
  const totalPureSold = sales.reduce((acc, s) => acc + s.totalNetGoldWeight, 0);
  const totalBarterCredit = sales.reduce((acc, s) => acc + (s.oldGoldTradeIn?.totalCredit || 0), 0);

  // Current stock valuation
  const totalStockRetailValue = items.reduce((acc, it) => acc + it.retailPrice, 0);
  const totalStockNetGoldGrams = items.reduce((acc, it) => acc + it.netGoldWeight, 0);

  // Pure 999.9 equivalent calculation for entire inventory
  const pure999EquivalentStock = items.reduce((acc, it) => {
    const factor = it.purity === '585' ? 0.585 : it.purity === '750' ? 0.750 : it.purity === '916' ? 0.916 : 0.9999;
    return acc + (it.netGoldWeight * factor);
  }, 0);

  // Spot valuation of pure metal in stock
  const metalSpotStockValue = pure999EquivalentStock * rates.gram999Azn;

  // Breakdown by Purity in stock
  const purityDistribution = [
    { purity: '585 (14K)', items: items.filter(i => i.purity === '585') },
    { purity: '750 (18K)', items: items.filter(i => i.purity === '750') },
    { purity: '999.9 (24K)', items: items.filter(i => i.purity === '999.9') }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`border-b ${currentTheme.palette.cardBorder} pb-4`}>
        <h1 className={`font-brand text-2xl font-bold tracking-tight ${currentTheme.palette.textPrimary}`}>
          Maliyyə & Qızıl Balansı Analitikası
        </h1>
        <p className={`text-xs ${currentTheme.palette.textSecondary} mt-0.5`}>
          Qızıl qram qalığı, birja bazar qiymətləndirməsi, nağd dövriyyə və barter auditi
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales Revenue */}
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.palette.textSecondary}>Yekun Satış Gəliri</span>
            <Coins className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="font-mono-num text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalRevenue.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1 flex items-center gap-1`}>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{sales.length} qaimə</span>
            <span>satış qeydə alındı</span>
          </div>
        </div>

        {/* Pure Gold Sold */}
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.palette.textSecondary}>Satılmış Xalis Qızıl</span>
            <Scale className={`h-4 w-4 ${currentTheme.palette.accent}`} />
          </div>
          <div className={`font-mono-num text-2xl font-bold ${currentTheme.palette.accent}`}>
            {totalPureSold.toFixed(2)} <span className={`text-xs font-normal ${currentTheme.palette.textMuted}`}>qr</span>
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1`}>
            Ümumi brutto: {totalGrossSold.toFixed(2)} qr
          </div>
        </div>

        {/* Metal Valuation */}
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.palette.textSecondary}>Seyf və Vitrin (Xalis 999.9)</span>
            <Sparkles className={`h-4 w-4 ${currentTheme.palette.accent}`} />
          </div>
          <div className={`font-mono-num text-2xl font-bold ${currentTheme.palette.textPrimary}`}>
            {pure999EquivalentStock.toFixed(2)} <span className={`text-xs font-normal ${currentTheme.palette.textMuted}`}>qr</span>
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1 font-mono`}>
            Birja maya: {metalSpotStockValue.toLocaleString('az-AZ', { maximumFractionDigits: 0 })} ₼
          </div>
        </div>

        {/* Barter Credits Given */}
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.palette.textSecondary}>Köhnə Qızıl Barter Güzəşti</span>
            <TrendingUp className={`h-4 w-4 ${currentTheme.palette.accent}`} />
          </div>
          <div className={`font-mono-num text-2xl font-bold ${currentTheme.palette.accent}`}>
            {totalBarterCredit.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1`}>
            Müştərilərdən əvəzlənən lom dəyəri
          </div>
        </div>

      </div>

      {/* Stock Purity & Weight Balance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Gold Ledger by Hallmark */}
        <div className={`lg:col-span-7 rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-5 space-y-4 shadow-xs`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-sm ${currentTheme.palette.textPrimary}`}>
              Əyarlar üzrə Vitrin Qızıl Ehtiyatı və Çəki Bölgüsü
            </h3>
            <span className={`text-xs font-mono ${currentTheme.palette.textMuted}`}>Real-vaxt</span>
          </div>

          <div className="space-y-4">
            {purityDistribution.map((dist, idx) => {
              const count = dist.items.length;
              const gross = dist.items.reduce((a, b) => a + b.grossWeight, 0);
              const net = dist.items.reduce((a, b) => a + b.netGoldWeight, 0);
              const retailVal = dist.items.reduce((a, b) => a + b.retailPrice, 0);
              const percent = totalStockNetGoldGrams > 0 ? (net / totalStockNetGoldGrams) * 100 : 0;

              return (
                <div key={idx} className={`space-y-1.5 rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-3 text-xs`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${currentTheme.palette.accent} font-mono`}>{dist.purity}</span>
                    <span className={`font-mono ${currentTheme.palette.textSecondary}`}>{count} ədəd məhsul</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] py-1">
                    <div>
                      <span className={`${currentTheme.palette.textMuted} block`}>Ümumi Çəki:</span>
                      <span className={`font-bold ${currentTheme.palette.textPrimary}`}>{gross.toFixed(2)} qr</span>
                    </div>
                    <div>
                      <span className={`${currentTheme.palette.textMuted} block`}>Xalis Qızıl:</span>
                      <span className={`font-bold ${currentTheme.palette.accent}`}>{net.toFixed(2)} qr</span>
                    </div>
                    <div className="text-right">
                      <span className={`${currentTheme.palette.textMuted} block`}>Pərakəndə Dəyəri:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{retailVal.toLocaleString('az-AZ')} ₼</span>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`bg-gradient-to-r ${currentTheme.palette.gradient} h-full rounded-full transition-all`}
                      style={{ width: `${Math.min(100, Math.max(5, percent))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Metal vs Labor Margin Ratio */}
        <div className={`lg:col-span-5 rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-5 space-y-4 shadow-xs`}>
          <h3 className={`font-bold text-sm ${currentTheme.palette.textPrimary}`}>
            Zərgərlik Marjası və Struktur Analizi
          </h3>

          <div className="space-y-3 text-xs">
            <div className={`rounded-lg ${currentTheme.palette.cardHeader} p-3.5 space-y-2 border ${currentTheme.palette.cardBorder}`}>
              <div className={`flex justify-between ${currentTheme.palette.textSecondary}`}>
                <span>Cari Metal Dəyəri (Birja):</span>
                <span className={`font-mono ${currentTheme.palette.textPrimary}`}>{metalSpotStockValue.toLocaleString('az-AZ', { maximumFractionDigits: 0 })} ₼</span>
              </div>
              <div className={`flex justify-between ${currentTheme.palette.textSecondary}`}>
                <span>Pərakəndə Satış Dəyəri:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{totalStockRetailValue.toLocaleString('az-AZ')} ₼</span>
              </div>
              <div className={`flex justify-between border-t ${currentTheme.palette.cardBorder} pt-2 font-semibold`}>
                <span className={currentTheme.palette.accent}>Ticarət & Usta Marjası:</span>
                <span className={`font-mono ${currentTheme.palette.accent} font-bold`}>
                  +{(totalStockRetailValue - metalSpotStockValue).toLocaleString('az-AZ', { maximumFractionDigits: 0 })} ₼
                </span>
              </div>
            </div>

            <div className={`rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-3 space-y-1.5 text-[11px] ${currentTheme.palette.textSecondary}`}>
              <div className={`font-semibold ${currentTheme.palette.textPrimary}`}>Zərgərlik Maliyyə Qaydası:</div>
              <p>
                Qızılın birja qiyməti artdıqca vitrindəki məmulatların metal dəyəri avtomatik kapitallaşır. Usta işçiliyi və brilyant marjası xalis mənfəət payını təmin edir.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Sales Journal */}
      <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-5 space-y-4 shadow-xs`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-sm ${currentTheme.palette.textPrimary} flex items-center gap-2`}>
            <Receipt className={`h-4 w-4 ${currentTheme.palette.accent}`} />
            Son Satış Əməliyyatları və Zəmanət Qaimələri
          </h3>
          <span className={`text-xs ${currentTheme.palette.textMuted} font-mono`}>Son {sales.length} əməliyyat</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${currentTheme.palette.cardBorder} ${currentTheme.palette.tableHead} ${currentTheme.palette.textSecondary} font-semibold`}>
                <th className="py-2.5 px-3">Qaimə № & Tarix</th>
                <th className="py-2.5 px-3">Müştəri</th>
                <th className="py-2.5 px-3 text-right">Satılan Qızıl</th>
                <th className="py-2.5 px-3 text-right">Lom Barter</th>
                <th className="py-2.5 px-3 text-right">Ödənilən Məbləğ</th>
                <th className="py-2.5 px-3">Ödəniş Üsulu</th>
                <th className="py-2.5 px-3 text-right">Qaiməyə Bax</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${currentTheme.palette.cardBorder} font-sans`}>
              {sales.map((sale) => (
                <tr key={sale.id} className={`${currentTheme.palette.tableRowHover} transition-colors`}>
                  <td className={`py-2.5 px-3 font-mono font-medium ${currentTheme.palette.textPrimary}`}>
                    <div>{sale.invoiceNo}</div>
                    <div className={`text-[10px] ${currentTheme.palette.textMuted}`}>{sale.date}</div>
                  </td>
                  <td className={`py-2.5 px-3 ${currentTheme.palette.textPrimary}`}>
                    <div className="font-semibold">{sale.customerName}</div>
                    <div className={`text-[10px] ${currentTheme.palette.textMuted}`}>{sale.customerPhone}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className={currentTheme.palette.textPrimary}>{sale.totalGrossWeight.toFixed(2)} qr</span>
                    <div className={`text-[10px] ${currentTheme.palette.accent} font-bold`}>{sale.totalNetGoldWeight.toFixed(2)} qr xalis</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    {sale.oldGoldTradeIn ? (
                      <span className="text-amber-700 font-bold">
                        -{sale.oldGoldTradeIn.totalCredit.toFixed(2)} ₼
                      </span>
                    ) : (
                      <span className={currentTheme.palette.textMuted}>—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {sale.netPayable.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                  </td>
                  <td className={`py-2.5 px-3 ${currentTheme.palette.textSecondary}`}>
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded ${currentTheme.palette.cardHeader} border ${currentTheme.palette.cardBorder} font-medium`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onViewReceipt(sale)}
                      className={`inline-flex items-center gap-1 rounded border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} px-2.5 py-1 text-xs ${currentTheme.palette.textSecondary} hover:${currentTheme.palette.accent} shadow-2xs transition-colors`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Sertifikat</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
