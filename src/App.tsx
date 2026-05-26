/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './AppContext';
import SummaryMetrics from './components/SummaryMetrics';
import OperationsCalendar from './components/OperationsCalendar';
import MaintenanceAlertsModule from './components/MaintenanceAlertsModule';
import ClientsDirectory from './components/ClientsDirectory';
import EquipmentLifeCycle from './components/EquipmentLifeCycle';
import QuotesGenerator from './components/QuotesGenerator';
import ServiceOrdersManager from './components/ServiceOrdersManager';
import MaterialsCatalog from './components/MaterialsCatalog';
import ToolsControl from './components/ToolsControl';
import BillingModule from './components/BillingModule';
import {
  TrendingUp,
  Calendar,
  AlertOctagon,
  Users,
  HeartPulse,
  FileSpreadsheet,
  Network,
  FileText,
  Package,
  Wrench,
  Receipt,
  Menu,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function DashboardShell() {
  const [activeTab, setActiveTab] = useState<string>('metrics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Grouped Navigation Items matching all user requirements
  const navigationGroups = [
    {
      title: 'OPERACIONES Y FINANZAS',
      items: [
        { id: 'metrics', name: 'Métricas Generales', icon: TrendingUp },
        { id: 'calendar', name: 'Calendario de Visitas', icon: Calendar },
        { id: 'alarms', name: 'Alertas Preventivas', icon: AlertOctagon }
      ]
    },
    {
      title: 'RELACIONES Y EQUIPOS',
      items: [
        { id: 'clients', name: 'Directorio de Clientes', icon: Users },
        { id: 'equipment', name: 'Hoja de Vida del Equipo', icon: HeartPulse }
      ]
    },
    {
      title: 'FLUJOS CON FOLIADO',
      items: [
        { id: 'quotes', name: 'Cotizaciones (Foliado Aut.)', icon: FileSpreadsheet },
        { id: 'orders', name: 'Reporte Técnico (Foliado Aut.)', icon: FileText }
      ]
    },
    {
      title: 'ACTIVOS Y CONTROL',
      items: [
        { id: 'materials', name: 'Insumos / Refacciones', icon: Package },
        { id: 'tools', name: 'Custodia de Herramientas', icon: Wrench },
        { id: 'billing', name: 'Facturación CFDI', icon: Receipt }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'metrics':
        return <SummaryMetrics />;
      case 'calendar':
        return <OperationsCalendar />;
      case 'alarms':
        return <MaintenanceAlertsModule />;
      case 'clients':
        return <ClientsDirectory />;
      case 'equipment':
        return <EquipmentLifeCycle />;
      case 'quotes':
        return <QuotesGenerator />;
      case 'orders':
        return <ServiceOrdersManager />;
      case 'materials':
        return <MaterialsCatalog />;
      case 'tools':
        return <ToolsControl />;
      case 'billing':
        return <BillingModule />;
      default:
        return <SummaryMetrics />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-905 font-sans" id="applet-shell">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-black text-white border-r border-zinc-900 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center gap-3 bg-black">
          <img 
            src="https://cossma.com.mx/mxingenieria.jpeg" 
            alt="MX Ingeniería" 
            className="h-12 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
              MX <span className="text-red-600">Ingeniería</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">ERP HVAC v3.0</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                {group.title}
              </span>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const IconComponent = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-xs font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Left glowing dot indicator of template */}
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                      )}
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer info card */}
        <div className="p-4 mt-auto border-t border-zinc-900 bg-black/25">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs text-white">
              AR
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Ing. Alberto Ruiz</p>
              <p className="text-[10px] text-slate-500 font-medium">Superintendente</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-black border-b border-zinc-900 px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2.5">
            <img 
              src="https://cossma.com.mx/mxingenieria.jpeg" 
              alt="MX Ingeniería" 
              className="h-9 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-base font-bold tracking-tight text-white">
              MX <span className="text-red-500">Ingeniería</span>
            </h1>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Content canvas container */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Drawer menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="bg-black text-white w-72 h-full shadow-2xl flex flex-col p-4 space-y-6 overflow-y-auto border-r border-zinc-900"
          >
            <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <img 
                  src="https://cossma.com.mx/mxingenieria.jpeg" 
                  alt="MX Ingeniería" 
                  className="h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <h2 className="text-sm font-bold tracking-tight text-white">
                  MX <span className="text-red-500">Ingeniería</span>
                </h2>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-6">
              {navigationGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest block uppercase px-3">
                    {group.title}
                  </span>
                  <div className="space-y-0.5">
                    {group.items.map(item => {
                      const IconComponent = item.icon;
                      const isSelected = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                            isSelected ? 'bg-red-600 text-white shadow-xs font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          }`}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                          )}
                          <IconComponent className="w-4 h-4" />
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardShell />
    </AppProvider>
  );
}
