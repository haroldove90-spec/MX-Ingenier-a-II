import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { DollarSign, FileText, CheckCircle, TrendingUp, AlertTriangle, Scale, Clock, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

export default function SummaryMetrics() {
  const { serviceOrders, quotes, invoices, clients, addAnticipoToOS, updateInvoicePaymentStatus } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  // 1. Ventas del mes (all Service orders or paid invoices)
  const totalCotizacionesAprobadas = quotes
    .filter(q => q.estado === 'Aprobado')
    .reduce((sum, q) => sum + q.total, 0);

  const totalRecaudadoMasPendiente = serviceOrders
    .reduce((sum, so) => sum + so.total, 0);

  const totalAnticipos = serviceOrders
    .reduce((sum, so) => sum + (so.anticiposRecibidos || 0), 0);

  // 2. Cotizaciones pendientes de aprobación
  const cotizacionesPendientes = quotes.filter(q => q.estado === 'Pendiente');
  const totalCotizacionesPendientes = cotizacionesPendientes.reduce((sum, q) => sum + q.total, 0);

  // 3. Órdenes de servicio activas (Programadas o En Proceso)
  const ordenesActivas = serviceOrders.filter(so => so.estado === 'Programada' || so.estado === 'En Proceso');
  const countOrdenesActivas = ordenesActivas.length;
  const valorOrdenesActivas = ordenesActivas.reduce((sum, so) => sum + so.total, 0);

  // 4. Cuentas por Cobrar (Invoices that are Pendiente or Vencida)
  const cuentasPorCobrarInvoices = invoices.filter(inv => inv.estadoPago === 'Pendiente' || inv.estadoPago === 'Vencida');
  const totalCuentasPorCobrar = cuentasPorCobrarInvoices.reduce((sum, inv) => sum + inv.total, 0);

  // Alertas de vencimiento: Facturas vencidas (fecha de vencimiento < hoy)
  const hoyStr = new Date().toISOString().split('T')[0];
  const facturasVencidas = invoices.filter(inv => inv.estadoPago === 'Pendiente' && inv.fechaVencimiento < hoyStr);
  const totalVencido = facturasVencidas.reduce((sum, inv) => sum + inv.total, 0);

  // Format currency
  const formatMx = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  // Safe client search
  const getClientName = (id: string) => {
    return clients.find(c => c.id === id)?.razonSocial || 'Cliente Desconocido';
  };

  return (
    <div className="space-y-8" id="metrics-root">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800" id="metrics-title">Métricas en Tiempo Real</h2>
        <p className="text-sm text-slate-500">Estado financiero y operativo del mes en curso.</p>
      </div>

      {/* Grid de Kpis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="kpi-grid">
        {/* KPI 1 */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between"
          id="kpi-ventas"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Trabajos Contratados</span>
            <div className="text-2xl font-bold text-slate-800">{formatMx(totalRecaudadoMasPendiente)}</div>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 animate-pulse" /> 100% de la facturación en OS
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </motion.div>

        {/* KPI 2 */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between"
          id="kpi-cotizaciones"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Cotizaciones Pendientes</span>
            <div className="text-2xl font-bold text-amber-600">{formatMx(totalCotizacionesPendientes)}</div>
            <span className="text-xs text-slate-500 font-medium">
              {cotizacionesPendientes.length} propuestas por aprobar
            </span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <FileText className="w-6 h-6" />
          </div>
        </motion.div>

        {/* KPI 3 */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between"
          id="kpi-os-activas"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Órdenes Activas</span>
            <div className="text-2xl font-bold text-red-600">{countOrdenesActivas}</div>
            <span className="text-xs text-red-600 font-semibold block">
              Valor: {formatMx(valorOrdenesActivas)}
            </span>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </motion.div>

        {/* KPI 4 */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between"
          id="kpi-cxc"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Cuentas por Cobrar</span>
            <div className="text-2xl font-bold text-rose-600">{formatMx(totalCuentasPorCobrar)}</div>
            {totalVencido > 0 ? (
              <span className="text-xs text-rose-600 font-bold flex items-center gap-1 animate-bounce">
                <AlertTriangle className="w-3.5" /> Vencidos: {formatMx(totalVencido)}
              </span>
            ) : (
              <span className="text-xs text-emerald-600 font-medium">Sin deudas vencidas</span>
            )}
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
            <Scale className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Módulo de Anticipos y Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts">
        {/* Card Anticipos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 lg:col-span-1" id="anticipos-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Anticipos Recibidos</h3>
              <p className="text-xs text-slate-400 font-mono">Fondo de liquidez para proyectos</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-1 bg-black/5">
            <span className="text-xs text-slate-500 block">Total de Anticipos Cobrados</span>
            <span className="text-3xl font-extrabold text-red-700">{formatMx(totalAnticipos)}</span>
          </div>

          {/* List of services with pending/paid advances */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Anticipos por Servicio</span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {serviceOrders.map(so => {
                const requiereAnticipo = so.total * 0.5; // Supuesto 50%
                const faltante = Math.max(0, so.total - (so.anticiposRecibidos || 0));
                return (
                  <div key={so.id} className="p-2.5 bg-slate-50 rounded-xl text-xs flex flex-col gap-1.5 border border-slate-100">
                    <div className="flex justify-between items-center font-bold text-slate-700">
                      <span>{so.folio} ({getClientName(so.clientId).substring(0, 20)}...)</span>
                      <span className="font-mono text-red-650 font-bold">{formatMx(so.anticiposRecibidos || 0)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Total: {formatMx(so.total)}</span>
                      <span>Restante: {formatMx(faltante)}</span>
                    </div>
                    {/* Progress Bar of payment */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((so.anticiposRecibidos || 0) / so.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visualizador Gráfico de Ventas / Cartera */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between lg:col-span-2" id="gráfico-ventas-card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Análisis de Cartera y Facturación</h3>
              <p className="text-xs text-slate-400">Distribución de estados operativos y cobros.</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">May 2026</span>
          </div>

          {/* Custom SVG Graphic */}
          <div className="my-6 h-56 flex items-end justify-between px-4 pb-4 border-b border-slate-100 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 bottom-4 border-t border-slate-100 h-0 w-full"></div>
            <div className="absolute inset-x-0 bottom-16 border-t border-slate-100 h-0 w-full"></div>
            <div className="absolute inset-x-0 bottom-28 border-t border-slate-100 h-0 w-full"></div>
            <div className="absolute inset-x-0 bottom-40 border-t border-slate-100 h-0 w-full"></div>

            {/* Bars */}
            <div className="flex flex-col items-center gap-2 group z-10 w-1/4">
              <span className="text-[10px] font-mono font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatMx(totalRecaudadoMasPendiente)}
              </span>
              <div
                className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg shadow-sm group-hover:from-emerald-600 group-hover:to-emerald-500 transition-all duration-300"
                style={{ height: '140px' }}
              ></div>
              <span className="text-[11px] font-medium text-slate-500 text-center">Órdenes Totales</span>
            </div>

            <div className="flex flex-col items-center gap-2 group z-10 w-1/4">
              <span className="text-[10px] font-mono font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatMx(totalCotizacionesPendientes)}
              </span>
              <div
                className="w-12 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg shadow-sm group-hover:from-amber-500 group-hover:to-amber-400 transition-all duration-300"
                style={{ height: `${Math.min(160, Math.max(20, (totalCotizacionesPendientes / (totalRecaudadoMasPendiente || 1)) * 140))}px` }}
              ></div>
              <span className="text-[11px] font-medium text-slate-500 text-center">Coti. Pendientes</span>
            </div>

            <div className="flex flex-col items-center gap-2 group z-10 w-1/4">
              <span className="text-[10px] font-mono font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatMx(totalAnticipos)}
              </span>
              <div
                className="w-12 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg shadow-sm group-hover:from-red-600 group-hover:to-red-500 transition-all duration-300"
                style={{ height: `${Math.min(160, Math.max(15, (totalAnticipos / (totalRecaudadoMasPendiente || 1)) * 140))}px` }}
              ></div>
              <span className="text-[11px] font-medium text-slate-500 text-center font-bold">Anticipos</span>
            </div>

            <div className="flex flex-col items-center gap-2 group z-10 w-1/4">
              <span className="text-[10px] font-mono font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatMx(totalCuentasPorCobrar)}
              </span>
              <div
                className="w-12 bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-lg shadow-sm group-hover:from-rose-600 group-hover:to-rose-500 transition-all duration-300"
                style={{ height: `${Math.min(160, Math.max(10, (totalCuentasPorCobrar / (totalRecaudadoMasPendiente || 1)) * 140))}px` }}
              ></div>
              <span className="text-[11px] font-medium text-slate-500 text-center">CxC Clientes</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Operaciones</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span> Cotizaciones</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> Depósitos</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span> Saldos por Cobrar</span>
          </div>
        </div>
      </div>

      {/* Reporte de Cuentas por Cobrar & Alertas de Vencimiento */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100" id="cxc-report">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Clock className="text-rose-500 w-5 h-5" /> Reporte de Cuentas por Cobrar (Saldos Pendientes)
            </h3>
            <p className="text-xs text-slate-500">Listado detallado de facturas emitidas pendientes de pago.</p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full">
              Pérdida en Riesgo: {formatMx(totalCuentasPorCobrar)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-3">Factura</th>
                <th className="p-3">Órden Origen</th>
                <th className="p-3">Razón Social Cliente</th>
                <th className="p-3">Fecha Emisión</th>
                <th className="p-3">Vencimiento</th>
                <th className="p-3">Monto Total</th>
                <th className="p-3">Estatus</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {cuentasPorCobrarInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400 font-medium">
                    No hay cuentas por cobrar pendientes. ¡Todo al corriente!
                  </td>
                </tr>
              ) : (
                cuentasPorCobrarInvoices.map(inv => {
                  const esVencida = inv.fechaVencimiento < hoyStr;
                  return (
                    <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-semibold text-slate-700">{inv.folio}</td>
                      <td className="p-3 font-mono text-slate-500">{inv.ordenServicioFolio}</td>
                      <td className="p-3 text-slate-800 font-semibold">{getClientName(inv.clientId)}</td>
                      <td className="p-3 text-slate-600">{inv.fechaEmision}</td>
                      <td className="p-3 font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${esVencida ? 'text-rose-600 bg-rose-50' : 'text-slate-600'}`}>
                          {inv.fechaVencimiento} {esVencida && '⚠️ (Vencida)'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700">{formatMx(inv.total)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          esVencida || inv.estadoPago === 'Vencida'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {esVencida ? 'Vencida' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv.id);
                            setPaymentAmount(String(inv.total));
                          }}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium text-[11px] transition-colors"
                        >
                          Marcar Pago
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Registrar Pago de Factura */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4"
          >
            <h3 className="font-bold text-slate-800">Registrar Pago Recibido</h3>
            <p className="text-xs text-slate-500">Marque la factura seleccionada como pagada para depurar el reporte de Cuentas por Cobrar.</p>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
              <div>Factura: <b className="font-mono">{invoices.find(i => i.id === selectedInvoice)?.folio}</b></div>
              <div>Cliente: <b>{getClientName(invoices.find(i => i.id === selectedInvoice)?.clientId || '')}</b></div>
              <div>Monto: <b className="font-mono text-emerald-600">{formatMx(invoices.find(i => i.id === selectedInvoice)?.total || 0)}</b></div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  updateInvoicePaymentStatus(selectedInvoice, 'Pagada');
                  setSelectedInvoice(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Confirmar Pago Completo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
