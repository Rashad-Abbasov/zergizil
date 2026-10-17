import React, { useState } from 'react';
import { Customer, GoldPurity } from '../types/jewelry';
import { Plus, Calendar, Phone, Mail, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CrmViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
}

export const CrmView: React.FC<CrmViewProps> = ({ customers, onAddCustomer }) => {
  const { currentTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // New customer form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [finCode, setFinCode] = useState('');
  const [preferredPurity, setPreferredPurity] = useState<GoldPurity>('750');
  const [ringSize, setRingSize] = useState('17.5');
  const [specialDate, setSpecialDate] = useState('14 Fevral (İldönümü)');
  const [vipTier, setVipTier] = useState<Customer['vipTier']>('Qızıl VIP');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(c => {
    if (tierFilter !== 'all' && c.vipTier !== tierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.finCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      fullName,
      phone,
      email,
      finCode: finCode.toUpperCase() || 'FIN1234',
      totalPurchasedGrams: 0,
      totalSpentAZN: 0,
      preferredPurity,
      ringSize,
      specialDate,
      vipTier,
      notes
    };

    onAddCustomer(newCustomer);
    setShowModal(false);
    setFullName('');
    setPhone('');
    setEmail('');
    setFinCode('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${currentTheme.palette.cardBorder} pb-4`}>
        <div>
          <h1 className={`font-brand text-2xl font-bold tracking-tight ${currentTheme.palette.textPrimary}`}>
            Müştərilər & VIP Zərgərlik Klubu
          </h1>
          <p className={`text-xs ${currentTheme.palette.textSecondary} mt-0.5`}>
            Daimi alıcılar, zövq parametrləri, barmaq ölçüləri və ildönümü xatırlatmaları
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-4 py-2 text-xs font-semibold ${currentTheme.palette.buttonText} hover:opacity-95 transition-all shadow-sm`}
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Yeni Müştəri Qeydiyyatı</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs`}>
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${currentTheme.palette.textMuted}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müştəri adı, telefon və ya FİN axtar..."
            className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} pl-9 pr-3 py-1.5 text-xs ${currentTheme.palette.textPrimary} placeholder:${currentTheme.palette.textMuted} focus:outline-none`}
          />
        </div>

        <div className={`flex items-center gap-1 rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-1`}>
          {['all', 'Platin VIP', 'Qızıl VIP', 'Standart'].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                tierFilter === tier
                  ? `bg-gradient-to-r ${currentTheme.palette.gradient} ${currentTheme.palette.buttonText} shadow-2xs`
                  : `${currentTheme.palette.textSecondary} hover:${currentTheme.palette.textPrimary}`
              }`}
            >
              {tier === 'all' ? 'Bütün Tiers' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-5 space-y-4 shadow-xs hover:shadow-md transition-all`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-bold text-sm ${currentTheme.palette.textPrimary}`}>{customer.fullName}</h3>
                <div className={`font-mono text-[11px] ${currentTheme.palette.textMuted}`}>FİN: {customer.finCode}</div>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                customer.vipTier === 'Platin VIP'
                  ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300'
                  : customer.vipTier === 'Qızıl VIP'
                  ? `${currentTheme.palette.accentMutedBg} ${currentTheme.palette.accent} ${currentTheme.palette.accentBorder}`
                  : `${currentTheme.palette.cardHeader} ${currentTheme.palette.textSecondary} ${currentTheme.palette.cardBorder}`
              }`}>
                {customer.vipTier}
              </span>
            </div>

            {/* Stats row */}
            <div className={`grid grid-cols-2 gap-2 ${currentTheme.palette.cardHeader} p-2.5 rounded-lg border ${currentTheme.palette.cardBorder} text-xs font-mono`}>
              <div>
                <span className={`text-[10px] ${currentTheme.palette.textMuted} block`}>ALINAN QIZIL:</span>
                <span className={`font-bold ${currentTheme.palette.accent}`}>{customer.totalPurchasedGrams.toFixed(2)} qr</span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] ${currentTheme.palette.textMuted} block`}>CƏMİ ALIŞ:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{customer.totalSpentAZN.toLocaleString('az-AZ')} ₼</span>
              </div>
            </div>

            {/* Preferences */}
            <div className={`space-y-1.5 text-xs ${currentTheme.palette.textSecondary}`}>
              <div className="flex items-center justify-between">
                <span>Sevimli Əyar:</span>
                <span className={`font-mono font-bold ${currentTheme.palette.textPrimary}`}>{customer.preferredPurity} ({customer.preferredPurity === '750' ? '18K İtalyan' : '14K'})</span>
              </div>
              {customer.ringSize && (
                <div className="flex items-center justify-between">
                  <span>Üzük Ölçüsü (Razmer):</span>
                  <span className={`font-mono font-bold ${currentTheme.palette.textPrimary}`}>{customer.ringSize}</span>
                </div>
              )}
              {customer.specialDate && (
                <div className={`flex items-center justify-between ${currentTheme.palette.accentMutedBg} ${currentTheme.palette.accent} px-2 py-1 rounded border ${currentTheme.palette.accentBorder}`}>
                  <span className="flex items-center gap-1 text-[11px] font-medium">
                    <Calendar className="h-3 w-3" />
                    Özəl Tarix:
                  </span>
                  <span className="text-[11px] font-bold">{customer.specialDate}</span>
                </div>
              )}
            </div>

            {/* Contact info */}
            <div className={`border-t ${currentTheme.palette.cardBorder} pt-3 text-xs ${currentTheme.palette.textSecondary} space-y-1`}>
              <div className="flex items-center gap-2">
                <Phone className={`h-3.5 w-3.5 ${currentTheme.palette.textMuted}`} />
                <span className={`font-mono ${currentTheme.palette.textPrimary}`}>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className={`h-3.5 w-3.5 ${currentTheme.palette.textMuted}`} />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              {customer.notes && (
                <p className={`text-[11px] ${currentTheme.palette.textMuted} italic mt-1 pt-1 border-t ${currentTheme.palette.cardBorder}`}>
                  "{customer.notes}"
                </p>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* New Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className={`w-full max-w-lg rounded-2xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-6 shadow-2xl space-y-6`}>
            <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-4`}>
              <h3 className={`font-brand text-base font-bold ${currentTheme.palette.textPrimary}`}>
                Yeni VIP Müştəri Qeydiyyatı
              </h3>
              <button onClick={() => setShowModal(false)} className={`${currentTheme.palette.textMuted} hover:${currentTheme.palette.textPrimary}`}>✕</button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Ad və Soyad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Leyla Əfəndiyeva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Telefon *</label>
                  <input
                    type="text"
                    required
                    placeholder="+994 50 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Ş/V FİN Kodu</label>
                  <input
                    type="text"
                    maxLength={7}
                    placeholder="4XY12K9"
                    value={finCode}
                    onChange={(e) => setFinCode(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.textPrimary} uppercase`}
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>VIP Status</label>
                  <select
                    value={vipTier}
                    onChange={(e) => setVipTier(e.target.value as any)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  >
                    <option value="Platin VIP">Platin VIP</option>
                    <option value="Qızıl VIP">Qızıl VIP</option>
                    <option value="Standart">Standart</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Üstünlük Verdiyi Əyar</label>
                  <select
                    value={preferredPurity}
                    onChange={(e) => setPreferredPurity(e.target.value as GoldPurity)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  >
                    <option value="750">750 (18K)</option>
                    <option value="585">585 (14K)</option>
                    <option value="999.9">999 (24K)</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Üzük Razmeri</label>
                  <input
                    type="text"
                    placeholder="17.0"
                    value={ringSize}
                    onChange={(e) => setRingSize(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Özəl Gün (Təbrik)</label>
                  <input
                    type="text"
                    placeholder="12 Noyabr (Ad günü)"
                    value={specialDate}
                    onChange={(e) => setSpecialDate(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Xüsusi Zövq və Qeydlər</label>
                <textarea
                  rows={2}
                  placeholder="Yalnız təbii sapfir və brilyant modellər istəyir..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                />
              </div>

              <div className={`flex items-center justify-end gap-2 pt-4 border-t ${currentTheme.palette.cardBorder}`}>
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
                  Müştərini Əlavə Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
