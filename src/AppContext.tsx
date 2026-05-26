import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Equipment, Intervention, Quote, ServiceOrder, MaintenanceAlert, Material, Tool, Invoice, QuoteItem } from './types';
import {
  initialClients,
  initialEquipment,
  initialInterventions,
  initialQuotes,
  initialServiceOrders,
  initialMaintenanceAlerts,
  initialMaterials,
  initialTools,
  initialInvoices
} from './initialData';

interface AppContextType {
  clients: Client[];
  equipment: Equipment[];
  interventions: Intervention[];
  quotes: Quote[];
  serviceOrders: ServiceOrder[];
  alerts: MaintenanceAlert[];
  materials: Material[];
  tools: Tool[];
  invoices: Invoice[];
  
  // Actions
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  
  addEquipment: (eq: Omit<Equipment, 'id'>) => void;
  updateEquipment: (eq: Equipment) => void;
  
  addIntervention: (intervention: Omit<Intervention, 'id'>) => void;
  
  addQuote: (quote: Omit<Quote, 'id' | 'folio'>) => Quote;
  updateQuoteStatus: (id: string, status: Quote['estado']) => void;
  
  addServiceOrder: (so: Omit<ServiceOrder, 'id' | 'folio'>) => ServiceOrder;
  updateServiceOrderStatus: (id: string, status: ServiceOrder['estado']) => void;
  addAnticipoToOS: (id: string, cantidad: number) => void;
  
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterialStock: (id: string, newStock: number) => void;
  
  updateToolAssignment: (id: string, tecnico?: string) => void;
  addTool: (tool: Omit<Tool, 'id'>) => void;
  
  generateInvoiceFromOS: (osFolio: string) => Invoice | null;
  updateInvoicePaymentStatus: (id: string, estado: Invoice['estadoPago']) => void;
  
  toggleAlertStatus: (id: string) => void;
  createServiceFromAlert: (alertId: string, tecnico: string, fecha: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe load from localStorage or fallback
  const loadState = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`climages_` + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [clients, setClients] = useState<Client[]>(() => loadState('clients', initialClients));
  const [equipment, setEquipment] = useState<Equipment[]>(() => loadState('equipment', initialEquipment));
  const [interventions, setInterventions] = useState<Intervention[]>(() => loadState('interventions', initialInterventions));
  const [quotes, setQuotes] = useState<Quote[]>(() => loadState('quotes', initialQuotes));
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(() => loadState('serviceOrders', initialServiceOrders));
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(() => loadState('alerts', initialMaintenanceAlerts));
  const [materials, setMaterials] = useState<Material[]>(() => loadState('materials', initialMaterials));
  const [tools, setTools] = useState<Tool[]>(() => loadState('tools', initialTools));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadState('invoices', initialInvoices));

  // Sync back to localStorage
  useEffect(() => { localStorage.setItem('climages_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('climages_equipment', JSON.stringify(equipment)); }, [equipment]);
  useEffect(() => { localStorage.setItem('climages_interventions', JSON.stringify(interventions)); }, [interventions]);
  useEffect(() => { localStorage.setItem('climages_quotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('climages_serviceOrders', JSON.stringify(serviceOrders)); }, [serviceOrders]);
  useEffect(() => { localStorage.setItem('climages_alerts', JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { localStorage.setItem('climages_materials', JSON.stringify(materials)); }, [materials]);
  useEffect(() => { localStorage.setItem('climages_tools', JSON.stringify(tools)); }, [tools]);
  useEffect(() => { localStorage.setItem('climages_invoices', JSON.stringify(invoices)); }, [invoices]);

  // Actions
  const addClient = (newClient: Omit<Client, 'id'>) => {
    const client: Client = {
      ...newClient,
      id: `cli-${Date.now()}`
    };
    setClients(prev => [...prev, client]);
  };

  const updateClient = (updated: Client) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const addEquipment = (newEq: Omit<Equipment, 'id'>) => {
    const eq: Equipment = {
      ...newEq,
      id: `eq-${Date.now()}`
    };
    setEquipment(prev => [...prev, eq]);
  };

  const updateEquipment = (updated: Equipment) => {
    setEquipment(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const addIntervention = (newInter: Omit<Intervention, 'id'>) => {
    const inter: Intervention = {
      ...newInter,
      id: `int-${Date.now()}`
    };
    setInterventions(prev => [...prev, inter]);
  };

  const addQuote = (newQuote: Omit<Quote, 'id' | 'folio'>): Quote => {
    // Foliador automático: COT-YYYY-XXX
    const añoActual = new Date().getFullYear();
    const totalQuotesEsteAño = quotes.filter(q => q.folio.startsWith(`COT-${añoActual}`)).length;
    const consecutivo = String(totalQuotesEsteAño + 1).padStart(3, '0');
    const folioStr = `COT-${añoActual}-${consecutivo}`;

    const quote: Quote = {
      ...newQuote,
      id: `q-${Date.now()}`,
      folio: folioStr
    };
    setQuotes(prev => [...prev, quote]);
    return quote;
  };

  const updateQuoteStatus = (id: string, estado: Quote['estado']) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, estado } : q));
  };

  const addServiceOrder = (newSo: Omit<ServiceOrder, 'id' | 'folio'>): ServiceOrder => {
    // Foliador técnico: RT-YYYY-XXX
    const añoActual = new Date().getFullYear();
    const totalRT = serviceOrders.filter(so => so.folio.startsWith(`RT-${añoActual}`)).length;
    const consecutivo = String(totalRT + 1).padStart(3, '0');
    const folioStr = `RT-${añoActual}-${consecutivo}`;

    const so: ServiceOrder = {
      ...newSo,
      id: `so-${Date.now()}`,
      folio: folioStr
    };
    setServiceOrders(prev => [...prev, so]);
    return so;
  };

  const updateServiceOrderStatus = (id: string, estado: ServiceOrder['estado']) => {
    setServiceOrders(prev => {
      const updated = prev.map(so => {
        if (so.id === id) {
          const finalState: Partial<ServiceOrder> = { estado };
          if (estado === 'Terminada') {
            finalState.fechaFin = new Date().toISOString().split('T')[0];
            
            // Auto-generar intervención en el expediente clínico (Hoja de Vida) del equipo!
            const equipmentItem = equipment.find(e => e.id === so.equipmentId);
            if (equipmentItem) {
              const currentInterventions = interventions;
              const alreadyRegistered = currentInterventions.some(i => i.ordenServicioFolio === so.folio);
              if (!alreadyRegistered) {
                // Registrar intervención de forma diferida o directa
                setTimeout(() => {
                  addIntervention({
                    equipmentId: so.equipmentId,
                    fecha: new Date().toISOString().split('T')[0],
                    trabajoRealizado: so.descripcionServicio,
                    tecnico: so.tecnicoAsignado,
                    ordenServicioFolio: so.folio
                  });
                }, 50);
              }
            }
          }
          return { ...so, ...finalState };
        }
        return so;
      });
      return updated;
    });
  };

  const addAnticipoToOS = (id: string, cantidad: number) => {
    setServiceOrders(prev => prev.map(so => {
      if (so.id === id) {
        const nuevosAnticipos = Number(so.anticiposRecibidos || 0) + Number(cantidad);
        return {
          ...so,
          anticiposRecibidos: Math.min(so.total, nuevosAnticipos)
        };
      }
      return so;
    }));
  };

  const addMaterial = (newMat: Omit<Material, 'id'>) => {
    const mat: Material = {
      ...newMat,
      id: `mat-${Date.now()}`
    };
    setMaterials(prev => [...prev, mat]);
  };

  const updateMaterialStock = (id: string, newStock: number) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, stock: Math.max(0, newStock) } : m));
  };

  const updateToolAssignment = (id: string, tecnico?: string) => {
    setTools(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          estado: tecnico ? 'Asignado' : 'Disponible',
          tecnicoAsignado: tecnico || undefined,
          fechaAsignacion: tecnico ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return t;
    }));
  };

  const addTool = (newTool: Omit<Tool, 'id'>) => {
    const t: Tool = {
      ...newTool,
      id: `tol-${Date.now()}`
    };
    setTools(prev => [...prev, t]);
  };

  const generateInvoiceFromOS = (osFolio: string): Invoice | null => {
    const os = serviceOrders.find(o => o.folio === osFolio);
    if (!os) return null;

    // Check if invoice already exists
    const existing = invoices.find(inv => inv.ordenServicioFolio === osFolio);
    if (existing) return existing;

    const subtotal = Number((os.total / 1.16).toFixed(2));
    const iva = Number((os.total - subtotal).toFixed(2));
    
    // Consecutivo Factura
    const consecutivo = String(invoices.length + 1).padStart(3, '0');
    const invoiceFolio = `FAC-${consecutivo}`;

    // Fecha de vencimiento default: 30 días después
    const hoy = new Date();
    const vencimiento = new Date();
    vencimiento.setDate(hoy.getDate() + 30);

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      folio: invoiceFolio,
      ordenServicioFolio: os.htmlId || os.folio,
      clientId: os.clientId,
      fechaEmision: hoy.toISOString().split('T')[0],
      subtotal,
      iva,
      total: os.total,
      estadoPago: 'Pendiente',
      fechaVencimiento: vencimiento.toISOString().split('T')[0]
    };

    setInvoices(prev => [...prev, newInvoice]);
    setServiceOrders(prev => prev.map(s => s.id === os.id ? { ...s, facturado: true, facturaFolio: invoiceFolio, estado: 'Facturada' } : s));
    return newInvoice;
  };

  const updateInvoicePaymentStatus = (id: string, estado: Invoice['estadoPago']) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, estadoPago: estado } : inv));
  };

  const toggleAlertStatus = (id: string) => {
    setAlerts(prev => prev.map(al => al.id === id ? { ...al, estado: al.estado === 'Pendiente' ? 'Atendido' : 'Pendiente' } : al));
  };

  const createServiceFromAlert = (alertId: string, tecnico: string, fecha: string) => {
    const al = alerts.find(a => a.id === alertId);
    if (!al) return;

    // Buscar información del equipo
    const eq = equipment.find(e => e.id === al.equipmentId);
    if (!eq) return;

    // Crear OS vinculada a la alerta de mantenimiento
    addServiceOrder({
      cotizacionFolio: 'ALERTA-PREV',
      clientId: al.clientId,
      equipmentId: al.equipmentId,
      fechaProgramada: fecha,
      tecnicoAsignado: tecnico,
      descripcionServicio: al.tipoServicio,
      tipoMantenimiento: 'Preventivo',
      estado: 'Programada',
      total: 1800, // Costo estándar sugerido para preventivo
      anticiposRecibidos: 0,
      facturado: false
    });

    // Marcar alerta como Atendida
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, estado: 'Atendido' } : a));
  };

  return (
    <AppContext.Provider value={{
      clients,
      equipment,
      interventions,
      quotes,
      serviceOrders,
      alerts,
      materials,
      tools,
      invoices,
      addClient,
      updateClient,
      addEquipment,
      updateEquipment,
      addIntervention,
      addQuote,
      updateQuoteStatus,
      addServiceOrder,
      updateServiceOrderStatus,
      addAnticipoToOS,
      addMaterial,
      updateMaterialStock,
      updateToolAssignment,
      addTool,
      generateInvoiceFromOS,
      updateInvoicePaymentStatus,
      toggleAlertStatus,
      createServiceFromAlert
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
