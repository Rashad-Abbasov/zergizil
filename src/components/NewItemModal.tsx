import React, { useState, useEffect } from 'react';
import { JewelryItem, GoldPurity, GoldCategory, GoldTone, GemType, GoldRates } from '../types/jewelry';
import { X, Plus, Calculator, Gem, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: JewelryItem) => void;
  rates: GoldRates;
  branches: Array<{ id: string; name: string }>;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  rates,
  branches
}) => {
  const { currentTheme } = useTheme();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<GoldCategory>('Üzük');
  const [purity, setPurity] = useState<GoldPurity>('750');
  const [tone, setTone] = useState<GoldTone>('Sarı Qızıl');
  const [grossWeight, setGrossWeight] = useState<number>(5.50);
  const [stoneWeight, setStoneWeight] = useState<number>(0.00);
  const [laborFeePerGram, setLaborFeePerGram] = useState<number>(25.0);
  const [marginPercent, setMarginPercent] = useState<number>(35); // 35% profit margin
  const [retailPrice, setRetailPrice] = useState<number>(0);
  const [branchId, setBranchId] = useState(branches[0]?.id || 'b1');
  const [location, setLocation] = useState('Vitrin A-01');
  const [manufacturer, setManufacturer] = useState('İtaliya (Vicenza)');
  const [size, setSize] = useState('17.5');
  const [gemType, setGemType] = useState<GemType>('Daşsız');
  const [carat, setCarat] = useState<number>(0);
  const [clarity, setClarity] = useState('VS1');
  const [color, setColor] = useState('G');
  const [certNo, setCertNo] = useState('');
  const [selectedImage, setSelectedImage] = useState('/src/assets/images/jewelry_diamond_ring_1792265223652.jpg');

  // Available image presets generated
  const sampleImages = [
    { label: 'Brilliant Üzük', url: '/src/assets/images/jewelry_diamond_ring_1792265223652.jpg' },
    { label: 'Qızıl Boyunbağı', url: '/src/assets/images/jewelry_gold_necklace_1792265224211.jpg' },
    { label: 'Zümrüd Sırğa', url: '/src/assets/images/jewelry_emerald_earrings_1792265224376.jpg' },
    { label: 'Qızıl Qolbaq', url: '/src/assets/images/jewelry_gold_bracelet_1792265224673.jpg' }
  ];

  // Automated Formula: Net Gold Weight = Gross Weight - Stone Weight
  const netGoldWeight = Math.max(0, grossWeight - stoneWeight);

  // Dynamic Spot Rate for selected purity
  const currentGramRate = purity === '585' 
    ? rates.gram585Azn 
    : purity === '750' 
    ? rates.gram750Azn 
    : purity === '875' 
    ? (rates.gram999Azn * 0.875)
    : purity === '916' 
    ? (rates.gram999Azn * 0.916) 
    : rates.gram999Azn;

  // Auto calculate cost price & suggest retail
  useEffect(() => {
    const rawMetalCost = netGoldWeight * currentGramRate;
    const laborCost = netGoldWeight * laborFeePerGram;
    const stoneCost = gemType === 'Brilliant' ? (carat * 1200) : gemType === 'Təbii Daş (Zümrüd/Yaqut)' ? 400 : 0;
    
    const totalCost = rawMetalCost + laborCost + stoneCost;
    const calculatedRetail = totalCost * (1 + marginPercent / 100);

    // Round to nearest 5 AZN for realistic retail pricing
    const roundedRetail = Math.round(calculatedRetail / 5) * 5;
    setRetailPrice(roundedRetail || 0);
  }, [purity, grossWeight, stoneWeight, laborFeePerGram, marginPercent, gemType, carat, currentGramRate, netGoldWeight]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const skuYear = new Date().getFullYear().toString().slice(-2);
    const randomSkuNum = Math.floor(1000 + Math.random() * 9000);
    const sku = `ZQ-${skuYear}-${purity}-${randomSkuNum}`;
    const barcode = `47600${Math.floor(1000000 + Math.random() * 9000000)}`;

    const rawMetalCost = netGoldWeight * currentGramRate;
    const laborFeeTotal = Math.round(netGoldWeight * laborFeePerGram * 100) / 100;

    const newItem: JewelryItem = {
      id: `item-${Date.now()}`,
      sku,
      barcode,
      name: name.trim(),
      category,
      purity,
      tone,
      grossWeight: Math.round(grossWeight * 100) / 100,
      stoneWeight: Math.round(stoneWeight * 100) / 100,
      netGoldWeight: Math.round(netGoldWeight * 100) / 100,
      stoneDetails: {
        gemType,
        carat: carat > 0 ? carat : undefined,
        clarity: gemType === 'Brilliant' ? clarity : undefined,
        color: gemType === 'Brilliant' ? color : undefined,
        certificateNo: certNo.trim() ? certNo.trim() : undefined
      },
      laborFeePerGram,
      laborFeeTotal,
      metalCost: Math.round(rawMetalCost * 100) / 100,
      retailPrice,
      status: 'Satışda',
      branchId,
      branchName: branches.find(b => b.id === branchId)?.name || 'Nizami Butik #104 (Mərkəz)',
      location: location.trim() || 'Vitrin A-01',
      createdAt: new Date().toISOString().split('T')[0],
      imageUrl: selectedImage,
      manufacturer: manufacturer.trim() || 'İtaliya'
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      <div className={`w-full max-w-3xl rounded-2xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-6 shadow-2xl space-y-6 my-6 transition-all`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b ${currentTheme.palette.cardBorder} pb-4`}>
          <div>
            <h3 className={`font-brand text-lg font-bold ${currentTheme.palette.textPrimary}`}>
              Yeni Qızıl Məhsulunun Qeydiyyatı
            </h3>
            <p className={`text-xs ${currentTheme.palette.textSecondary} mt-0.5`}>
              Çəki, əyar, usta haqqı və birja qiyməti əsasında avtomatik maya hesabatı
            </p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 ${currentTheme.palette.textMuted} hover:${currentTheme.palette.cardHeader} hover:${currentTheme.palette.textPrimary} transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                Məhsulun Tam Adı *
              </label>
              <input
                type="text"
                required
                placeholder="məs. İtalyan Həsir Qolbaq 750 Əyar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-sm ${currentTheme.palette.textPrimary} placeholder:${currentTheme.palette.textMuted} focus:outline-none`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                Kateqoriya
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoldCategory)}
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-medium ${currentTheme.palette.textPrimary} focus:outline-none`}
              >
                <option value="Üzük">Üzük</option>
                <option value="Qolbaq">Qolbaq</option>
                <option value="Boyunbağı & Zəncir">Boyunbağı & Zəncir</option>
                <option value="Sırğa">Sırğa</option>
                <option value="Zərgərlik Dəsti">Zərgərlik Dəsti</option>
                <option value="Külçə & Sikkə">Külçə & Sikkə</option>
                <option value="Kulon & Medalyon">Kulon & Medalyon</option>
              </select>
            </div>
          </div>

          {/* Hallmark & Tone & Origin */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                Əyar (Hallmark)
              </label>
              <select
                value={purity}
                onChange={(e) => setPurity(e.target.value as GoldPurity)}
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num font-bold ${currentTheme.palette.accent} focus:outline-none`}
              >
                <option value="585">585 (14 Karat)</option>
                <option value="750">750 (18 Karat)</option>
                <option value="875">875 (21 Karat)</option>
                <option value="916">916 (22 Karat)</option>
                <option value="999.9">999.9 (24K Xalis)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                Qızılın Rəngi / Çaları
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as GoldTone)}
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary} focus:outline-none`}
              >
                <option value="Sarı Qızıl">Sarı Qızıl (Klassik)</option>
                <option value="Ağ Qızıl">Ağ Qızıl (Rodium)</option>
                <option value="Qırmızı Qızıl (Rozovı)">Qırmızı / Rozovı</option>
                <option value="İki Rəngli (Kombinə)">İki Rəngli (Kombinə)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                İstehsalçı / Ölkə
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="İtaliya, Dubay, Əl İşi"
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary} focus:outline-none`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                Ölçü (sm / Razmer)
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="17.5 / 19 sm"
                className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary} focus:outline-none`}
              />
            </div>
          </div>

          {/* Weights & Calculation Core */}
          <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-4 space-y-4`}>
            <div className={`flex items-center justify-between text-xs font-semibold ${currentTheme.palette.textPrimary}`}>
              <span className="flex items-center gap-1.5">
                <Calculator className={`h-4 w-4 ${currentTheme.palette.accent}`} />
                Dəqiq Tərəzi və Qızıl Çəki Hesabatı
              </span>
              <span className={`font-mono text-[11px] ${currentTheme.palette.textSecondary}`}>
                Cari birja qramı: <strong className={currentTheme.palette.accent}>{currentGramRate.toFixed(2)} ₼</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-[11px] font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                  1. Ümumi Çəki (Brutto qr) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                    className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-sm font-mono-num font-bold ${currentTheme.palette.textPrimary} focus:outline-none`}
                  />
                  <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.palette.textMuted} text-xs`}>qr</span>
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                  2. Daş Çəkisi (qr)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={stoneWeight}
                    onChange={(e) => setStoneWeight(parseFloat(e.target.value) || 0)}
                    className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-sm font-mono-num ${currentTheme.palette.textPrimary} focus:outline-none`}
                  />
                  <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.palette.textMuted} text-xs`}>qr</span>
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-medium ${currentTheme.palette.accent} mb-1`}>
                  3. Xalis Qızıl Çəkisi (Netto)
                </label>
                <div className={`rounded-lg border ${currentTheme.palette.accentBorder} ${currentTheme.palette.accentMutedBg} px-3 py-2 text-sm font-mono-num font-black ${currentTheme.palette.accent} flex items-center justify-between`}>
                  <span>{netGoldWeight.toFixed(2)}</span>
                  <span className={`text-xs ${currentTheme.palette.textSecondary}`}>qram xalis</span>
                </div>
              </div>
            </div>

            {/* Labor & Price Calc */}
            <div className={`grid grid-cols-3 gap-4 pt-2 border-t ${currentTheme.palette.cardBorder}`}>
              <div>
                <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>
                  Usta İşçilik Haqqı (AZN/qr)
                </label>
                <input
                  type="number"
                  step="1"
                  value={laborFeePerGram}
                  onChange={(e) => setLaborFeePerGram(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num ${currentTheme.palette.textPrimary} focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>
                  Ticarət Marjası (%)
                </label>
                <input
                  type="number"
                  step="1"
                  value={marginPercent}
                  onChange={(e) => setMarginPercent(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num ${currentTheme.palette.textPrimary} focus:outline-none`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold ${currentTheme.palette.accent} mb-1`}>
                  Yekun Pərakəndə Satış Qiyməti (AZN) *
                </label>
                <input
                  type="number"
                  step="10"
                  required
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-lg border ${currentTheme.palette.accentBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-sm font-mono-num font-black ${currentTheme.palette.accent} focus:outline-none`}
                />
              </div>
            </div>
          </div>

          {/* Gemstone specs */}
          <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} p-4 space-y-3`}>
            <div className={`text-xs font-semibold ${currentTheme.palette.textPrimary} flex items-center gap-1.5`}>
              <Gem className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Qiymətli Daş & Sertifikat Məlumatı
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>Daş Növü</label>
                <select
                  value={gemType}
                  onChange={(e) => setGemType(e.target.value as GemType)}
                  className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary} focus:outline-none`}
                >
                  <option value="Daşsız">Daşsız</option>
                  <option value="Brilliant">Brilliant / Almaz</option>
                  <option value="Təbii Daş (Zümrüd/Yaqut)">Təbii Daş (Zümrüd/Yaqut)</option>
                  <option value="Sirkon">Sirkon / Swarovski</option>
                  <option value="Mirvari">Təbii Mirvari</option>
                </select>
              </div>

              {gemType === 'Brilliant' && (
                <>
                  <div>
                    <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>Karat (ct)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={carat}
                      onChange={(e) => setCarat(parseFloat(e.target.value) || 0)}
                      className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs font-mono-num ${currentTheme.palette.textPrimary}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>Təmizlik (Clarity)</label>
                    <input
                      type="text"
                      value={clarity}
                      onChange={(e) => setClarity(e.target.value)}
                      placeholder="VVS1, VS2, SI1"
                      className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>Rəng (Color)</label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="D, E, F, G"
                      className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary}`}
                    />
                  </div>
                </>
              )}

              {gemType !== 'Daşsız' && (
                <div className="col-span-2">
                  <label className={`block text-[11px] ${currentTheme.palette.textSecondary} mb-1`}>Sertifikat № (GIA / HRD / Daxili)</label>
                  <input
                    type="text"
                    value={certNo}
                    onChange={(e) => setCertNo(e.target.value)}
                    placeholder="GIA-249018820 və ya ZQ-LAB-102"
                    className={`w-full rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary}`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Photo & Showcase Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                Filial və Vitrin / Seyf
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className={`rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary}`}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Vitrin A-01"
                  className={`rounded-lg border ${currentTheme.palette.inputBorder} ${currentTheme.palette.inputBg} px-3 py-2 text-xs ${currentTheme.palette.textPrimary}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium ${currentTheme.palette.textSecondary} mb-1`}>
                Kataloq Şəkli Seçimi
              </label>
              <div className="flex gap-2">
                {sampleImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative h-12 w-12 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img.url ? `border-amber-500 scale-105 shadow-sm` : `${currentTheme.palette.cardBorder} opacity-70 hover:opacity-100`
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={`flex items-center justify-end gap-3 border-t ${currentTheme.palette.cardBorder} pt-4`}>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg border ${currentTheme.palette.cardBorder} px-4 py-2 text-xs font-medium ${currentTheme.palette.textSecondary} hover:${currentTheme.palette.cardHeader}`}
            >
              Ləğv et
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${currentTheme.palette.gradient} px-5 py-2 text-xs font-bold ${currentTheme.palette.buttonText} shadow-sm hover:opacity-95 transition-all`}
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>İnventara Qeyd Et</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
