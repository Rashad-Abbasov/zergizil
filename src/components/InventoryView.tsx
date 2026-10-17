import React, { useState } from 'react';
import { JewelryItem, GoldPurity, GoldRates } from '../types/jewelry';
import { 
  Search, 
  Grid, 
  List, 
  Tag, 
  Sparkles, 
  ShoppingBag, 
  Trash2, 
  Scale, 
  Coins, 
  DollarSign,
  Plus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface InventoryViewProps {
  items: JewelryItem[];
  rates: GoldRates;
  selectedBranch: string;
  onOpenTagModal: (item: JewelryItem) => void;
  onAddToCart: (item: JewelryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenNewItemModal: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  rates,
  selectedBranch,
  onOpenTagModal,
  onAddToCart,
  onDeleteItem,
  onOpenNewItemModal
}) => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurity, setSelectedPurity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter items
  const filteredItems = items.filter(item => {
    if (selectedBranch !== 'all' && item.branchId !== selectedBranch) return false;
    if (selectedPurity !== 'all' && item.purity !== selectedPurity) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);
      const matchBarcode = item.barcode.includes(q);
      const matchLocation = item.location.toLowerCase().includes(q);
      const matchManufacturer = item.manufacturer.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBarcode && !matchLocation && !matchManufacturer) {
        return false;
      }
    }
    return true;
  });

  // Calculate metrics
  const totalCount = filteredItems.length;
  const totalGrossWeight = filteredItems.reduce((acc, it) => acc + it.grossWeight, 0);
  const totalNetGoldWeight = filteredItems.reduce((acc, it) => acc + it.netGoldWeight, 0);
  const totalRetailValue = filteredItems.reduce((acc, it) => acc + it.retailPrice, 0);

  // Pure 999 equivalent gold
  const totalPureEquivalentGrams = filteredItems.reduce((acc, it) => {
    const factor = it.purity === '585' ? 0.585 : it.purity === '750' ? 0.750 : it.purity === '916' ? 0.916 : 0.9999;
    return acc + (it.netGoldWeight * factor);
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Section Header & KPI Strip */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${currentTheme.palette.cardBorder} pb-4`}>
        <div>
          <h1 className={`font-brand text-2xl font-bold tracking-tight ${currentTheme.palette.textPrimary}`}>
            Zərgərlik və Qızıl İnventarı
          </h1>
          <p className={`text-xs ${currentTheme.palette.textSecondary} mt-0.5`}>
            Vitrinlərdə və seyflərdə olan bütün məmulatların dəqiq qram və əyar balansı
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className={`flex items-center rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-0.5 shadow-xs`}>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? `${currentTheme.palette.accentMutedBg} ${currentTheme.palette.accent}` : `${currentTheme.palette.textMuted} hover:${currentTheme.palette.textPrimary}`
              }`}
              title="Cədvəl Görünüşü"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? `${currentTheme.palette.accentMutedBg} ${currentTheme.palette.accent}` : `${currentTheme.palette.textMuted} hover:${currentTheme.palette.textPrimary}`
              }`}
              title="Vitrin Kartları"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewItemModal}
            className={`flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-3.5 py-1.5 text-xs font-semibold ${currentTheme.palette.buttonText} hover:opacity-95 transition-all shadow-sm`}
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Məhsul Qeydiyyatı</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.palette.textSecondary}>Məhsul Sayı</span>
            <Coins className={`h-4 w-4 ${currentTheme.palette.accent}`} />
          </div>
          <div className={`font-mono-num text-2xl font-bold ${currentTheme.palette.textPrimary}`}>
            {totalCount}
            <span className={`text-xs font-normal ${currentTheme.palette.textMuted} ml-1.5`}>ədəd</span>
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1`}>
            Aktiv vitrinlərdə
          </div>
        </div>

        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.palette.textSecondary}>Cəmi Ümumi Çəki</span>
            <Scale className={`h-4 w-4 ${currentTheme.palette.textMuted}`} />
          </div>
          <div className={`font-mono-num text-2xl font-bold ${currentTheme.palette.textPrimary}`}>
            {totalGrossWeight.toFixed(2)}
            <span className={`text-xs font-normal ${currentTheme.palette.textMuted} ml-1.5`}>qram</span>
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1`}>
            Daşlar daxil ümumi brutto
          </div>
        </div>

        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.palette.textSecondary}>Xalis 999.9 Qızıl</span>
            <Sparkles className={`h-4 w-4 ${currentTheme.palette.accent}`} />
          </div>
          <div className={`font-mono-num text-2xl font-bold ${currentTheme.palette.accent}`}>
            {totalPureEquivalentGrams.toFixed(2)}
            <span className={`text-xs font-normal ${currentTheme.palette.textMuted} ml-1.5`}>qr xalis</span>
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1`}>
            Daşsız xalis metal ekvivalenti
          </div>
        </div>

        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 shadow-xs`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={currentTheme.palette.textSecondary}>Ümumi Vitrin Dəyəri</span>
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="font-mono-num text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalRetailValue.toLocaleString('az-AZ', { minimumFractionDigits: 2 })}
            <span className={`text-xs font-normal ${currentTheme.palette.textMuted} ml-1`}>₼</span>
          </div>
          <div className={`text-[11px] ${currentTheme.palette.textMuted} mt-1`}>
            Pərakəndə satış dəyəri
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs`}>
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${currentTheme.palette.textMuted}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Məhsul adı, SKU (ZQ-...), barkod və ya vitrin axtar..."
            className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} pl-9 pr-3 py-1.5 text-xs ${currentTheme.palette.textPrimary} placeholder:${currentTheme.palette.textMuted} focus:${currentTheme.palette.accentBorder} focus:outline-none`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-xs ${currentTheme.palette.textMuted} hover:${currentTheme.palette.textPrimary}`}
            >
              ✕
            </button>
          )}
        </div>

        {/* Hallmark Segmented Buttons */}
        <div className={`flex items-center gap-1 rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-1`}>
          {['all', '585', '750', '999.9'].map((purity) => (
            <button
              key={purity}
              onClick={() => setSelectedPurity(purity)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedPurity === purity
                  ? `bg-gradient-to-r ${currentTheme.palette.gradient} ${currentTheme.palette.buttonText} shadow-2xs`
                  : `${currentTheme.palette.textSecondary} hover:${currentTheme.palette.textPrimary}`
              }`}
            >
              {purity === 'all' ? 'Bütün Əyarlar' : `${purity} (${purity === '585' ? '14K' : purity === '750' ? '18K' : '24K'})`}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-1.5 text-xs ${currentTheme.palette.textPrimary} focus:outline-none`}
        >
          <option value="all">Bütün Kateqoriyalar</option>
          <option value="Üzük">Üzük</option>
          <option value="Qolbaq">Qolbaq</option>
          <option value="Boyunbağı & Zəncir">Boyunbağı & Zəncir</option>
          <option value="Sırğa">Sırğa</option>
          <option value="Zərgərlik Dəsti">Zərgərlik Dəsti</option>
          <option value="Külçə & Sikkə">Külçə & Sikkə</option>
        </select>

      </div>

      {/* Main Content: Table or Grid */}
      {filteredItems.length === 0 ? (
        <div className={`rounded-xl border border-dashed ${currentTheme.palette.cardBorder} p-12 text-center space-y-3`}>
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${currentTheme.palette.cardHeader} ${currentTheme.palette.textMuted}`}>
            <Search className="h-6 w-6" />
          </div>
          <h3 className={`text-sm font-semibold ${currentTheme.palette.textPrimary}`}>
            Axtarışa uyğun qızıl məhsulu tapılmadı
          </h3>
          <p className={`text-xs ${currentTheme.palette.textSecondary} max-w-sm mx-auto`}>
            Filtri dəyişdirin və ya axtarış sorğusunu təmizləyərək yenidən yoxlayın.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPurity('all');
              setSelectedCategory('all');
            }}
            className={`rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} px-4 py-1.5 text-xs font-medium ${currentTheme.palette.textPrimary} shadow-xs hover:opacity-90`}
          >
            Filtri Sıfırla
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* Table View */
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} overflow-hidden shadow-xs`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${currentTheme.palette.cardBorder} ${currentTheme.palette.tableHead} ${currentTheme.palette.textSecondary} font-semibold`}>
                  <th className="py-3 px-4">Məhsul & SKU</th>
                  <th className="py-3 px-3">Əyar & Rəng</th>
                  <th className="py-3 px-3 text-right">Ümumi Çəki</th>
                  <th className="py-3 px-3 text-right">Daş Çəkisi</th>
                  <th className="py-3 px-3 text-right">Xalis Qızıl</th>
                  <th className="py-3 px-3 text-right">Pərakəndə Qiymət</th>
                  <th className="py-3 px-3">Yerləşmə</th>
                  <th className="py-3 px-4 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${currentTheme.palette.cardBorder}`}>
                {filteredItems.map((item) => (
                  <tr key={item.id} className={`${currentTheme.palette.tableRowHover} transition-colors`}>
                    
                    {/* Item Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 shrink-0 rounded-lg overflow-hidden border ${currentTheme.palette.cardBorder} bg-neutral-100`}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className={`font-semibold ${currentTheme.palette.textPrimary} line-clamp-1 max-w-[220px]`}>
                            {item.name}
                          </div>
                          <div className={`flex items-center gap-2 text-[11px] ${currentTheme.palette.textMuted} font-mono mt-0.5`}>
                            <span>{item.sku}</span>
                            <span>·</span>
                            <span>{item.manufacturer}</span>
                            {item.size && (
                              <>
                                <span>·</span>
                                <span>Ölçü: {item.size}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Hallmark & Tone */}
                    <td className="py-3 px-3">
                      <div>
                        <span className={`font-mono-num font-bold ${currentTheme.palette.accent}`}>
                          {item.purity}
                        </span>
                        <span className={`text-[10px] ${currentTheme.palette.textMuted} ml-1`}>
                          ({item.purity === '585' ? '14K' : item.purity === '750' ? '18K' : '24K'})
                        </span>
                        <div className={`text-[11px] ${currentTheme.palette.textSecondary}`}>
                          {item.tone}
                        </div>
                      </div>
                    </td>

                    {/* Gross Weight */}
                    <td className={`py-3 px-3 text-right font-mono-num ${currentTheme.palette.textPrimary}`}>
                      {item.grossWeight.toFixed(2)} qr
                    </td>

                    {/* Stone Weight & Specs */}
                    <td className="py-3 px-3 text-right">
                      {item.stoneWeight > 0 ? (
                        <div>
                          <div className={`font-mono-num ${currentTheme.palette.textPrimary}`}>
                            {item.stoneWeight.toFixed(2)} qr
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate max-w-[110px] ml-auto">
                            {item.stoneDetails.gemType} {item.stoneDetails.carat ? `(${item.stoneDetails.carat}ct)` : ''}
                          </div>
                        </div>
                      ) : (
                        <span className={currentTheme.palette.textMuted}>Daşsız</span>
                      )}
                    </td>

                    {/* Net Pure Gold */}
                    <td className={`py-3 px-3 text-right font-mono-num font-bold ${currentTheme.palette.accent}`}>
                      {item.netGoldWeight.toFixed(2)} qr
                    </td>

                    {/* Retail Price */}
                    <td className="py-3 px-3 text-right">
                      <div className={`font-mono-num font-bold ${currentTheme.palette.textPrimary} text-sm`}>
                        {item.retailPrice.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                      </div>
                      <div className={`text-[10px] ${currentTheme.palette.textMuted}`}>
                        Usta: {item.laborFeeTotal.toFixed(0)} ₼
                      </div>
                    </td>

                    {/* Location */}
                    <td className={`py-3 px-3 ${currentTheme.palette.textSecondary}`}>
                      <div className={currentTheme.palette.textPrimary}>{item.location}</div>
                      <div className={`text-[10px] ${currentTheme.palette.textMuted} truncate max-w-[130px]`}>
                        {item.branchName}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Tag button */}
                        <button
                          onClick={() => onOpenTagModal(item)}
                          title="Zərgərlik Birka / Etiket Çapı"
                          className={`rounded-md border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-1.5 ${currentTheme.palette.textSecondary} hover:${currentTheme.palette.accent} hover:${currentTheme.palette.accentBorder} shadow-2xs transition-colors`}
                        >
                          <Tag className="h-3.5 w-3.5" />
                        </button>

                        {/* Add to POS cart */}
                        <button
                          onClick={() => onAddToCart(item)}
                          title="POS Kassada Satışa Əlavə Et"
                          className={`rounded-md border ${currentTheme.palette.accentBorder} ${currentTheme.palette.accentMutedBg} p-1.5 ${currentTheme.palette.accent} hover:opacity-80 transition-colors`}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          title="İnventardan çıxar"
                          className="rounded-md p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* Showcase Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} overflow-hidden flex flex-col justify-between hover:shadow-md transition-all`}
            >
              <div>
                {/* Photo showcase */}
                <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  
                  {/* Hallmark badge */}
                  <div className="absolute top-2.5 left-2.5 rounded bg-white/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-mono font-bold text-neutral-900 border border-neutral-200 shadow-2xs">
                    {item.purity} Əyar
                  </div>

                  {item.stoneDetails.gemType !== 'Daşsız' && (
                    <div className="absolute top-2.5 right-2.5 rounded bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200 shadow-2xs">
                      {item.stoneDetails.gemType}
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-3.5 space-y-2">
                  <div className={`font-semibold ${currentTheme.palette.textPrimary} text-xs line-clamp-1`}>
                    {item.name}
                  </div>

                  <div className={`flex items-center justify-between text-[11px] ${currentTheme.palette.textSecondary} font-mono`}>
                    <span>Ü.Ç: <strong className={currentTheme.palette.textPrimary}>{item.grossWeight.toFixed(2)} qr</strong></span>
                    <span>X.Ç: <strong className={currentTheme.palette.accent}>{item.netGoldWeight.toFixed(2)} qr</strong></span>
                  </div>

                  <div className={`text-[11px] ${currentTheme.palette.textMuted}`}>
                    {item.location} · {item.manufacturer}
                  </div>
                </div>
              </div>

              {/* Price & Actions Row */}
              <div className={`border-t ${currentTheme.palette.cardBorder} p-3 flex items-center justify-between ${currentTheme.palette.cardHeader}`}>
                <div className={`font-mono-num font-bold ${currentTheme.palette.textPrimary} text-sm`}>
                  {item.retailPrice.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenTagModal(item)}
                    title="Etiket Çapı"
                    className={`p-1.5 rounded-lg border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} ${currentTheme.palette.textSecondary} hover:${currentTheme.palette.accent}`}
                  >
                    <Tag className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onAddToCart(item)}
                    title="Səbətə Əlavə Et"
                    className={`p-1.5 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} ${currentTheme.palette.buttonText} hover:opacity-90 font-semibold shadow-2xs`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
};
