import { JewelryItem, GoldRates, SaleTransaction, ScrapGoldEntry, CustomRepairOrder, Customer } from '../types/jewelry';

export const INITIAL_GOLD_RATES: GoldRates = {
  spotGoldUSDPerOz: 2748.50,
  usdAznRate: 1.7000,
  gram999Azn: 150.25,
  gram750Azn: 112.70,
  gram585Azn: 87.90,
  scrapBuy585Azn: 83.50,
  scrapBuy750Azn: 107.80,
  scrapBuy999Azn: 145.50,
  lastUpdated: '17 Oktyabr 2026, 12:15 (Bakı Vaxtı)'
};

export const INITIAL_BRANCHES = [
  { id: 'b1', name: 'Nizami Butik #104 (Mərkəz)', address: 'Nizami küç. 84, Bakı', vaultGrams: 4850.40, showcases: 8 },
  { id: 'b2', name: 'Gənclik Mall Zərgərlik Qalereyası', address: 'Fətəli Xan Xoyski pr. 38', vaultGrams: 3240.20, showcases: 6 },
  { id: 'b3', name: 'Mərkəzi Emalatxana & Seyf Anbarı', address: '28 May küç. 19', vaultGrams: 12600.00, showcases: 2 }
];

export const INITIAL_JEWELRY_ITEMS: JewelryItem[] = [
  {
    id: 'item-1',
    sku: 'ZQ-750-0192',
    barcode: '8690182400192',
    name: 'Brilliant Təkqaş Solitaire Üzük 1.50 ct (Ağ Qızıl)',
    category: 'Üzük',
    purity: '750',
    tone: 'Ağ Qızıl',
    grossWeight: 4.85,
    stoneWeight: 0.30, // 1.50 karat brilliant ~ 0.30 qram
    netGoldWeight: 4.55,
    laborFeePerGram: 35.0,
    laborFeeTotal: 159.25,
    metalCost: 512.78, // 4.55 * 112.70
    retailPrice: 4850.00, // Premium diamond solitaire
    location: 'Vitrin A-01 (Solitaire Eksklüziv)',
    branchId: 'b1',
    branchName: 'Nizami Butik #104 (Mərkəz)',
    status: 'Satışda',
    stoneDetails: {
      gemType: 'Brilliant',
      carat: 1.50,
      clarity: 'VVS1',
      color: 'D (Colorless)',
      cut: 'Excellent Round Brilliant',
      certificateNo: 'GIA-249018820',
      labName: 'GIA (Gemological Institute of America)'
    },
    manufacturer: 'İtaliya (Valenza)',
    size: '17.0',
    imageUrl: '/src/assets/images/jewelry_diamond_ring_1792265223652.jpg',
    createdAt: '2026-10-10'
  },
  {
    id: 'item-2',
    sku: 'ZQ-750-0844',
    barcode: '8690182400844',
    name: 'İtalyan Hörmə Zəncir Boyunbağı (Sarı Qızıl 750)',
    category: 'Boyunbağı & Zəncir',
    purity: '750',
    tone: 'Sarı Qızıl',
    grossWeight: 28.40,
    stoneWeight: 0.00,
    netGoldWeight: 28.40,
    laborFeePerGram: 18.0,
    laborFeeTotal: 511.20,
    metalCost: 3200.68,
    retailPrice: 4250.00,
    location: 'Vitrin B-03 (İtalyan Zəncirlər)',
    branchId: 'b1',
    branchName: 'Nizami Butik #104 (Mərkəz)',
    status: 'Satışda',
    stoneDetails: {
      gemType: 'Daşsız'
    },
    manufacturer: 'İtaliya (Vicenza)',
    size: '55 sm',
    imageUrl: '/src/assets/images/jewelry_gold_necklace_1792265224211.jpg',
    createdAt: '2026-10-12'
  },
  {
    id: 'item-3',
    sku: 'ZQ-750-0431',
    barcode: '8690182400431',
    name: 'Təbii Zümrüd və Brilliant Asma Sırğalar',
    category: 'Sırğa',
    purity: '750',
    tone: 'Sarı Qızıl',
    grossWeight: 8.65,
    stoneWeight: 1.15,
    netGoldWeight: 7.50,
    laborFeePerGram: 45.0,
    laborFeeTotal: 337.50,
    metalCost: 845.25,
    retailPrice: 3800.00,
    location: 'Vitrin A-03 (Qiymətli Daşlar)',
    branchId: 'b1',
    branchName: 'Nizami Butik #104 (Mərkəz)',
    status: 'Satışda',
    stoneDetails: {
      gemType: 'Təbii Daş (Zümrüd/Yaqut)',
      carat: 2.40, // 2x Zümrüd + halo brilliantlar
      clarity: 'Natural Vivid Green (Kolumbiya)',
      color: 'Deep Emerald Green',
      cut: 'Emerald Cut & Round Pave',
      certificateNo: 'HRD-ANT-89211',
      labName: 'HRD Antwerp'
    },
    manufacturer: 'Yerli Zərgər Əl İşi (Usta Əhməd)',
    imageUrl: '/src/assets/images/jewelry_emerald_earrings_1792265224391.jpg',
    createdAt: '2026-10-14'
  },
  {
    id: 'item-4',
    sku: 'ZQ-585-0612',
    barcode: '8690182400612',
    name: 'Klassik Brilliant Pave Qolbaq (Rozovı Qızıl 585)',
    category: 'Qolbaq',
    purity: '585',
    tone: 'Qırmızı Qızıl (Rozovı)',
    grossWeight: 14.20,
    stoneWeight: 0.25,
    netGoldWeight: 13.95,
    laborFeePerGram: 22.0,
    laborFeeTotal: 306.90,
    metalCost: 1226.20,
    retailPrice: 2150.00,
    location: 'Vitrin C-01 (Modern Qolbaqlar)',
    branchId: 'b2',
    branchName: 'Gənclik Mall Zərgərlik Qalereyası',
    status: 'Satışda',
    stoneDetails: {
      gemType: 'Brilliant',
      carat: 0.65,
      clarity: 'VS2',
      color: 'F',
      cut: 'Round Micro-Pave',
      certificateNo: 'ZQ-LAB-1029',
      labName: 'ZərQızıl Daxili Laboratoriya'
    },
    manufacturer: 'Türkiyə (İstanbul Qapalıçarşı)',
    size: '18 sm',
    imageUrl: '/src/assets/images/jewelry_gold_bracelet_1792265224446.jpg',
    createdAt: '2026-10-15'
  },
  {
    id: 'item-5',
    sku: 'ZQ-999-0010',
    barcode: '8690182400010',
    name: 'İsveçrə PAMP Suisse 999.9 İnvestisiya Qızıl Külçəsi (50 qr)',
    category: 'Külçə & Sikkə',
    purity: '999.9',
    tone: 'Sarı Qızıl',
    grossWeight: 50.00,
    stoneWeight: 0.00,
    netGoldWeight: 50.00,
    laborFeePerGram: 2.5,
    laborFeeTotal: 125.00,
    metalCost: 7512.50,
    retailPrice: 7850.00,
    location: 'Kassa Seyfi #1 (Külçələr)',
    branchId: 'b1',
    branchName: 'Nizami Butik #104 (Mərkəz)',
    status: 'Satışda',
    stoneDetails: {
      gemType: 'Daşsız',
      certificateNo: 'PAMP-SUISSE-998124',
      labName: 'PAMP Suisse Assayer'
    },
    manufacturer: 'İsveçrə (PAMP)',
    imageUrl: '/src/assets/images/jewelry_gold_necklace_1792265224211.jpg',
    createdAt: '2026-10-16'
  },
  {
    id: 'item-6',
    sku: 'ZQ-585-0914',
    barcode: '8690182400914',
    name: 'Dubay İpək Həsir Qolbaq və Üzük Dəsti (585)',
    category: 'Zərgərlik Dəsti',
    purity: '585',
    tone: 'Sarı Qızıl',
    grossWeight: 32.80,
    stoneWeight: 0.00,
    netGoldWeight: 32.80,
    laborFeePerGram: 16.0,
    laborFeeTotal: 524.80,
    metalCost: 2883.12,
    retailPrice: 3890.00,
    location: 'Vitrin D-02 (Dubay Qızılları)',
    branchId: 'b2',
    branchName: 'Gənclik Mall Zərgərlik Qalereyası',
    status: 'Satışda',
    stoneDetails: {
      gemType: 'Daşsız'
    },
    manufacturer: 'Dubay (Deira Gold Souk)',
    size: '19 sm / Üzük: 18.0',
    imageUrl: '/src/assets/images/jewelry_gold_bracelet_1792265224446.jpg',
    createdAt: '2026-10-16'
  }
];

export const INITIAL_SALES: SaleTransaction[] = [
  {
    id: 'sale-1092',
    invoiceNo: 'ZQ-INV-2026-1092',
    date: '2026-10-17 11:34',
    customerName: 'Aysel Məmmədova',
    customerPhone: '+994 50 312 44 88',
    items: [
      {
        item: INITIAL_JEWELRY_ITEMS[0],
        quantity: 1,
        unitPrice: 4850.00,
        discountAZN: 250.00,
        finalPrice: 4600.00
      }
    ],
    totalGrossWeight: 4.85,
    totalNetGoldWeight: 4.55,
    subtotal: 4850.00,
    discountTotal: 250.00,
    oldGoldTradeIn: {
      purity: '585',
      grossWeight: 14.50,
      dirtToleranceGrams: 0.30,
      netScrapWeight: 14.20,
      ratePerGram: 83.50,
      totalCredit: 1185.70,
      customerNote: '2 ədəd köhnə qırıq zəncir və sırğa qəbul edildi'
    },
    netPayable: 3414.30, // 4600 - 1185.70
    paymentMethod: 'Qarışıq', // Barter + Bank Kartı
    cashierName: 'Rauf Əliyev (Baş Satıcı)',
    branchName: 'Nizami Butik #104 (Mərkəz)',
    receiptNotes: 'GIA sertifikatı və ömürlük cilalanma zəmanəti təqdim olundu.'
  },
  {
    id: 'sale-1091',
    invoiceNo: 'ZQ-INV-2026-1091',
    date: '2026-10-16 17:20',
    customerName: 'Kamran Babayev',
    customerPhone: '+994 55 890 12 34',
    items: [
      {
        item: INITIAL_JEWELRY_ITEMS[3],
        quantity: 1,
        unitPrice: 2150.00,
        discountAZN: 50.00,
        finalPrice: 2100.00
      }
    ],
    totalGrossWeight: 14.20,
    totalNetGoldWeight: 13.95,
    subtotal: 2150.00,
    discountTotal: 50.00,
    netPayable: 2100.00,
    paymentMethod: 'BirKart Taksit',
    cashierName: 'Leyla Qasımova',
    branchName: 'Gənclik Mall Zərgərlik Qalereyası'
  }
];

export const INITIAL_SCRAP_ENTRIES: ScrapGoldEntry[] = [
  {
    id: 'scrap-1',
    entryNo: 'LOM-2026-048',
    date: '2026-10-17 10:15',
    customerName: 'Samir Vəliyev',
    customerFin: '5XZ9L21',
    customerPhone: '+994 70 234 56 78',
    purity: '585',
    grossWeight: 18.40,
    tolerancePercent: 2.0,
    netPureWeight: 18.03,
    ratePerGram: 83.50,
    totalPaidAZN: 1505.50,
    testMethod: 'X-Ray Spektrometr',
    status: 'Kassa Seyfində',
    operator: 'Rauf Əliyev'
  },
  {
    id: 'scrap-2',
    entryNo: 'LOM-2026-047',
    date: '2026-10-16 15:40',
    customerName: 'Nigar Hüseynova',
    customerFin: '3AB4K88',
    customerPhone: '+994 50 671 00 22',
    purity: '750',
    grossWeight: 12.60,
    tolerancePercent: 1.5,
    netPureWeight: 12.41,
    ratePerGram: 107.80,
    totalPaidAZN: 1337.80,
    testMethod: 'Turşu & Daş Sınağı',
    status: 'Əritməyə Ayrıldı',
    operator: 'Kamal Usta'
  }
];

export const INITIAL_CUSTOM_ORDERS: CustomRepairOrder[] = [
  {
    id: 'order-1',
    orderNo: 'ORD-2026-094',
    date: '2026-10-15',
    customerName: 'Elmir Nəsirov',
    customerPhone: '+994 50 411 22 33',
    type: 'Fərdi Hazırlanma',
    itemDescription: 'Qoşa Nişan Üzükləri (İçərisində ad və tarix lazer oyma: Elmir & Sevinc 2026)',
    targetPurity: '750',
    estimatedWeightGrams: 16.50,
    customerProvidedGoldGrams: 12.00,
    stoneDetails: 'Gəlin üzüyündə 5 ədəd brilliant (0.15 ct)',
    jewelerName: 'Usta Vüqar (Baş Modelçi)',
    estimatedCost: 1850.00,
    depositPaid: 800.00,
    remainingBalance: 1050.00,
    status: 'Usta Masasında',
    deadlineDate: '2026-10-24'
  },
  {
    id: 'order-2',
    orderNo: 'ORD-2026-095',
    date: '2026-10-16',
    customerName: 'Gülşən Tağıyeva',
    customerPhone: '+994 55 330 99 11',
    type: 'Təmir & Bərpa',
    itemDescription: 'Antik Rozovı Sırğanın kilid mexanizminin dəyişdirilməsi və rodium cilalanması',
    targetPurity: '585',
    estimatedWeightGrams: 7.20,
    customerProvidedGoldGrams: 0.00,
    stoneDetails: 'Təbii Yaqut daşı',
    jewelerName: 'Usta Rəşid',
    estimatedCost: 120.00,
    depositPaid: 50.00,
    remainingBalance: 70.00,
    status: 'Hazırdır',
    deadlineDate: '2026-10-18'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    fullName: 'Aysel Məmmədova',
    phone: '+994 50 312 44 88',
    email: 'aysel.m@gmail.com',
    finCode: '6JK98P1',
    totalPurchasedGrams: 48.50,
    totalSpentAZN: 8450.00,
    preferredPurity: '750',
    ringSize: '17.0',
    specialDate: '14 Fevral (Evlilik ildönümü)',
    vipTier: 'Platin VIP',
    notes: 'Yalnız GIA sertifikatlı ağ qızıl və təkqaş modellərə üstünlük verir.'
  },
  {
    id: 'c-2',
    fullName: 'Kamran Babayev',
    phone: '+994 55 890 12 34',
    email: 'kamran_b@mail.ru',
    finCode: '4YT10M4',
    totalPurchasedGrams: 32.20,
    totalSpentAZN: 4800.00,
    preferredPurity: '585',
    ringSize: '20.0',
    specialDate: '28 May (Ad günü)',
    vipTier: 'Qızıl VIP',
    notes: 'Qolbaq və İtalyan kişi zəncirləri alır.'
  },
  {
    id: 'c-3',
    fullName: 'Samir Vəliyev',
    phone: '+994 70 234 56 78',
    email: 'samir.valiyev@code.az',
    finCode: '5XZ9L21',
    totalPurchasedGrams: 15.00,
    totalSpentAZN: 2200.00,
    preferredPurity: '585',
    ringSize: '18.5',
    vipTier: 'Standart',
    notes: 'Köhnə qızıl barterinə maraq göstərir.'
  }
];
