import React, { useState } from 'react';
import { CustomRepairOrder, GoldPurity } from '../types/jewelry';
import { Plus, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface WorkshopViewProps {
  orders: CustomRepairOrder[];
  onAddOrder: (order: CustomRepairOrder) => void;
  onUpdateStatus: (orderId: string, newStatus: CustomRepairOrder['status']) => void;
}

export const WorkshopView: React.FC<WorkshopViewProps> = ({
  orders,
  onAddOrder,
  onUpdateStatus
}) => {
  const { currentTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [filterJeweler, setFilterJeweler] = useState<string>('all');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [type, setType] = useState<CustomRepairOrder['type']>('Fərdi Hazırlanma');
  const [itemDescription, setItemDescription] = useState('');
  const [targetPurity, setTargetPurity] = useState<GoldPurity>('750');
  const [estimatedWeightGrams, setEstimatedWeightGrams] = useState<number>(12.00);
  const [customerProvidedGoldGrams, setCustomerProvidedGoldGrams] = useState<number>(0);
  const [stoneDetails, setStoneDetails] = useState('');
  const [jewelerName, setJewelerName] = useState('Usta Vüqar (Baş Modelçi)');
  const [estimatedCost, setEstimatedCost] = useState<number>(1400);
  const [depositPaid, setDepositPaid] = useState<number>(500);
  const [deadlineDate, setDeadlineDate] = useState('2026-10-25');

  const filteredOrders = orders.filter(ord => {
    if (filterJeweler !== 'all' && !ord.jewelerName.includes(filterJeweler)) return false;
    return true;
  });

  const statuses: CustomRepairOrder['status'][] = [
    'Qəbul edildi',
    'Qızıl Ayrıldı',
    'Usta Masasında',
    'Əyarlanma',
    'Cilalanma / Rodium',
    'Hazırdır'
  ];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !itemDescription.trim()) return;

    const remainingBalance = Math.max(0, estimatedCost - depositPaid);
    const newOrder: CustomRepairOrder = {
      id: `ord-${Date.now()}`,
      orderNo: `ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      customerName,
      customerPhone,
      type,
      itemDescription,
      targetPurity,
      estimatedWeightGrams,
      customerProvidedGoldGrams,
      stoneDetails: stoneDetails || undefined,
      jewelerName,
      estimatedCost,
      depositPaid,
      remainingBalance,
      status: 'Qəbul edildi',
      deadlineDate
    };

    onAddOrder(newOrder);
    setShowModal(false);
    setCustomerName('');
    setCustomerPhone('');
    setItemDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${currentTheme.palette.cardBorder} pb-4`}>
        <div>
          <h1 className={`font-brand text-2xl font-bold tracking-tight ${currentTheme.palette.textPrimary}`}>
            Zərgər Emalatxanası və Fərdi Sifarişlər
          </h1>
          <p className={`text-xs ${currentTheme.palette.textSecondary} mt-0.5`}>
            Müştəri sifarişləri, xüsusi eskizlər, təmir, daş bərkidilməsi və usta marşrutu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterJeweler}
            onChange={(e) => setFilterJeweler(e.target.value)}
            className={`rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-1.5 text-xs ${currentTheme.palette.textPrimary}`}
          >
            <option value="all">Bütün Zərgər Ustaları</option>
            <option value="Vüqar">Usta Vüqar (Baş Modelçi)</option>
            <option value="Rəşid">Usta Rəşid</option>
            <option value="Əhməd">Usta Əhməd</option>
          </select>

          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-4 py-2 text-xs font-semibold ${currentTheme.palette.buttonText} hover:opacity-95 transition-all shadow-sm whitespace-nowrap`}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Yeni Zərgər Sifarişi</span>
          </button>
        </div>
      </div>

      {/* Workshop Kanban / Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
          const isDone = order.status === 'Hazırdır';
          return (
            <div
              key={order.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isDone 
                  ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-500/40 dark:bg-emerald-950/10' 
                  : `${currentTheme.palette.cardBorder} ${currentTheme.palette.card} shadow-xs hover:shadow-sm`
              }`}
            >
              <div className="space-y-3">
                
                {/* Order Top Badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold ${currentTheme.palette.accent}`}>{order.orderNo}</span>
                    <span className={currentTheme.palette.textMuted}>·</span>
                    <span className={currentTheme.palette.textSecondary}>{order.type}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                    isDone 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300' 
                      : `${currentTheme.palette.accentMutedBg} ${currentTheme.palette.accent} ${currentTheme.palette.accentBorder}`
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className={`font-bold text-sm ${currentTheme.palette.textPrimary}`}>
                    {order.itemDescription}
                  </h4>
                  {order.stoneDetails && (
                    <p className={`text-xs ${currentTheme.palette.textSecondary} mt-1 flex items-center gap-1`}>
                      <Sparkles className={`h-3 w-3 ${currentTheme.palette.accent} shrink-0`} />
                      <span>{order.stoneDetails}</span>
                    </p>
                  )}
                </div>

                {/* Technical Specs */}
                <div className={`grid grid-cols-2 gap-2 ${currentTheme.palette.cardHeader} p-2.5 rounded-lg border ${currentTheme.palette.cardBorder} text-[11px] font-mono`}>
                  <div>
                    <span className={`${currentTheme.palette.textMuted} block`}>Hədəf Əyar / Çəki:</span>
                    <span className={`font-bold ${currentTheme.palette.textPrimary}`}>
                      {order.targetPurity} ({order.estimatedWeightGrams.toFixed(2)} qr)
                    </span>
                  </div>
                  <div>
                    <span className={`${currentTheme.palette.textMuted} block`}>Müştəri Qızılı:</span>
                    <span className={`font-bold ${currentTheme.palette.accent}`}>
                      {order.customerProvidedGoldGrams > 0 ? `${order.customerProvidedGoldGrams.toFixed(2)} qr verilib` : 'Yoxdur (Mağazadan)'}
                    </span>
                  </div>
                </div>

                {/* Customer and Master */}
                <div className={`space-y-1 text-xs ${currentTheme.palette.textSecondary}`}>
                  <div className="flex justify-between">
                    <span>Müştəri:</span>
                    <span className={`${currentTheme.palette.textPrimary} font-medium`}>{order.customerName} ({order.customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Məsul Zərgər:</span>
                    <span className={currentTheme.palette.accentLight}>{order.jewelerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Təhvil Tarixi:</span>
                    <span className={`${currentTheme.palette.textPrimary} font-mono font-semibold`}>{order.deadlineDate}</span>
                  </div>
                </div>

                {/* Financials */}
                <div className={`border-t ${currentTheme.palette.cardBorder} pt-2 flex justify-between text-xs`}>
                  <div>
                    <span className={currentTheme.palette.textMuted}>Məbləğ: </span>
                    <span className={`font-mono font-bold ${currentTheme.palette.textPrimary}`}>{order.estimatedCost} ₼</span>
                  </div>
                  <div>
                    <span className={currentTheme.palette.textMuted}>Qalıq: </span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{order.remainingBalance} ₼</span>
                  </div>
                </div>

              </div>

              {/* Status Update Dropdown */}
              <div className={`mt-4 pt-3 border-t ${currentTheme.palette.cardBorder} flex items-center justify-between gap-2`}>
                <span className={`text-[11px] ${currentTheme.palette.textMuted}`}>Mərhələni dəyiş:</span>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
                  className={`rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-2.5 py-1 text-xs ${currentTheme.palette.textPrimary}`}
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

            </div>
          );
        })}
      </div>

      {/* New Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-2xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-6 shadow-2xl space-y-6 my-6`}>
            <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-4`}>
              <h3 className={`font-brand text-base font-bold ${currentTheme.palette.textPrimary}`}>
                Yeni Zərgər Emalatxanası Sifarişi
              </h3>
              <button onClick={() => setShowModal(false)} className={`${currentTheme.palette.textMuted} hover:${currentTheme.palette.textPrimary}`}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Müştərinin Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Elmir Nəsirov"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Əlaqə Telefonu *</label>
                  <input
                    type="text"
                    required
                    placeholder="+994 50 123 45 67"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Sifarişin Növü</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  >
                    <option value="Fərdi Hazırlanma">Fərdi Hazırlanma (Eskiz üzrə)</option>
                    <option value="Təmir & Bərpa">Təmir & Bərpa (Qaynaq/Kilid)</option>
                    <option value="Ölçü Dəyişdirilməsi">Üzük Ölçü Dəyişdirilməsi</option>
                    <option value="Daş Bərkidilməsi">Qiymətli Daş Bərkidilməsi</option>
                    <option value="Təmizləmə & Rodium">Ultrasəs Yuma & Ağ Rodium</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Məsul Usta</label>
                  <select
                    value={jewelerName}
                    onChange={(e) => setJewelerName(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  >
                    <option value="Usta Vüqar (Baş Modelçi)">Usta Vüqar (Baş Modelçi)</option>
                    <option value="Usta Rəşid">Usta Rəşid</option>
                    <option value="Usta Əhməd">Usta Əhməd</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Məmulatın Təsviri və Xüsusi Tələblər *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="məs. Qoşa ağ qızıl nişan üzükləri, içində 'Elmir & Sevinc' lazer oyma..."
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Əyar</label>
                  <select
                    value={targetPurity}
                    onChange={(e) => setTargetPurity(e.target.value as GoldPurity)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.accent} font-bold`}
                  >
                    <option value="585">585 (14K)</option>
                    <option value="750">750 (18K)</option>
                    <option value="916">916 (22K)</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Təxmini Çəki (qr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={estimatedWeightGrams}
                    onChange={(e) => setEstimatedWeightGrams(parseFloat(e.target.value) || 0)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.textPrimary}`}
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Müştəri Qızılı (qr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customerProvidedGoldGrams}
                    onChange={(e) => setCustomerProvidedGoldGrams(parseFloat(e.target.value) || 0)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.accent}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Qiymət Dəyəri (AZN)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 font-mono ${currentTheme.palette.textPrimary}`}
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Beh / Depozit (AZN)</label>
                  <input
                    type="number"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
                    className="w-full rounded border border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 p-2 font-mono text-emerald-800 dark:text-emerald-300 font-bold"
                  />
                </div>
                <div>
                  <label className={`block ${currentTheme.palette.textSecondary} mb-1`}>Təhvil Tarixi</label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} p-2 ${currentTheme.palette.textPrimary}`}
                  />
                </div>
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
                  Sifarişi Aç & Ustaya Yönləndir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
