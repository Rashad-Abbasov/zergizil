import React, { useState } from 'react';
import { JewelryItem, SaleItem, SaleTransaction, OldGoldTradeIn, GoldRates, GoldPurity, Customer } from '../types/jewelry';
import { 
  Search, 
  Trash2, 
  ShoppingBag, 
  ArrowRightLeft, 
  Receipt
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PosViewProps {
  items: JewelryItem[];
  cart: SaleItem[];
  rates: GoldRates;
  customers: Customer[];
  onAddToCart: (item: JewelryItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  onCompleteSale: (sale: SaleTransaction) => void;
  selectedBranch: string;
}

export const PosView: React.FC<PosViewProps> = ({
  items,
  cart,
  rates,
  customers,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCompleteSale,
  selectedBranch
}) => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurityFilter, setSelectedPurityFilter] = useState<string>('all');
  
  // Checkout & Barter States
  const [enableTradeIn, setEnableTradeIn] = useState(false);
  const [tradeInPurity, setTradeInPurity] = useState<GoldPurity>('585');
  const [tradeInGrossWeight, setTradeInGrossWeight] = useState<number>(10.00);
  const [tradeInDirtLoss, setTradeInDirtLoss] = useState<number>(0.20);
  const [tradeInNote, setTradeInNote] = useState('Köhnə qırıq zəncir və sırğa');

  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Nağd' | 'Bank Kartı (POS)' | 'BirKart Taksit' | 'Barter Qızıl' | 'Qarışıq'>('Bank Kartı (POS)');

  // Available stock items for sale
  const availableItems = items.filter(it => {
    if (it.status !== 'Satışda') return false;
    if (selectedBranch !== 'all' && it.branchId !== selectedBranch) return false;
    if (selectedPurityFilter !== 'all' && it.purity !== selectedPurityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        it.name.toLowerCase().includes(q) ||
        it.sku.toLowerCase().includes(q) ||
        it.barcode.includes(q)
      );
    }
    return true;
  });

  // Cart Calculations
  const subtotal = cart.reduce((acc, ci) => acc + (ci.unitPrice * ci.quantity), 0);
  const totalGrossWeight = cart.reduce((acc, ci) => acc + (ci.item.grossWeight * ci.quantity), 0);
  const totalNetGoldWeight = cart.reduce((acc, ci) => acc + (ci.item.netGoldWeight * ci.quantity), 0);

  // Trade In Scrap calculation
  const tradeInNetWeight = Math.max(0, tradeInGrossWeight - tradeInDirtLoss);
  const scrapRate = tradeInPurity === '585' 
    ? rates.scrapBuy585Azn 
    : tradeInPurity === '750' 
    ? rates.scrapBuy750Azn 
    : rates.scrapBuy999Azn;
  const tradeInCredit = enableTradeIn ? (tradeInNetWeight * scrapRate) : 0;

  // Net payable
  const netPayable = Math.max(0, subtotal - discountAmount - tradeInCredit);

  // Fast customer selection
  const handleSelectCustomer = (c: Customer) => {
    setCustomerName(c.fullName);
    setCustomerPhone(c.phone);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let tradeInObj: OldGoldTradeIn | undefined = undefined;
    if (enableTradeIn && tradeInCredit > 0) {
      tradeInObj = {
        purity: tradeInPurity,
        grossWeight: tradeInGrossWeight,
        dirtToleranceGrams: tradeInDirtLoss,
        netScrapWeight: tradeInNetWeight,
        ratePerGram: scrapRate,
        totalCredit: Math.round(tradeInCredit * 100) / 100,
        customerNote: tradeInNote
      };
    }

    const newSale: SaleTransaction = {
      id: `sale-${Date.now()}`,
      invoiceNo: `ZQ-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: customerName.trim() || 'Müştəri (Nağd Satış)',
      customerPhone: customerPhone.trim() || '+994 50 000 00 00',
      items: [...cart],
      totalGrossWeight,
      totalNetGoldWeight,
      subtotal,
      discountTotal: discountAmount,
      oldGoldTradeIn: tradeInObj,
      netPayable: Math.round(netPayable * 100) / 100,
      paymentMethod,
      cashierName: 'Rauf Əliyev (Baş Satıcı)',
      branchName: selectedBranch === 'b2' ? 'Gənclik Mall Zərgərlik' : 'Nizami Butik #104 (Mərkəz)'
    };

    onCompleteSale(newSale);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left 7 Columns: Product Picker / Showcase */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Section Heading & Search */}
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 space-y-3 shadow-xs`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`font-brand text-lg font-bold ${currentTheme.palette.textPrimary}`}>
                POS Kassa Terminalı
              </h2>
              <p className={`text-xs ${currentTheme.palette.textSecondary}`}>
                Barkod oxut və ya vitrindən seçim edərək səbətə əlavə edin
              </p>
            </div>
            
            {/* Live Gold ticker reference */}
            <div className="text-right text-xs">
              <span className={currentTheme.palette.textMuted}>Kassa Məzənnəsi:</span>
              <div className={`font-mono-num font-bold ${currentTheme.palette.accent}`}>
                585: {rates.gram585Azn} ₼ · 750: {rates.gram750Azn} ₼
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${currentTheme.palette.textMuted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Barkod oxut və ya məhsul axtar..."
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} pl-9 pr-3 py-2 text-xs ${currentTheme.palette.textPrimary} placeholder:${currentTheme.palette.textMuted} focus:outline-none`}
              />
            </div>

            <div className={`flex items-center gap-1 rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-1`}>
              {['all', '585', '750', '999.9'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPurityFilter(p)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    selectedPurityFilter === p
                      ? `bg-gradient-to-r ${currentTheme.palette.gradient} ${currentTheme.palette.buttonText} shadow-2xs`
                      : `${currentTheme.palette.textSecondary} hover:${currentTheme.palette.textPrimary}`
                  }`}
                >
                  {p === 'all' ? 'Hamısı' : p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[620px] overflow-y-auto pr-1">
          {availableItems.map((item) => {
            const inCart = cart.some(ci => ci.item.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => onAddToCart(item)}
                className={`group cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                  inCart 
                    ? `border-2 ${currentTheme.palette.accentBorder} ${currentTheme.palette.accentMutedBg} shadow-sm` 
                    : `${currentTheme.palette.cardBorder} ${currentTheme.palette.card} hover:border-neutral-400 shadow-xs hover:shadow-sm`
                }`}
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-neutral-100 mb-2">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2 left-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-mono font-bold text-neutral-900 shadow-2xs">
                      {item.purity} Əyar
                    </div>
                  </div>

                  <div className={`font-semibold text-xs ${currentTheme.palette.textPrimary} line-clamp-1`}>
                    {item.name}
                  </div>

                  <div className={`flex items-center justify-between text-[11px] ${currentTheme.palette.textSecondary} font-mono mt-1`}>
                    <span>{item.grossWeight.toFixed(2)} qr</span>
                    <span className={currentTheme.palette.accent}>{item.location}</span>
                  </div>
                </div>

                <div className={`flex items-center justify-between border-t ${currentTheme.palette.cardBorder} pt-2 mt-2`}>
                  <span className={`font-mono-num font-bold ${currentTheme.palette.textPrimary} text-xs`}>
                    {item.retailPrice.toLocaleString('az-AZ')} ₼
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    inCart 
                      ? `bg-gradient-to-r ${currentTheme.palette.gradient} ${currentTheme.palette.buttonText}` 
                      : `${currentTheme.palette.cardHeader} ${currentTheme.palette.textSecondary} group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700`
                  }`}>
                    {inCart ? 'Səbətdə ✓' : '+ Əlavə et'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right 5 Columns: Cart & Checkout & Scrap Trade-In */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Cart Container */}
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-5 space-y-5 shadow-xs`}>
          
          <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-3`}>
            <div className="flex items-center gap-2">
              <ShoppingBag className={`h-4 w-4 ${currentTheme.palette.accent}`} />
              <h3 className={`font-bold text-sm ${currentTheme.palette.textPrimary}`}>
                Satış Səbəti ({cart.length} məhsul)
              </h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-500 hover:text-rose-600 transition-colors"
              >
                Səbəti Təmizlə
              </button>
            )}
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className={`py-8 text-center space-y-2 ${currentTheme.palette.textMuted}`}>
              <ShoppingBag className="h-8 w-8 mx-auto opacity-30" />
              <p className="text-xs">Səbət boşdur. Soldakı vitrindən qızıl seçin.</p>
            </div>
          ) : (
            <div className={`space-y-2 max-h-[190px] overflow-y-auto pr-1 divide-y ${currentTheme.palette.cardBorder}`}>
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-xs ${currentTheme.palette.textPrimary} truncate`}>
                      {cartItem.item.name}
                    </div>
                    <div className={`text-[11px] ${currentTheme.palette.textSecondary} font-mono`}>
                      {cartItem.item.purity} əyar · {cartItem.item.grossWeight.toFixed(2)} qr brutto ({cartItem.item.netGoldWeight.toFixed(2)} qr xalis)
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`font-mono-num font-bold text-xs ${currentTheme.palette.textPrimary}`}>
                      {cartItem.finalPrice.toLocaleString('az-AZ')} ₼
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(cartItem.item.id)}
                      className="text-[10px] text-neutral-400 hover:text-rose-500"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Live Weight Totals Bar */}
          {cart.length > 0 && (
            <div className={`rounded-lg ${currentTheme.palette.cardHeader} border ${currentTheme.palette.cardBorder} p-2.5 grid grid-cols-2 gap-2 text-xs font-mono`}>
              <div>
                <span className={`${currentTheme.palette.textMuted} block text-[10px]`}>CƏMİ BRUTTO ÇƏKİ:</span>
                <span className={`font-bold ${currentTheme.palette.textPrimary}`}>{totalGrossWeight.toFixed(2)} qr</span>
              </div>
              <div className="text-right">
                <span className={`${currentTheme.palette.textMuted} block text-[10px]`}>CƏMİ XALİS QIZIL:</span>
                <span className={`font-bold ${currentTheme.palette.accent}`}>{totalNetGoldWeight.toFixed(2)} qr</span>
              </div>
            </div>
          )}

          {/* KÖHNƏ QIZIL BARTERİ / TRADE-IN */}
          <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-3.5 space-y-3`}>
            <div className="flex items-center justify-between">
              <label className={`flex items-center gap-2 cursor-pointer text-xs font-bold ${currentTheme.palette.accent}`}>
                <input
                  type="checkbox"
                  checked={enableTradeIn}
                  onChange={(e) => setEnableTradeIn(e.target.checked)}
                  className="rounded border-neutral-300 text-amber-600 focus:ring-0"
                />
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Köhnə Qızıl Barteri (Lom Qəbulu)</span>
              </label>
              {enableTradeIn && (
                <span className="text-xs font-mono-num font-bold text-emerald-600 dark:text-emerald-400">
                  -{tradeInCredit.toFixed(2)} ₼
                </span>
              )}
            </div>

            {enableTradeIn && (
              <div className={`space-y-3 pt-2 border-t ${currentTheme.palette.cardBorder} text-xs`}>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={`block text-[10px] ${currentTheme.palette.textMuted} mb-0.5`}>Əyar</label>
                    <select
                      value={tradeInPurity}
                      onChange={(e) => setTradeInPurity(e.target.value as GoldPurity)}
                      className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} py-1 px-1.5 font-mono text-xs ${currentTheme.palette.textPrimary} font-bold`}
                    >
                      <option value="585">585 (14K)</option>
                      <option value="750">750 (18K)</option>
                      <option value="999.9">999 (24K)</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] ${currentTheme.palette.textMuted} mb-0.5`}>Brutto (qr)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={tradeInGrossWeight}
                      onChange={(e) => setTradeInGrossWeight(parseFloat(e.target.value) || 0)}
                      className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} py-1 px-1.5 font-mono text-xs ${currentTheme.palette.textPrimary}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] ${currentTheme.palette.textMuted} mb-0.5`}>Zay/İtki (qr)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={tradeInDirtLoss}
                      onChange={(e) => setTradeInDirtLoss(parseFloat(e.target.value) || 0)}
                      className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} py-1 px-1.5 font-mono text-xs ${currentTheme.palette.textPrimary}`}
                    />
                  </div>
                </div>

                <div className={`flex items-center justify-between text-[11px] ${currentTheme.palette.textSecondary} ${currentTheme.palette.card} border ${currentTheme.palette.cardBorder} p-2 rounded shadow-2xs`}>
                  <span>Lom Alış: <strong className={currentTheme.palette.textPrimary}>{scrapRate.toFixed(2)} ₼/qr</strong></span>
                  <span>Netto Qızıl: <strong className={currentTheme.palette.accent}>{tradeInNetWeight.toFixed(2)} qr</strong></span>
                </div>

                <input
                  type="text"
                  placeholder="Köhnə qızıl haqqında qeyd..."
                  value={tradeInNote}
                  onChange={(e) => setTradeInNote(e.target.value)}
                  className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-2 py-1 text-xs ${currentTheme.palette.textPrimary}`}
                />
              </div>
            )}
          </div>

          {/* Customer & Discount Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className={`block text-[10px] ${currentTheme.palette.textMuted} mb-0.5`}>Müştəri Adı</label>
                <input
                  type="text"
                  placeholder="Aysel Məmmədova"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-2 py-1.5 text-xs ${currentTheme.palette.textPrimary}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] ${currentTheme.palette.textMuted} mb-0.5`}>Telefon</label>
                <input
                  type="text"
                  placeholder="+994 50 123 45 67"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-2 py-1.5 text-xs ${currentTheme.palette.textPrimary}`}
                />
              </div>
            </div>

            {/* Fast VIP Customer Picker */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] py-0.5">
              <span className={`${currentTheme.palette.textMuted} whitespace-nowrap`}>VIP Müştərilər:</span>
              {customers.slice(0, 3).map((cust) => (
                <button
                  key={cust.id}
                  onClick={() => handleSelectCustomer(cust)}
                  className={`px-2 py-0.5 rounded ${currentTheme.palette.cardHeader} border ${currentTheme.palette.cardBorder} hover:bg-neutral-200 dark:hover:bg-neutral-800 ${currentTheme.palette.textSecondary} whitespace-nowrap`}
                >
                  {cust.fullName.split(' ')[0]} ({cust.vipTier})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className={`block text-[10px] ${currentTheme.palette.textMuted} mb-0.5`}>Xüsusi Endirim (AZN)</label>
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-2 py-1.5 font-mono text-xs ${currentTheme.palette.textPrimary}`}
                />
              </div>

              <div>
                <label className={`block text-[10px] ${currentTheme.palette.textMuted} mb-0.5`}>Ödəniş Metodu</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className={`w-full rounded border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-2 py-1.5 text-xs ${currentTheme.palette.textPrimary}`}
                >
                  <option value="Bank Kartı (POS)">Bank Kartı (POS)</option>
                  <option value="Nağd">Nağd</option>
                  <option value="BirKart Taksit">BirKart Taksit (12 ay)</option>
                  <option value="Barter Qızıl">Barter Qızıl</option>
                  <option value="Qarışıq">Qarışıq (Barter + Kart)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Net Checkout Summary */}
          <div className={`border-t ${currentTheme.palette.cardBorder} pt-3 space-y-1.5 text-xs`}>
            <div className={`flex justify-between ${currentTheme.palette.textSecondary}`}>
              <span>Məhsulların cəmi:</span>
              <span className="font-mono">{subtotal.toFixed(2)} ₼</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Endirim:</span>
                <span className="font-mono">-{discountAmount.toFixed(2)} ₼</span>
              </div>
            )}

            {enableTradeIn && (
              <div className={`flex justify-between ${currentTheme.palette.accent} font-medium`}>
                <span>Köhnə Qızıl Barter Güzəşti:</span>
                <span className="font-mono">-{tradeInCredit.toFixed(2)} ₼</span>
              </div>
            )}

            <div className={`flex items-center justify-between border-t ${currentTheme.palette.cardBorder} pt-2`}>
              <span className={`font-bold ${currentTheme.palette.textPrimary} text-sm`}>YEKUN ÖDƏNİŞ:</span>
              <span className={`font-mono-num font-black text-2xl ${currentTheme.palette.accent}`}>
                {netPayable.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
              </span>
            </div>
          </div>

          {/* Complete Checkout Button */}
          <button
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              cart.length > 0
                ? `bg-gradient-to-r ${currentTheme.palette.gradient} ${currentTheme.palette.buttonText} shadow-md hover:opacity-95 cursor-pointer`
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>Satışı Tamamla və Zəmanət Qəbzi Çıxar</span>
          </button>

        </div>

      </div>

    </div>
  );
};
