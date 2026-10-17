import React, { useState } from 'react';
import { ScrapGoldEntry, GoldRates, GoldPurity } from '../types/jewelry';
import { Plus, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ScrapGoldViewProps {
  entries: ScrapGoldEntry[];
  rates: GoldRates;
  onAddEntry: (entry: ScrapGoldEntry) => void;
}

export const ScrapGoldView: React.FC<ScrapGoldViewProps> = ({
  entries,
  rates,
  onAddEntry
}) => {
  const { currentTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurity, setSelectedPurity] = useState<string>('all');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerFin, setCustomerFin] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [purity, setPurity] = useState<GoldPurity>('585');
  const [grossWeight, setGrossWeight] = useState<number>(15.00);
  const [tolerancePercent, setTolerancePercent] = useState<number>(1.5);
  const [testMethod, setTestMethod] = useState<'X-Ray Spektrometr' | 'Turşu & Daş Sınağı' | 'Sıxlıq / Arximed'>('X-Ray Spektrometr');

  // Calculations
  const currentRate = purity === '585' 
    ? rates.scrapBuy585Azn 
    : purity === '750' 
    ? rates.scrapBuy750Azn 
    : rates.scrapBuy999Azn;

  const netPureWeight = grossWeight * (1 - tolerancePercent / 100);
  const totalPayout = Math.round(netPureWeight * currentRate * 100) / 100;

  const filteredEntries = entries.filter(e => {
    if (selectedPurity !== 'all' && e.purity !== selectedPurity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.entryNo.toLowerCase().includes(q) ||
        e.customerName.toLowerCase().includes(q) ||
        e.customerFin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Aggregates
  const totalScrapGrams = filteredEntries.reduce((acc, e) => acc + e.grossWeight, 0);
  const totalPaidOutAZN = filteredEntries.reduce((acc, e) => acc + e.totalPaidAZN, 0);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerFin.trim()) return;

    const newEntry: ScrapGoldEntry = {
      id: `scrap-${Date.now()}`,
      entryNo: `LOM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName,
      customerFin: customerFin.toUpperCase(),
      customerPhone: customerPhone || '+994 50 000 00 00',
      purity,
      grossWeight,
      tolerancePercent,
      netPureWeight: Math.round(netPureWeight * 100) / 100,
      ratePerGram: currentRate,
      totalPaidAZN: totalPayout,
      testMethod,
      status: 'Kassa Seyfində',
      operator: 'Rauf Əliyev'
    };

    onAddEntry(newEntry);
    setShowModal(false);
    setCustomerName('');
    setCustomerFin('');
    setCustomerPhone('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${currentTheme.palette.cardBorder} pb-4`}>
        <div>
          <h1 className={`font-brand text-2xl font-bold tracking-tight ${currentTheme.palette.textPrimary}`}>
            Köhnə Qızıl Qəbulu & Əritmə Jurnalı (Lom)
          </h1>
          <p className={`text-xs ${currentTheme.palette.textSecondary} mt-0.5`}>
            Müştərilərdən hurda/qırıq qızıl alışı, sınaq protokolları və emalatxanaya əritmə partiyaları
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-4 py-2 text-xs font-semibold ${currentTheme.palette.buttonText} hover:opacity-95 transition-all shadow-sm whitespace-nowrap shrink-0`}
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Yeni Köhnə Qızıl Qəbulu</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className={`text-xs ${currentTheme.palette.textSecondary} mb-1`}>Cəmi Alınmış Lom Qızıl</div>
          <div className={`font-mono-num text-2xl font-bold ${currentTheme.palette.accent}`}>
            {totalScrapGrams.toFixed(2)} <span className={`text-xs font-normal ${currentTheme.palette.textMuted}`}>qram</span>
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1`}>Cari dövr üzrə kassa seyfində</div>
        </div>

        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className={`text-xs ${currentTheme.palette.textSecondary} mb-1`}>Cəmi Ödənilən Vəsait</div>
          <div className="font-mono-num text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalPaidOutAZN.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} <span className={`text-xs font-normal ${currentTheme.palette.textMuted}`}>₼</span>
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1`}>Müştərilərə nağd/köçürmə verilib</div>
        </div>

        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className={`text-xs ${currentTheme.palette.textSecondary} mb-1`}>Cari Lom Alış Qiymətləri</div>
          <div className={`font-mono-num text-xs font-bold ${currentTheme.palette.textPrimary} space-y-0.5 mt-1`}>
            <div>585 (14K): <span className="text-emerald-600 dark:text-emerald-400">{rates.scrapBuy585Azn.toFixed(2)} ₼/qr</span></div>
            <div>750 (18K): <span className="text-emerald-600 dark:text-emerald-400">{rates.scrapBuy750Azn.toFixed(2)} ₼/qr</span></div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs`}>
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${currentTheme.palette.textMuted}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Akt nömrəsi (LOM-...), müştəri adı və ya FİN kod axtar..."
            className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} pl-9 pr-3 py-1.5 text-xs ${currentTheme.palette.textPrimary} placeholder:${currentTheme.palette.textMuted} focus:outline-none`}
          />
        </div>

        <div className={`flex items-center gap-1 rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-1`}>
          {['all', '585', '750', '999.9'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPurity(p)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedPurity === p
                  ? `bg-gradient-to-r ${currentTheme.palette.gradient} ${currentTheme.palette.buttonText} shadow-2xs`
                  : `${currentTheme.palette.textSecondary} hover:${currentTheme.palette.textPrimary}`
              }`}
            >
              {p === 'all' ? 'Bütün Əyarlar' : `${p} Əyar`}
            </button>
          ))}
        </div>
      </div>

      {/* Scrap Table */}
      <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} overflow-hidden shadow-xs`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${currentTheme.palette.cardBorder} ${currentTheme.palette.tableHead} ${currentTheme.palette.textSecondary} font-semibold`}>
                <th className="py-3 px-4">Akt № & Tarix</th>
                <th className="py-3 px-3">Müştəri & FİN</th>
                <th className="py-3 px-3 text-center">Əyar</th>
                <th className="py-3 px-3 text-right">Brutto Çəki</th>
                <th className="py-3 px-3 text-right">Zibil/İtki %</th>
                <th className="py-3 px-3 text-right">Xalis Çəki</th>
                <th className="py-3 px-3 text-right">Alış Qiyməti</th>
                <th className="py-3 px-3 text-right">Ödənilən Məbləğ</th>
                <th className="py-3 px-3">Sınaq Metodu</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${currentTheme.palette.cardBorder}`}>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className={`${currentTheme.palette.tableRowHover} transition-colors`}>
                  <td className="py-3 px-4">
                    <div className={`font-mono font-bold ${currentTheme.palette.textPrimary}`}>{entry.entryNo}</div>
                    <div className={`text-[11px] ${currentTheme.palette.textMuted}`}>{entry.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className={`font-semibold ${currentTheme.palette.textPrimary}`}>{entry.customerName}</div>
                    <div className={`font-mono text-[10px] ${currentTheme.palette.textMuted}`}>FİN: {entry.customerFin}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-mono font-bold ${currentTheme.palette.accent}`}>{entry.purity}</span>
                  </td>
                  <td className={`py-3 px-3 text-right font-mono ${currentTheme.palette.textPrimary}`}>
                    {entry.grossWeight.toFixed(2)} qr
                  </td>
                  <td className={`py-3 px-3 text-right font-mono ${currentTheme.palette.textSecondary}`}>
                    %{entry.tolerancePercent.toFixed(1)}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono font-semibold ${currentTheme.palette.accent}`}>
                    {entry.netPureWeight.toFixed(2)} qr
                  </td>
                  <td className={`py-3 px-3 text-right font-mono ${currentTheme.palette.textSecondary}`}>
                    {entry.ratePerGram.toFixed(2)} ₼/qr
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {entry.totalPaidAZN.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                  </td>
                  <td className={`py-3 px-3 ${currentTheme.palette.textSecondary} text-[11px]`}>
                    {entry.testMethod}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[11px] px-2 py-0.5 rounded ${currentTheme.palette.cardHeader} ${currentTheme.palette.textPrimary} border ${currentTheme.palette.cardBorder}`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Scrap Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className={`w-full max-w-lg rounded-2xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-6 shadow-2xl space-y-6`}>
            <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-4`}>
              <h3 className={`font-brand text-base font-bold ${currentTheme.palette.textPrimary}`}>
                Köhnə Qızıl Alışı (Lom Aktı)
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={`${currentTheme.palette.textMuted} hover:${currentTheme.palette.textPrimary}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Müştərinin Tam Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Məmməd Əliyev"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Ş/V FİN Kodu *</label>
                  <input
                    type="text"
                    required
                    maxLength={7}
                    placeholder="5XZ9L21"
                    value={customerFin}
                    onChange={(e) => setCustomerFin(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.textPrimary} uppercase`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Əyar</label>
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value as GoldPurity)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.accent} font-bold`}
                  >
                    <option value="585">585 (14K)</option>
                    <option value="750">750 (18K)</option>
                    <option value="999.9">999 (24K)</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Brutto Çəki (qr)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.textPrimary}`}
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>İtki / Zibil %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tolerancePercent}
                    onChange={(e) => setTolerancePercent(parseFloat(e.target.value) || 0)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.textPrimary}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs ${currentTheme.palette.textSecondary} mb-1`}>Sınaq Cihazı / Metod</label>
                <select
                  value={testMethod}
                  onChange={(e) => setTestMethod(e.target.value as any)}
                  className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 text-xs ${currentTheme.palette.textPrimary}`}
                >
                  <option value="X-Ray Spektrometr">X-Ray Spektrometr (Dəqiq XRF analiz)</option>
                  <option value="Turşu & Daş Sınağı">Lidiya Daşı və Turşu Reaksiyası</option>
                  <option value="Sıxlıq / Arximed">Hidrostatik Tərəzi (Sıxlıq testi)</option>
                </select>
              </div>

              {/* Calculated Summary Box */}
              <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-3.5 space-y-1.5 text-xs font-mono`}>
                <div className={`flex justify-between ${currentTheme.palette.textSecondary}`}>
                  <span>Tətbiq edilən Lom Məzənnəsi:</span>
                  <span className={`font-bold ${currentTheme.palette.textPrimary}`}>{currentRate.toFixed(2)} ₼/qr</span>
                </div>
                <div className={`flex justify-between ${currentTheme.palette.textSecondary}`}>
                  <span>Hesablanan Xalis Qızıl:</span>
                  <span className={`font-bold ${currentTheme.palette.accent}`}>{netPureWeight.toFixed(2)} qr</span>
                </div>
                <div className={`flex justify-between items-center border-t ${currentTheme.palette.cardBorder} pt-2 text-sm`}>
                  <span className={`font-sans font-bold ${currentTheme.palette.textPrimary}`}>Müştəriyə Ödəniləcək:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
                    {totalPayout.toFixed(2)} ₼
                  </span>
                </div>
              </div>

              <div className={`flex items-center justify-end gap-2 pt-2 border-t ${currentTheme.palette.cardBorder}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`rounded-lg border ${currentTheme.palette.cardBorder} px-4 py-2 text-xs font-medium ${currentTheme.palette.textSecondary}`}
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className={`rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-4 py-2 text-xs font-bold ${currentTheme.palette.buttonText} hover:opacity-95 shadow-sm`}
                >
                  Aktı Təsdiqlə & Seyfə Al
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
