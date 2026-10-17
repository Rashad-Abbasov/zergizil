import React from 'react';
import { 
  Gem, 
  ShoppingBag, 
  Hammer, 
  Users, 
  BarChart3, 
  Scale,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type NavTab = 'inventory' | 'pos' | 'scrap' | 'workshop' | 'crm' | 'analytics';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  totalItemsCount: number;
  totalPureGrams: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  totalItemsCount,
  totalPureGrams
}) => {
  const { currentTheme } = useTheme();

  const navItems = [
    {
      id: 'inventory' as NavTab,
      label: 'İnventar & Vitrinlər',
      icon: Gem,
      badge: totalItemsCount.toString()
    },
    {
      id: 'pos' as NavTab,
      label: 'POS Kassa & Satış',
      icon: ShoppingBag,
      badge: 'Canlı'
    },
    {
      id: 'scrap' as NavTab,
      label: 'Köhnə Qızıl (Lom & Barter)',
      icon: Scale,
      badge: undefined
    },
    {
      id: 'workshop' as NavTab,
      label: 'Zərgər Emalatxanası',
      icon: Hammer,
      badge: '2 Aktiv'
    },
    {
      id: 'crm' as NavTab,
      label: 'Müştərilər & VIP Klub',
      icon: Users,
      badge: undefined
    },
    {
      id: 'analytics' as NavTab,
      label: 'Maliyyə & Qızıl Balansı',
      icon: BarChart3,
      badge: undefined
    }
  ];

  return (
    <aside className={`w-64 shrink-0 border-r ${currentTheme.palette.cardBorder} ${currentTheme.palette.card} flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] transition-colors duration-200`}>
      <div className="space-y-6">
        
        {/* Quick Vault Pure Gold Widget */}
        <div className={`rounded-xl border ${currentTheme.palette.cardBorder} ${currentTheme.palette.cardHeader} p-3.5 space-y-2`}>
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className={`h-3 w-3 ${currentTheme.palette.accent}`} />
              Şəbəkə Qızıl Fondu
            </span>
            <span className="font-mono-num text-neutral-400">999.9 Ekv.</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`font-mono-num text-xl font-black ${currentTheme.palette.accent}`}>
              {totalPureGrams.toFixed(2)}
            </span>
            <span className={`text-xs ${currentTheme.palette.textSecondary} font-medium`}>qram xalis</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div className={`bg-gradient-to-r ${currentTheme.palette.gradient} h-full w-[78%] rounded-full`} />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-wider ${currentTheme.palette.textMuted}`}>
            Əsas Modullar
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? `${currentTheme.palette.accentMutedBg} ${currentTheme.palette.accent} border ${currentTheme.palette.accentBorder} font-bold`
                      : `${currentTheme.palette.textSecondary} hover:${currentTheme.palette.textPrimary} hover:${currentTheme.palette.cardHeader}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? currentTheme.palette.accent : currentTheme.palette.textMuted}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-num ${
                      isActive 
                        ? `${currentTheme.palette.accentMutedBg} ${currentTheme.palette.accent} font-bold` 
                        : `${currentTheme.palette.cardHeader} ${currentTheme.palette.textMuted} border ${currentTheme.palette.cardBorder}`
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className={`border-t ${currentTheme.palette.cardBorder} pt-4 space-y-2`}>
        <div className="flex items-center justify-between text-xs">
          <span className={currentTheme.palette.textMuted}>Kassir / Operator:</span>
          <span className={`${currentTheme.palette.textPrimary} font-semibold`}>Rauf Əliyev</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={currentTheme.palette.textMuted}>Cihaz Statusu:</span>
          <span className={currentTheme.palette.textSecondary}>Tərəzi & POS Hazır</span>
        </div>
        <div className={`text-[11px] ${currentTheme.palette.textMuted} pt-2`}>
          ZərQızıl ERP v3.4 · Bakı Zərgərlik
        </div>
      </div>
    </aside>
  );
};
