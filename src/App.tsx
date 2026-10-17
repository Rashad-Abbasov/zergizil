/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  JewelryItem, 
  GoldRates, 
  SaleTransaction, 
  SaleItem, 
  ScrapGoldEntry, 
  CustomRepairOrder, 
  Customer 
} from './types/jewelry';
import { 
  INITIAL_GOLD_RATES, 
  INITIAL_BRANCHES, 
  INITIAL_JEWELRY_ITEMS, 
  INITIAL_SALES, 
  INITIAL_SCRAP_ENTRIES, 
  INITIAL_CUSTOM_ORDERS, 
  INITIAL_CUSTOMERS 
} from './data/initialData';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { InventoryView } from './components/InventoryView';
import { PosView } from './components/PosView';
import { ScrapGoldView } from './components/ScrapGoldView';
import { WorkshopView } from './components/WorkshopView';
import { CrmView } from './components/CrmView';
import { AnalyticsView } from './components/AnalyticsView';

import { RatesModal } from './components/RatesModal';
import { NewItemModal } from './components/NewItemModal';
import { BarcodeTagModal } from './components/BarcodeTagModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ThemeModal } from './components/ThemeModal';
import { CheckCircle2 } from 'lucide-react';

function ERPContent() {
  const { currentTheme } = useTheme();

  // Core ERP State
  const [activeTab, setActiveTab] = useState<NavTab>('inventory');
  const [rates, setRates] = useState<GoldRates>(INITIAL_GOLD_RATES);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  
  const [items, setItems] = useState<JewelryItem[]>(INITIAL_JEWELRY_ITEMS);
  const [sales, setSales] = useState<SaleTransaction[]>(INITIAL_SALES);
  const [scrapEntries, setScrapEntries] = useState<ScrapGoldEntry[]>(INITIAL_SCRAP_ENTRIES);
  const [customOrders, setCustomOrders] = useState<CustomRepairOrder[]>(INITIAL_CUSTOM_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // POS Cart State
  const [cart, setCart] = useState<SaleItem[]>([]);

  // Modals
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [tagModalItem, setTagModalItem] = useState<JewelryItem | null>(null);
  const [receiptModalSale, setReceiptModalSale] = useState<SaleTransaction | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Inventory Handlers
  const handleAddItem = (newItem: JewelryItem) => {
    setItems(prev => [newItem, ...prev]);
    showToast(`"${newItem.name}" uğurla inventara əlavə olundu.`);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(it => it.id !== itemId));
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
    showToast('Məhsul inventardan silindi.');
  };

  // POS Handlers
  const handleAddToCart = (item: JewelryItem) => {
    const existing = cart.find(ci => ci.item.id === item.id);
    if (existing) {
      showToast('Bu unikal zərgərlik məmulatı artıq səbətdədir.');
      return;
    }
    const newCartItem: SaleItem = {
      item,
      quantity: 1,
      unitPrice: item.retailPrice,
      discountAZN: 0,
      finalPrice: item.retailPrice
    };
    setCart(prev => [...prev, newCartItem]);
    showToast(`"${item.name}" POS səbətinə əlavə edildi.`);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCompleteSale = (newSale: SaleTransaction) => {
    // 1. Mark items as sold
    const soldItemIds = newSale.items.map(si => si.item.id);
    setItems(prev => prev.map(it => {
      if (soldItemIds.includes(it.id)) {
        return { ...it, status: 'Satıldı' };
      }
      return it;
    }));

    // 2. If customer traded in scrap gold, automatically log it in scrap entries!
    if (newSale.oldGoldTradeIn) {
      const newScrap: ScrapGoldEntry = {
        id: `scrap-${Date.now()}`,
        entryNo: `LOM-BARTER-${Math.floor(100 + Math.random() * 900)}`,
        date: newSale.date,
        customerName: newSale.customerName,
        customerFin: 'BARTER-POS',
        customerPhone: newSale.customerPhone,
        purity: newSale.oldGoldTradeIn.purity,
        grossWeight: newSale.oldGoldTradeIn.grossWeight,
        tolerancePercent: 0,
        netPureWeight: newSale.oldGoldTradeIn.netScrapWeight,
        ratePerGram: newSale.oldGoldTradeIn.ratePerGram,
        totalPaidAZN: newSale.oldGoldTradeIn.totalCredit,
        testMethod: 'Turşu & Daş Sınağı',
        status: 'Kassa Seyfində',
        operator: newSale.cashierName
      };
      setScrapEntries(prev => [newScrap, ...prev]);
    }

    // 3. Add to sales history
    setSales(prev => [newSale, ...prev]);

    // 4. Clear cart
    setCart([]);

    // 5. Open Certificate / Receipt Modal
    setReceiptModalSale(newSale);
    showToast(`Satış uğurla tamamlandı. Qaimə: ${newSale.invoiceNo}`);
  };

  // Workshop Status Update
  const handleUpdateOrderStatus = (orderId: string, newStatus: CustomRepairOrder['status']) => {
    setCustomOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    }));
    showToast(`Sifariş statusu yeniləndi: ${newStatus}`);
  };

  // Calculations for Pure Gold in Vault (Total Pure 999.9 Equivalent)
  const totalPureVaultGrams = items.reduce((acc, it) => {
    if (it.status !== 'Satışda') return acc;
    const factor = it.purity === '585' ? 0.585 : it.purity === '750' ? 0.750 : it.purity === '916' ? 0.916 : 0.9999;
    return acc + (it.netGoldWeight * factor);
  }, 0);

  const activeBranchItemsCount = items.filter(it => 
    it.status === 'Satışda' && (selectedBranch === 'all' || it.branchId === selectedBranch)
  ).length;

  return (
    <div className={`min-h-screen ${currentTheme.palette.bg} ${currentTheme.palette.textPrimary} flex flex-col font-sans transition-colors duration-200`}>
      
      {/* Top Header */}
      <Header
        rates={rates}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        onOpenRatesModal={() => setIsRatesModalOpen(true)}
        onOpenNewItemModal={() => setIsNewItemModalOpen(true)}
        onOpenPos={() => setActiveTab('pos')}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main Workspace: Sidebar + Content Viewport */}
      <div className="flex-1 flex w-full">
        
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalItemsCount={activeBranchItemsCount}
          totalPureGrams={totalPureVaultGrams}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          
          {activeTab === 'inventory' && (
            <InventoryView
              items={items}
              rates={rates}
              selectedBranch={selectedBranch}
              onOpenTagModal={(item) => setTagModalItem(item)}
              onAddToCart={(item) => {
                handleAddToCart(item);
                setActiveTab('pos');
              }}
              onDeleteItem={handleDeleteItem}
              onOpenNewItemModal={() => setIsNewItemModalOpen(true)}
            />
          )}

          {activeTab === 'pos' && (
            <PosView
              items={items}
              cart={cart}
              rates={rates}
              customers={customers}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onCompleteSale={handleCompleteSale}
              selectedBranch={selectedBranch}
            />
          )}

          {activeTab === 'scrap' && (
            <ScrapGoldView
              entries={scrapEntries}
              rates={rates}
              onAddEntry={(entry) => {
                setScrapEntries(prev => [entry, ...prev]);
                showToast(`Lom qızıl aktı (${entry.entryNo}) seyfə qəbul edildi.`);
              }}
            />
          )}

          {activeTab === 'workshop' && (
            <WorkshopView
              orders={customOrders}
              onAddOrder={(order) => {
                setCustomOrders(prev => [order, ...prev]);
                showToast(`Zərgər sifarişi (${order.orderNo}) açıldı.`);
              }}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'crm' && (
            <CrmView
              customers={customers}
              onAddCustomer={(customer) => {
                setCustomers(prev => [customer, ...prev]);
                showToast(`Müştəri "${customer.fullName}" VIP bazaya əlavə edildi.`);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              sales={sales}
              items={items}
              scrapEntries={scrapEntries}
              rates={rates}
              onViewReceipt={(sale) => setReceiptModalSale(sale)}
            />
          )}

        </main>
      </div>

      {/* Modals */}
      <RatesModal
        isOpen={isRatesModalOpen}
        onClose={() => setIsRatesModalOpen(false)}
        currentRates={rates}
        onSaveRates={(newRates) => {
          setRates(newRates);
          showToast('Birja və qram məzənnələri uğurla yeniləndi.');
        }}
      />

      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        onAddItem={handleAddItem}
        rates={rates}
        branches={branches}
      />

      <BarcodeTagModal
        item={tagModalItem}
        onClose={() => setTagModalItem(null)}
      />

      <ReceiptModal
        sale={receiptModalSale}
        onClose={() => setReceiptModalSale(null)}
      />

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Non-intrusive Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} px-4 py-3 text-xs font-semibold ${currentTheme.palette.textPrimary} shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2`}>
          <CheckCircle2 className={`h-4 w-4 ${currentTheme.palette.accent} shrink-0`} />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ERPContent />
    </ThemeProvider>
  );
}
