import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { FileText, Camera, Printer, PlusCircle, Check, X } from 'lucide-react';
import { ServiceOrder } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function ServiceOrdersManager() {
  const {
    serviceOrders,
    clients,
    equipment,
    addServiceOrder,
    updateServiceOrderStatus
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formState, setFormState] = useState({
    clientId: '',
    equipmentId: '',
    fechaProgramada: new Date().toISOString().split('T')[0],
    tecnicoAsignado: '',
    tipoMantenimiento: 'Correctivo' as 'Correctivo' | 'Preventivo',
    descripcionServicio: '',
    fallaReportada: '',
    diagnostico: '',
    trabajosRealizados: '',
    observaciones: '',
    total: 0
  });

  const [reportToPrint, setReportToPrint] = useState<ServiceOrder | null>(null);

  const getClient = (id: string) => clients.find(c => c.id === id);
  const getEquipmentName = (id: string) => {
    const eq = equipment.find(e => e.id === id);
    return eq ? `${eq.marca} (${eq.modelo}) - SN: ${eq.numeroSerie}` : 'Desconocido';
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.clientId || !formState.equipmentId) {
      alert('Seleccione un cliente y equipo.');
      return;
    }
    addServiceOrder({
      ...formState,
      fotoUrl: photoPreview || undefined,
      estado: 'Terminada',
      cotizacionFolio: 'N/A', // Opcional, podría venir de otro lado
      anticiposRecibidos: 0,
      facturado: false
    });
    setIsFormOpen(false);
    setPhotoPreview(null);
    setFormState({
      clientId: '', equipmentId: '', fechaProgramada: new Date().toISOString().split('T')[0],
      tecnicoAsignado: '', tipoMantenimiento: 'Correctivo', descripcionServicio: 'Reporte Técnico',
      fallaReportada: '', diagnostico: '', trabajosRealizados: '', observaciones: '', total: 0
    });
  };

  const printReport = (so: ServiceOrder) => {
    setReportToPrint(so);
    setTimeout(() => {
      window.print();
      setReportToPrint(null);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Reporte Técnico (Foliado Aut.)</h2>
          <p className="text-sm text-slate-500">
            Alta de reportes técnicos con captura de evidencia fotográfica y exportación a PDF.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Nuevo Reporte
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 no-print">
        {serviceOrders.map(so => {
          const client = getClient(so.clientId);
          return (
            <div key={so.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
                  {so.folio}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{so.fechaProgramada}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm truncate">{client?.razonSocial || 'Desconocido'}</h4>
                <p className="text-[11px] text-slate-500 font-medium truncate">{getEquipmentName(so.equipmentId)}</p>
              </div>
              {so.fotoUrl && (
                <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={so.fotoUrl} alt="Evidencia" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mt-auto pt-4 flex gap-2">
                <button
                  onClick={() => printReport(so)}
                  className="flex-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex justify-center items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" /> PDF / Imprimir
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FORM MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 no-print overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-auto"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Alta de Reporte Técnico
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
                <form id="report-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Cliente</label>
                      <select
                        required
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formState.clientId}
                        onChange={e => setFormState({ ...formState, clientId: e.target.value })}
                      >
                        <option value="">Seleccione un cliente...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.razonSocial}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Equipo</label>
                      <select
                        required
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formState.equipmentId}
                        onChange={e => setFormState({ ...formState, equipmentId: e.target.value })}
                        disabled={!formState.clientId}
                      >
                        <option value="">Seleccione equipo...</option>
                        {equipment.filter(e => e.clientId === formState.clientId).map(eq => (
                          <option key={eq.id} value={eq.id}>{eq.marca} {eq.modelo} (SN: {eq.numeroSerie})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Técnico Asignado</label>
                      <input
                        required
                        type="text"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formState.tecnicoAsignado}
                        onChange={e => setFormState({ ...formState, tecnicoAsignado: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Tipo Mantenimiento</label>
                      <select
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formState.tipoMantenimiento}
                        onChange={e => setFormState({ ...formState, tipoMantenimiento: e.target.value as any })}
                      >
                        <option value="Correctivo">Correctivo</option>
                        <option value="Preventivo">Preventivo</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Fecha</label>
                      <input
                        required
                        type="date"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        value={formState.fechaProgramada}
                        onChange={e => setFormState({ ...formState, fechaProgramada: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Falla Reportada</label>
                    <textarea
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm h-20"
                      value={formState.fallaReportada}
                      onChange={e => setFormState({ ...formState, fallaReportada: e.target.value })}
                     />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Diagnóstico Técnico</label>
                    <textarea
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm h-24"
                      value={formState.diagnostico}
                      onChange={e => setFormState({ ...formState, diagnostico: e.target.value })}
                     />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Trabajos Realizados / Materiales Utiizados</label>
                    <textarea
                      required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm h-24"
                      value={formState.trabajosRealizados}
                      onChange={e => setFormState({ ...formState, trabajosRealizados: e.target.value })}
                     />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Observaciones Finales</label>
                    <textarea
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm h-20"
                      value={formState.observaciones}
                      onChange={e => setFormState({ ...formState, observaciones: e.target.value })}
                     />
                  </div>

                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-slate-500" /> Captura Fotográfica de Evidencia
                    </label>
                    <p className="text-[10px] text-slate-500 mb-2">Toma una foto del equipo o falla directamente desde tu dispositivo.</p>
                    
                    <div className="mb-4">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-red-300 rounded-xl bg-red-50 hover:bg-red-100 cursor-pointer transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                          <Camera className="w-6 h-6 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-semibold text-red-700">Tocar para tomar fotografía</p>
                          <p className="text-[10px] text-red-500 mt-1">Usará la cámara de tu dispositivo móvil</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handlePhotoCapture}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {photoPreview && (
                      <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={photoPreview} alt="Preview" className="w-full h-auto" />
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(null)}
                          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  form="report-form"
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4" /> Guardar Reporte Folio Aut.
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HIDDEN PRINT TEMPLATE */}
      {reportToPrint && (
        <div className="print-only hidden p-8 max-w-4xl mx-auto font-sans text-xs">
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img src="https://cossma.com.mx/mxingenieria.jpeg" alt="Logo" className="h-16 object-contain" referrerPolicy="no-referrer" />
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">MX INGENIERÍA</h1>
                <p className="text-slate-500 text-[10px] mt-1 font-mono uppercase">Mantenimiento de Aire Acondicionado y Refrigeración</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-slate-800 font-mono tracking-tighter mb-1">{reportToPrint.folio}</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">REPORTE TÉCNICO</div>
              <div className="text-slate-600 text-xs">Fecha: <span className="font-bold">{reportToPrint.fechaProgramada}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-black text-sm uppercase border-b pb-1 mb-2 text-slate-800">Datos del Cliente</h3>
              <p className="font-bold text-sm text-slate-900">{getClient(reportToPrint.clientId)?.razonSocial}</p>
              <p className="text-slate-600 mt-1">RFC: {getClient(reportToPrint.clientId)?.rfc}</p>
              <p className="text-slate-600">Tel: {getClient(reportToPrint.clientId)?.telefono}</p>
            </div>
            <div>
              <h3 className="font-black text-sm uppercase border-b pb-1 mb-2 text-slate-800">Detalles del Servicio</h3>
              <p className="text-slate-600">Tipo: <span className="font-bold font-mono text-slate-900">{reportToPrint.tipoMantenimiento}</span></p>
              <p className="text-slate-600">Técnico: <span className="font-bold text-slate-900">{reportToPrint.tecnicoAsignado}</span></p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-black text-sm uppercase border-b pb-1 mb-2 text-slate-800">Datos del Equipo</h3>
            <p className="font-bold text-slate-900">{getEquipmentName(reportToPrint.equipmentId)}</p>
            <p className="text-slate-600 mt-1">Ubicación: {equipment.find(e => e.id === reportToPrint.equipmentId)?.ubicacion}</p>
          </div>

          <div className="space-y-6">
            <div className="border rounded-xl p-4">
              <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Falla Reportada</h4>
              <p className="text-sm whitespace-pre-wrap">{reportToPrint.fallaReportada || reportToPrint.descripcionServicio}</p>
            </div>
            <div className="border rounded-xl p-4">
              <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Diagnóstico</h4>
              <p className="text-sm whitespace-pre-wrap">{reportToPrint.diagnostico || 'N/A'}</p>
            </div>
            <div className="border rounded-xl p-4">
              <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Trabajos Realizados y Materiales</h4>
              <p className="text-sm whitespace-pre-wrap">{reportToPrint.trabajosRealizados || 'N/A'}</p>
            </div>
            {reportToPrint.observaciones && (
              <div className="border rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Observaciones</h4>
                <p className="text-sm whitespace-pre-wrap">{reportToPrint.observaciones}</p>
              </div>
            )}
          </div>

          {reportToPrint.fotoUrl && (
            <div className="mt-8 page-break-inside-avoid">
              <h3 className="font-black text-sm uppercase border-b pb-1 mb-4 text-slate-800">Evidencia Fotográfica</h3>
              <div className="w-full max-w-sm rounded-xl overflow-hidden border">
                <img src={reportToPrint.fotoUrl} alt="Evidencia" className="w-full object-contain" />
              </div>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 gap-16 text-center page-break-inside-avoid">
            <div>
              <div className="border-b border-black mb-2 px-8 py-4"></div>
              <p className="font-bold uppercase text-[10px] text-slate-600">{reportToPrint.tecnicoAsignado}</p>
              <p className="text-[10px] text-slate-400">Firma Técnico MX Ingeniería</p>
            </div>
            <div>
              <div className="border-b border-black mb-2 px-8 py-4"></div>
              <p className="font-bold uppercase text-[10px] text-slate-600">Nombre y Firma</p>
              <p className="text-[10px] text-slate-400">Conformidad del Cliente</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
