import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FileText, Download, Check, AlertTriangle, Eye, ShieldAlert, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Invoice } from '../types';

export default function BillingModule() {
  const { invoices, clients, updateInvoicePaymentStatus } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Helper getters
  const getClientDetails = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  const formatMx = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  const handleDownloadStub = (folio: string, format: 'PDF' | 'XML') => {
    alert(`Preparando render fiscal para ${folio}.${format.toLowerCase()}...\nSimulación de descarga emitiendo timbrado digital de sello digital SAT.`);
  };

  return (
    <div className="space-y-6" id="billing-root">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Facturación Electrónica e IVA integrado</h2>
        <p className="text-sm text-slate-500">
          Timbrado de CDFI v4.0. Las facturas se generan con un solo clic una vez terminada la Órden de Servicio.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="billing-workspace">
        {/* List of Invoices */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 text-xs font-bold text-slate-500">
            Historial de Facturas Emitidas
          </div>

          <div className="space-y-3" id="invoices-list">
            {invoices.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12">No hay facturas emitidas aún en el sistema.</p>
            ) : (
              invoices.map(inv => {
                const client = getClientDetails(inv.clientId);
                const isPagada = inv.estadoPago === 'Pagada';
                return (
                  <div key={inv.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row justify-between items-start gap-4">
                    
                    <div className="space-y-2 flex-grow text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-red-700 bg-red-50/50 px-2 py-0.5 rounded border border-red-200">
                          {inv.folio}
                        </span>
                        <span className="text-slate-400">UUID CFDv4: 78B92D0-129B-{inv.id.toUpperCase().substring(0,6)}</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{client?.razonSocial || 'Desconocido'}</h4>
                        <p className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded font-bold w-max">
                          RFC: {client?.rfc || 'XAXX010101000'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
                        <span>Emisión: <b>{inv.fechaEmision}</b></span>
                        <span>Vencimiento: <b>{inv.fechaVencimiento}</b></span>
                        <span>Asociado a OS: <b className="font-mono text-slate-700">{inv.ordenServicioFolio}</b></span>
                      </div>
                    </div>

                    {/* Financials & Action Buttons */}
                    <div className="flex sm:flex-col items-end gap-2 text-right justify-between self-stretch sm:self-auto">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Monto con IVA</span>
                        <p className="text-lg font-extrabold font-mono text-slate-800">{formatMx(inv.total)}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isPagada ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {inv.estadoPago}
                        </span>

                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1 px-2 border hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Visualizar Datos Sat"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detalle
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Side Audit advice */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs text-slate-650 leading-relaxed space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="text-red-500 w-4 h-4" /> Desglose Fiscal Obligatorio
            </h3>
            <p>
              Toda transacción realizada bajo el régimen mexicano contempla el <b>IVA General de 16%</b> diferido de la tasa neta del subtotal.
            </p>
            <div className="p-3 bg-white border rounded-xl space-y-1 font-mono text-[10px]">
              <div>Régimen: <b>601 - General de Ley Personas Morales</b></div>
              <div>Uso CFDI: <b>G03 - Gastos en general</b></div>
              <div>Método: <b>PPD - Pago en parcialidades o diferido</b></div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED INVOICE MODAL / SAT PREVIEW */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-xl space-y-6"
            >
              {/* SAT Style Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div className="space-y-1">
                  <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Receipt className="text-red-650" /> COMPROBANTE FISCAL DIGITAL (CFDI)
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">Servicio de Administración Tributaria (SAT)</p>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
              </div>

              {/* Fiscal layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Emisor */}
                <div className="bg-slate-50 p-3 rounded-lg border space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Emisor</span>
                  <div className="font-bold text-slate-800">SERVICIOS INTEGRALES DE CLIMATIZACIÓN</div>
                  <div>RFC: SIC200522HP8</div>
                  <div>Régimen Fiscal: 601 General de Ley</div>
                </div>

                {/* Receptor */}
                <div className="bg-slate-50 p-3 rounded-lg border space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Receptor</span>
                  <div className="font-bold text-slate-800">{getClientDetails(selectedInvoice.clientId)?.razonSocial}</div>
                  <div>RFC: {getClientDetails(selectedInvoice.clientId)?.rfc}</div>
                  <div>Uso CFDI: G03 Gastos en general</div>
                </div>

                {/* Concept breakdown table */}
                <div className="sm:col-span-2 border rounded-lg overflow-hidden">
                  <div className="bg-slate-150 bg-slate-100 p-2 text-[10px] font-bold text-slate-600 grid grid-cols-4">
                    <span className="col-span-2">Concepto</span>
                    <span className="text-right">Unitario</span>
                    <span className="text-right">Importe</span>
                  </div>
                  <div className="p-3 grid grid-cols-4 text-slate-600 border-b">
                    <span className="col-span-2 font-semibold">Timbres por servicios devengados en {selectedInvoice.ordenServicioFolio}</span>
                    <span className="text-right font-mono">{formatMx(selectedInvoice.subtotal)}</span>
                    <span className="text-right font-mono font-bold">{formatMx(selectedInvoice.subtotal)}</span>
                  </div>
                </div>

                {/* Financial Summary values */}
                <div className="sm:col-span-1"></div>
                <div className="sm:col-span-1 space-y-1.5 text-right font-mono font-bold text-xs p-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans font-medium">Subtotal:</span>
                    <span>{formatMx(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span className="text-slate-400 font-sans font-medium">IVA Trasladado (16%):</span>
                    <span>{formatMx(selectedInvoice.iva)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 text-slate-900 text-sm">
                    <span className="font-sans">Total CFDI:</span>
                    <span className="text-red-650 font-extrabold">{formatMx(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* PDF & XML Actions */}
              <div className="flex flex-wrap gap-2 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => handleDownloadStub(selectedInvoice.folio, 'PDF')}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors text-slate-700"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadStub(selectedInvoice.folio, 'XML')}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors text-slate-700"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar XML Sello
                </button>
                {selectedInvoice.estadoPago === 'Pendiente' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateInvoicePaymentStatus(selectedInvoice.id, 'Pagada');
                      setSelectedInvoice(null);
                      alert('Factura marcada como pagada correctamente!');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Marcar Liquidada (Cerrar)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
