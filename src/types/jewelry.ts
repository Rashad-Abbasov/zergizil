export type GoldPurity = '585' | '750' | '875' | '916' | '999.9';

export type GoldCategory = 
  | 'Üzük' 
  | 'Qolbaq' 
  | 'Boyunbağı & Zəncir' 
  | 'Sırğa' 
  | 'Zərgərlik Dəsti' 
  | 'Külçə & Sikkə' 
  | 'Kulon & Medalyon';

export type GoldTone = 
  | 'Sarı Qızıl' 
  | 'Ağ Qızıl' 
  | 'Qırmızı Qızıl (Rozovı)' 
  | 'İki Rəngli (Kombinə)';

export type GemType = 'Brilliant' | 'Sirkon' | 'Təbii Daş (Zümrüd/Yaqut)' | 'Mirvari' | 'Daşsız';

export interface StoneDetails {
  gemType: GemType;
  carat?: number;
  clarity?: string; // VVS1, VS1, SI1, etc.
  color?: string; // D, E, F, G, H
  cut?: string; // Brilliant cut, Princess, Emerald cut
  certificateNo?: string; // HRD-2026-884, GIA-449102
  labName?: string; // HRD Antwerp, GIA, Daxili Laboratoriya
}

export interface JewelryItem {
  id: string;
  sku: string; // e.g. ZQ-750-1049
  barcode: string; // 869012345678
  name: string;
  category: GoldCategory;
  purity: GoldPurity;
  tone: GoldTone;
  grossWeight: number; // Ümumi çəki (qram)
  stoneWeight: number; // Daş çəkisi (qram)
  netGoldWeight: number; // Xalis qızıl çəkisi (qram)
  laborFeePerGram: number; // Qramına düşən usta/istehsal işçilik haqqı (AZN)
  laborFeeTotal: number; // Cəmi işçilik haqqı
  metalCost: number; // Qızılın maya dəyəri
  retailPrice: number; // Pərakəndə satış qiyməti (AZN)
  location: string; // e.g. "Vitrin A-02 (Brilliant)", "Kassa Seyfi #1"
  branchId: string;
  branchName: string;
  status: 'Satışda' | 'Satıldı' | 'Girovda' | 'Emalatxanada';
  stoneDetails: StoneDetails;
  manufacturer: string; // 'İtaliya', 'Türkiyə', 'Dubay', 'Yerli Zərgər Əl İşi'
  size?: string; // e.g. "17.5" for rings, "19 sm" for bracelets
  imageUrl: string;
  createdAt: string;
}

export interface GoldRates {
  spotGoldUSDPerOz: number; // e.g. 2748.50
  usdAznRate: number; // 1.7000
  gram999Azn: number; // ~150.25 AZN
  gram750Azn: number; // ~112.70 AZN
  gram585Azn: number; // ~87.90 AZN
  scrapBuy585Azn: number; // Köhnə qızıl alış 585 (məs. 83.00 AZN)
  scrapBuy750Azn: number; // Köhnə qızıl alış 750 (məs. 107.50 AZN)
  scrapBuy999Azn: number; // Köhnə qızıl alış 999 (məs. 145.00 AZN)
  lastUpdated: string;
}

export interface OldGoldTradeIn {
  purity: GoldPurity;
  grossWeight: number;
  dirtToleranceGrams: number; // zibil/itki payı
  netScrapWeight: number;
  ratePerGram: number;
  totalCredit: number;
  customerNote: string;
}

export interface SaleItem {
  item: JewelryItem;
  quantity: number;
  unitPrice: number;
  discountAZN: number;
  finalPrice: number;
}

export interface SaleTransaction {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  totalGrossWeight: number;
  totalNetGoldWeight: number;
  subtotal: number;
  discountTotal: number;
  oldGoldTradeIn?: OldGoldTradeIn;
  netPayable: number;
  paymentMethod: 'Nağd' | 'Bank Kartı (POS)' | 'BirKart Taksit' | 'TamKart Taksit' | 'Barter Qızıl' | 'Qarışıq';
  cashierName: string;
  branchName: string;
  receiptNotes?: string;
}

export interface ScrapGoldEntry {
  id: string;
  entryNo: string;
  date: string;
  customerName: string;
  customerFin: string; // Şəxsiyyət vəsiqəsi FİN
  customerPhone: string;
  purity: GoldPurity;
  grossWeight: number;
  tolerancePercent: number; // itki %
  netPureWeight: number;
  ratePerGram: number;
  totalPaidAZN: number;
  testMethod: 'X-Ray Spektrometr' | 'Turşu & Daş Sınağı' | 'Sıxlıq / Arximed';
  status: 'Kassa Seyfində' | 'Əritməyə Ayrıldı' | 'Emalatxanaya Göndərildi';
  operator: string;
}

export interface CustomRepairOrder {
  id: string;
  orderNo: string;
  date: string;
  customerName: string;
  customerPhone: string;
  type: 'Fərdi Hazırlanma' | 'Təmir & Bərpa' | 'Ölçü Dəyişdirilməsi' | 'Daş Bərkidilməsi' | 'Təmizləmə & Rodium';
  itemDescription: string;
  targetPurity: GoldPurity;
  estimatedWeightGrams: number;
  customerProvidedGoldGrams: number; // Müştərinin verdiyi qızıl
  stoneDetails?: string;
  jewelerName: string;
  estimatedCost: number;
  depositPaid: number;
  remainingBalance: number;
  status: 'Qəbul edildi' | 'Qızıl Ayrıldı' | 'Usta Masasında' | 'Əyarlanma' | 'Cilalanma / Rodium' | 'Hazırdır';
  deadlineDate: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  finCode: string;
  totalPurchasedGrams: number;
  totalSpentAZN: number;
  preferredPurity: GoldPurity;
  ringSize?: string;
  specialDate?: string; // Evlilik ildönümü və ya Ad günü
  vipTier: 'Standart' | 'Qızıl VIP' | 'Platin VIP';
  notes?: string;
}
