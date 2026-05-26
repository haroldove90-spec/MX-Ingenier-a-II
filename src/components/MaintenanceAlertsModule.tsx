import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { AlertCircle, CheckCircle2, UserCheck, CalendarPlus, Settings, MapPin, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MaintenanceAlertsModule() {
  const { alerts, clients, equipment, toggleAlertStatus, createServiceFromAlert } = useApp();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [assignedTech, setAssignedTech] = useState<string>('Ing. Carlos Mendoza');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-05-28');

  // Helpers
  const getClientOfAlert = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  const getEquipmentOfAlert = (equipmentId: string) => {
    return equipment.find(e => e.id === equipmentId);
  };

  const handleCreateOrder = () => {
    if (!selectedAlertId) return;
    createServiceFromAlert(selectedAlertId, assignedTech, scheduledDate);
    setSelectedAlertId(null);
  };

  return (
    <div className="space-y-6" id="alerts-root">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Alertas de Mantenimiento Preventivo</h2>
        <p className="text-sm text-slate-500">Recordatorios automáticos de servicios preventivos recomendados para el mes en curso.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="alerts-workspace">
        {/* Alerts List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Servicios Preventivos del Mes (Mayo 2026)</span>
            <span className="text-xs font-mono bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full">
              {alerts.filter(a => a.estado === 'Pendiente').length} Por Atender
            </span>
          </div>

          <div className="space-y-3" id="alerts-list">
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12">No hay alertas de mantenimiento este mes.</p>
            ) : (
              alerts.map(al => {
                const cli = getClientOfAlert(al.clientId);
                const eq = getEquipmentOfAlert(al.equipmentId);
                const isPendiente = al.estado === 'Pendiente';

                return (
                  <motion.div
                    layout
                    key={al.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPendiente
                        ? 'bg-white border-amber-200 shadow-3xs ring-1 ring-amber-100/50'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      {/* Left Block */}
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg shrink-0 ${isPendiente ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                            <AlertCircle className="w-5 h-5" />
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Recordatorio de Climatización</span>
                            <h3 className={`font-bold text-sm ${isPendiente ? 'text-slate-800' : 'text-slate-500'}`}>
                              {al.tipoServicio}
                            </h3>
                          </div>
                        </div>

                        {/* Equipment / Technical sheet details */}
                        {eq && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span><b>Cliente:</b> {cli?.razonSocial || 'Indefinido'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Settings className="w-3.5 h-3.5 text-slate-400 animate-spin-slow" />
                              <span><b>Equipo:</b> {eq.marca} - Mod: {eq.modelo} ({eq.capacidad})</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 sm:col-span-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate"><b>Dirección:</b> {eq.ubicacion}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Block Actions */}
                      <div className="flex sm:flex-col items-stretch justify-end self-stretch sm:self-auto gap-2 text-right">
                        <span className={`text-[10px] font-bold py-1 px-2.5 rounded-full uppercase self-end ${
                          isPendiente ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {al.estado}
                        </span>

                        <div className="flex gap-1.5 mt-auto">
                          <button
                            onClick={() => toggleAlertStatus(al.id)}
                            className={`p-2 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                              isPendiente
                                ? 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title={isPendiente ? 'Marcar como Atendido' : 'Marcar como Pendiente'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          {isPendiente && (
                            <button
                              onClick={() => {
                                setSelectedAlertId(al.id);
                                // Set an upcoming date
                                const d = new Date();
                                d.setDate(d.getDate() + 2);
                                setScheduledDate(d.toISOString().split('T')[0]);
                              }}
                              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-red-500/10"
                            >
                              <CalendarPlus className="w-4 h-4" />
                              Programar OS
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Informative Side Panel */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">¿Cómo funcionan las Alertas?</h3>
            <p className="text-xs text-slate-600 leading-relaxed space-y-2">
              Se calculan automáticamente según el historial de la <b>Hoja de Vida de cada equipo</b>. 
              Los equipos de aire acondicionado requieren mantenimiento preventivo cada <b>3 a 4 meses</b> para evitar fatigas térmicas, fugas de refrigerante y sobredimensión del consumo eléctrico.
            </p>
            <div className="mt-4 p-3 bg-white border border-slate-100 rounded-xl space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
                <span>Alerta amarilla: Programación sugerida de mes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                <span>Completada: Se liga automáticamente el historial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Service Order Modal */}
      <AnimatePresence>
        {selectedAlertId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4"
            >
              <div className="flex justify-between items-center text-slate-800 border-b pb-2">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <CalendarPlus className="text-red-600" /> Programar Servicio Preventivo
                </h3>
                <button onClick={() => setSelectedAlertId(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Info summary */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                  <div><b>Servicio:</b> {alerts.find(a => a.id === selectedAlertId)?.tipoServicio}</div>
                  <div><b>Cliente:</b> {getClientOfAlert(alerts.find(a => a.id === selectedAlertId)?.clientId || '')?.razonSocial}</div>
                  <div><b>Equipo:</b> {getEquipmentOfAlert(alerts.find(a => a.id === selectedAlertId)?.equipmentId || '')?.marca}</div>
                </div>

                 <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Asignar Técnico Responsable</label>
                  <select
                    value={assignedTech}
                    onChange={(e) => setAssignedTech(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  >
                    <option value="Ing. Carlos Mendoza">Ing. Carlos Mendoza</option>
                    <option value="Téc. Fernando Ruiz">Téc. Fernando Ruiz</option>
                    <option value="Téc. Sofía Hernández">Téc. Sofía Hernández</option>
                    <option value="Téc. Manuel Ortega">Téc. Manuel Ortega</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">Fecha de Visita</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setSelectedAlertId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateOrder}
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Confirmar y Generar OS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
