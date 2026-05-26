import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Search, Plus, Calendar, User, FileText, Settings, BadgeAlert, PlusCircle, Wrench, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Equipment, Intervention } from '../types';

export default function EquipmentLifeCycle() {
  const { equipment, interventions, clients, addEquipment, addIntervention } = useApp();
  const [selectedEqId, setSelectedEqId] = useState<string>(equipment[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  // Forms
  const [showAddEq, setShowAddEq] = useState(false);
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [gasRefrigerante, setGasRefrigerante] = useState('R-410A');
  const [voltaje, setVoltaje] = useState('220V Bifásico');
  const [ubicacion, setUbicacion] = useState('');

  // Manual intervention form
  const [showAddIntervention, setShowAddIntervention] = useState(false);
  const [trabajoRealizado, setTrabajoRealizado] = useState('');
  const [tecnico, setTecnico] = useState('Ing. Carlos Mendoza');
  const [ordenServicioFolio, setOrdenServicioFolio] = useState('MANUAL-LOG');

  // Filters
  const selectedEq = equipment.find(e => e.id === selectedEqId);
  const filteredEqs = equipment.filter(e =>
    e.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eqInterventions = interventions.filter(i => i.equipmentId === selectedEqId);

  // Client name getter
  const getClientName = (id: string) => {
    return clients.find(c => c.id === id)?.razonSocial || 'Desconocido';
  };

  const handleAddEqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      alert('Debe dar de alta un cliente primero');
      return;
    }
    addEquipment({
      clientId,
      marca,
      modelo,
      numeroSerie,
      capacidad,
      gasRefrigerante,
      voltaje,
      ubicacion
    });
    // Reset
    setMarca('');
    setModelo('');
    setNumeroSerie('');
    setCapacidad('');
    setUbicacion('');
    setShowAddEq(false);
  };

  const handleAddInterventionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId) return;
    addIntervention({
      equipmentId: selectedEqId,
      fecha: new Date().toISOString().split('T')[0],
      trabajoRealizado,
      tecnico,
      ordenServicioFolio: ordenServicioFolio || 'MANUAL-LOG'
    });
    setTrabajoRealizado('');
    setOrdenServicioFolio('MANUAL-LOG');
    setShowAddIntervention(false);
  };

  return (
    <div className="space-y-6" id="lifecycle-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Expediente Clínico del Equipo (Hoja de Vida)</h2>
          <p className="text-sm text-slate-500">Historial clínico y ficha técnica de maquinaria instalada por cliente.</p>
        </div>
        <button
          onClick={() => setShowAddEq(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shadow-red-500/10"
        >
          <Plus className="w-4 h-4" /> Registrar Equipo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Searchable equipment profiles list */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filtro de marca, serie, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-red-500"
            />
          </div>

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Equipos de Clientes</span>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredEqs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No hay equipos registrados.</p>
            ) : (
              filteredEqs.map(eq => {
                const isSelected = eq.id === selectedEqId;
                return (
                  <button
                    key={eq.id}
                    onClick={() => setSelectedEqId(eq.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-red-500 bg-red-50/20 text-red-950 shadow-3xs font-bold'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{eq.marca} - {eq.modelo}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold shrink-0">
                        {eq.capacidad}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate">{getClientName(eq.clientId)}</span>
                    <span className="text-[9px] text-slate-400 font-mono truncate">N/S: {eq.numeroSerie}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Columns: Technical details sheet and clinical timeline */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEq ? (
            <div className="space-y-6" id="clinical-workspace">
              {/* Technical Profile Details */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Ficha Técnica Operativa</h3>
                    <p className="text-xs text-red-600 font-semibold">{getClientName(selectedEq.clientId)}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border">
                    S/N: {selectedEq.numeroSerie}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Marca</span>
                    <p className="font-bold text-slate-800">{selectedEq.marca}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Modelo</span>
                    <p className="font-bold text-slate-850">{selectedEq.modelo}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Capacidad Térmica</span>
                    <p className="font-bold text-slate-800">{selectedEq.capacidad}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Gas Refrigerante</span>
                    <p className="font-bold text-slate-800 font-mono text-emerald-600">{selectedEq.gasRefrigerante}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tensión de Voltaje</span>
                    <p className="font-bold text-slate-800">{selectedEq.voltaje}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">ID Registro</span>
                    <p className="font-mono font-bold text-slate-500">{selectedEq.id}</p>
                  </div>
                </div>

                <div className="bg-red-50/20 p-3.5 rounded-xl border border-red-100/30 text-xs">
                  <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider block">Ubicación Física Específica</span>
                  <span className="text-slate-700 font-medium">{selectedEq.ubicacion}</span>
                </div>
              </div>

              {/* History of Interventions Timeline */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Historial Clínico de Intervenciones</h3>
                    <p className="text-xs text-slate-400">Pruebas, refacciones aplicadas, mantenimientos y servicios registrados.</p>
                  </div>
                  <button
                    onClick={() => setShowAddIntervention(true)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-[10px] flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Agregar Bitácora
                  </button>
                </div>

                {/* Timeline rendering */}
                <div className="space-y-6 pt-2">
                  {eqInterventions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 border border-dashed rounded-xl p-4">
                      No hay intervenciones clínicas registradas para este equipo.
                    </div>
                  ) : (
                    eqInterventions
                      .sort((a, b) => b.fecha.localeCompare(a.fecha))
                      .map((log, idx) => (
                        <div key={log.id} className="relative pl-6 text-xs" id={`intervention-log-${log.id}`}>
                          {/* Left Line */}
                          {idx !== eqInterventions.length - 1 && (
                            <div className="absolute left-[7px] top-6 bottom-[-24px] w-0.5 bg-slate-200"></div>
                          )}
                          {/* Dot */}
                          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-red-600 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-[11px]">
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {log.fecha}
                              </span>
                              <span className="font-mono px-2 py-0.5 bg-red-50 text-red-700 font-bold rounded-md uppercase">
                                OS: {log.ordenServicioFolio}
                              </span>
                            </div>

                            <p className="text-slate-800 leading-relaxed font-semibold">
                              {log.trabajoRealizado}
                            </p>

                            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                              <span className="flex items-center gap-1 font-medium">
                                <User className="w-3.5 h-3.5" /> Técnico: {log.tecnico}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/50 text-center py-24 rounded-2xl border border-dashed border-slate-300">
              <p className="text-sm text-slate-400">Por favor seleccione un equipo de la lista izquierda para consultar su Hoja de Vida.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Register Equipment */}
      <AnimatePresence>
        {showAddEq && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-lg space-y-4"
            >
              <div className="flex justify-between items-center text-slate-800 border-b pb-2">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Wrench className="text-red-600" /> Registrar Nuevo Equipo en Sistema
                </h3>
                <button onClick={() => setShowAddEq(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
              </div>

              <form onSubmit={handleAddEqSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Client Selection */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Asignar a Cliente</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.razonSocial}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Marca</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carrier"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Modelo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: PACK-Carrier-2026"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Número de Serie</label>
                  <input
                    type="text"
                    required
                    placeholder="SRI-992-120A"
                    value={numeroSerie}
                    onChange={(e) => setNumeroSerie(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Capacidad Térmica</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 10 Toneladas (120,000 BTUs)"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Gas Refrigerante</label>
                  <select
                    value={gasRefrigerante}
                    onChange={(e) => setGasRefrigerante(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  >
                    <option value="R-410A">R-410A</option>
                    <option value="R-22">R-22</option>
                    <option value="R-407C">R-407C</option>
                    <option value="R-134a">R-134a</option>
                    <option value="Gas Ecológico Solstice">Gas Ecológico Solstice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Voltaje de Alimentación</label>
                  <select
                    value={voltaje}
                    onChange={(e) => setVoltaje(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  >
                    <option value="110V Monofásico">110V Monofásico</option>
                    <option value="220V Bifásico">220V Bifásico</option>
                    <option value="220V Trifásico">220V Trifásico</option>
                    <option value="440V Trifásico">440V Trifásico</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Ubicación Física Detallada / Dirección</label>
                  <textarea
                    required
                    placeholder="Ej. Av. Hidalgo 102 - Mezanine, Oficinas de Contabilidad"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500 h-20"
                  ></textarea>
                </div>

                <div className="flex gap-2 justify-end sm:col-span-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddEq(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Confirmar Registro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Record Clinical Intervention */}
      <AnimatePresence>
        {showAddIntervention && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4"
            >
              <div className="flex justify-between items-center text-slate-800 border-b pb-2">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <CheckCircle className="text-red-600" /> Registrar Intervención Manual
                </h3>
                <button onClick={() => setShowAddIntervention(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
              </div>

              <form onSubmit={handleAddInterventionSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Trabajo Realizado (Detalle Médico)</label>
                  <textarea
                    required
                    placeholder="Describa el servicio efectuado..."
                    value={trabajoRealizado}
                    onChange={(e) => setTrabajoRealizado(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500 h-24"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Técnico que atendió</label>
                  <select
                    value={tecnico}
                    onChange={(e) => setTecnico(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  >
                    <option value="Ing. Carlos Mendoza">Ing. Carlos Mendoza</option>
                    <option value="Téc. Fernando Ruiz">Téc. Fernando Ruiz</option>
                    <option value="Téc. Sofía Hernández">Téc. Sofía Hernández</option>
                    <option value="Téc. Manuel Ortega">Téc. Manuel Ortega</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Folio de Órden de Referencia (Opcional)</label>
                  <input
                    type="text"
                    placeholder="OS-001..."
                    value={ordenServicioFolio}
                    onChange={(e) => setOrdenServicioFolio(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddIntervention(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Registrar Bitácora
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
