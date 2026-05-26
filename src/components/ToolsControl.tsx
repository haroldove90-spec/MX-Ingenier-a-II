import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Search, Plus, User, Clipboard, Undo, ShieldAlert, BadgeMinus, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ToolsControl() {
  const { tools, updateToolAssignment, addTool } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // Form states tool assignment
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [assignee, setAssignee] = useState<string>('Ing. Carlos Mendoza');

  // Form states new tool
  const [nombre, setNombre] = useState('');
  const [modeloSerie, setModeloSerie] = useState('');

  const technicianOptions = [
    'Ing. Carlos Mendoza',
    'Téc. Fernando Ruiz',
    'Téc. Sofía Hernández',
    'Téc. Manuel Ortega'
  ];

  const handlePostTool = (e: React.FormEvent) => {
    e.preventDefault();
    addTool({
      nombre,
      modeloSerie,
      estado: 'Disponible'
    });
    setNombre('');
    setModeloSerie('');
    setShowAdd(false);
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToolId) return;
    updateToolAssignment(selectedToolId, assignee);
    setSelectedToolId(null);
  };

  const handleReturnToWarehouse = (id: string) => {
    updateToolAssignment(id, undefined);
  };

  const filteredTools = tools.filter(t =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.modeloSerie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="tools-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Control de Herramental Crítico</h2>
          <p className="text-sm text-slate-500">
            Registro de custodia de equipo pesado en campo (bombas de vacío, manómetros, recuperadoras) para evitar fugas materiales.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shadow-red-500/10"
        >
          <Plus className="w-4 h-4" /> Registrar Herramienta
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6" id="tools-workspace">
        {/* Listing cards column */}
        <div className="xl:col-span-3 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar bomba, pinza amperimétrica, detector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-red-500 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="tools-grid">
            {filteredTools.map(t => {
              const isAsignado = t.estado === 'Asignado';
              return (
                <div
                  key={t.id}
                  className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isAsignado ? 'border-amber-100 shadow-3xs' : 'border-slate-100 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{t.nombre}</h4>
                        <span className="text-[10px] text-slate-400 font-mono font-bold block mt-1">
                          Ref/Serie: {t.modeloSerie}
                        </span>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isAsignado ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {t.estado}
                      </span>
                    </div>

                    {isAsignado ? (
                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 text-[11px] text-amber-900 space-y-1">
                        <div className="flex items-center gap-1 font-bold">
                          <User className="w-3.5 h-3.5 text-amber-600" /> Custodia: {t.tecnicoAsignado}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">Asignada el: {t.fechaAsignacion}</div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 border border-slate-100 flex items-center gap-1.5 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> En Bodega General (Listo para entrega)
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex justify-end gap-1.5 mt-5 pt-3 border-t border-slate-100">
                    {isAsignado ? (
                      <button
                        onClick={() => handleReturnToWarehouse(t.id)}
                        className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Undo className="w-3.5 h-3.5" /> Devolver a Bodega
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedToolId(t.id)}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Clipboard className="w-3.5 h-3.5" /> Registrar Custodio (Salida)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Audit advice card */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs text-slate-650 leading-relaxed space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="text-amber-500 w-4 h-4" /> Custodia de Tecnología
            </h3>
            <p>
              El valor promedio de una <b>bomba de vacío de doble etapa</b> o un <b>manómetro digital de campo</b> ronda los $15,000 MXN.
            </p>
            <p className="font-semibold text-slate-600">
              Cualquier salida de almacén principal debe registrar el nombre del custodio para control de inventario de activos fijos de la empresa.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: ASSIGN TOOL */}
      <AnimatePresence>
        {selectedToolId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm space-y-4"
            >
              <div className="flex justify-between items-center text-slate-800 border-b pb-2">
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Clipboard className="text-red-600" /> Registrar Custodia de Activo
                </h3>
                <button onClick={() => setSelectedToolId(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
              </div>

              <form onSubmit={handleConfirmAssignment} className="space-y-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                  <div>Activo: <b>{tools.find(t => t.id === selectedToolId)?.nombre}</b></div>
                  <div>N/S: <span className="font-mono">{tools.find(t => t.id === selectedToolId)?.modeloSerie}</span></div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Asignar Cargo a:</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  >
                    {technicianOptions.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedToolId(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg border transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm shadow-red-500/10"
                  >
                    Asignar y Firmar Salida
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD TOOL */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm space-y-4"
            >
              <div className="flex justify-between items-center text-slate-800 border-b pb-2">
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Package className="text-red-600" /> Registrar Nuevo Activo de Almacén
                </h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
              </div>

              <form onSubmit={handlePostTool} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nombre de la Herramienta</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hidrolavadora de serpentines portátil"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Modelo / Número de Serie</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. MODELO-REG-X"
                    value={modeloSerie}
                    onChange={(e) => setModeloSerie(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg border transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm shadow-red-500/10"
                  >
                    Registrar en Bodega
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
