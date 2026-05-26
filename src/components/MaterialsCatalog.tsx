import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Plus, Package, RefreshCw, AlertTriangle, Battery, BadgeMinus, BadgePlus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MaterialsCatalog() {
  const { materials, addMaterial, updateMaterialStock } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // Form states
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState<number>(5);
  const [unidad, setUnidad] = useState('Piezas');
  const [precioUnitario, setPrecioUnitario] = useState<number>(350);

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterial({
      nombre,
      stock,
      unidad,
      precioUnitario
    });
    // Reset
    setNombre('');
    setStock(5);
    setPrecioUnitario(350);
    setShowAdd(false);
  };

  const handleIncrement = (id: string, current: number) => {
    updateMaterialStock(id, current + 1);
  };

  const handleDecrement = (id: string, current: number) => {
    updateMaterialStock(id, current - 1);
  };

  const filteredMaterials = materials.filter(m =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMx = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  return (
    <div className="space-y-6" id="catalog-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Catálogo de Materiales y Refacciones</h2>
          <p className="text-sm text-slate-500">Control de stock de gases refrigerantes, compresores, tuberías y refacciones.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shadow-red-500/10"
        >
          <Plus className="w-4 h-4" /> Agregar Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="catalog-workspace">
        {/* Inventory listing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar gas refrigerante, compresor, acoples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-red-500 shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="materials-grid">
            {filteredMaterials.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12 md:col-span-2">No se encontraron refacciones.</p>
            ) : (
              filteredMaterials.map(m => {
                const esCritico = m.stock <= 2;
                return (
                  <motion.div
                    layout
                    key={m.id}
                    className={`bg-white p-5 rounded-2xl border transition-all ${
                      esCritico ? 'border-rose-200 bg-rose-50/10 shadow-3xs' : 'border-slate-100 shadow-2xs'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1 text-xs">
                        <h4 className="font-bold text-slate-800 line-clamp-1">{m.nombre}</h4>
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <span>Unidad: {m.unidad}</span>
                          <span>•</span>
                          <span>Costo Unit: {formatMx(m.precioUnitario)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div>
                        {esCritico ? (
                          <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-black flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3" /> Resurtido Crítico
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Stock Seguro</span>
                        )}
                      </div>

                      {/* Manual stock modifications */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDecrement(m.id, m.stock)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-base transition-colors"
                        >
                          -
                        </button>
                        <span className="font-mono font-extrabold text-slate-800 text-sm w-8 text-center">{m.stock}</span>
                        <button
                          onClick={() => handleIncrement(m.id, m.stock)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center font-bold text-base transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Side Info Board */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <h3 className="font-bold text-slate-800 mb-2">Control de Gases y Presostatos</h3>
            <p className="mb-3">
              Los cilindros de gas refrigerante R-410A y R-22 deben ser pesados antes y después de cada carga para garantizar auditorías fiscales federales.
            </p>
            <div className="p-3 bg-white rounded-xl border space-y-1 mt-4">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Clasificación Ecológica:</span>
              <p className="font-semibold text-slate-700 text-[11px]">R-410A: HFC de alta eficiencia libre de cloro</p>
              <p className="font-semibold text-[11px] text-slate-500">R-22: HCFC obsoleto (Restringido bajo Protocolo de Montreal)</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD MATERIAL */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4"
            >
              <div className="flex justify-between items-center text-slate-800 border-b pb-2">
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Package className="text-red-600" /> Registrar Nuevo Insumo / Refacción
                </h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
              </div>

              <form onSubmit={handleCreateMaterial} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nombre de la Refacción / Gas</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Gas Refrigerante R-410A (Cilindro 11kg)"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Existencia Inicial (Stock)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Unidad de Medida</label>
                    <select
                      value={unidad}
                      onChange={(e) => setUnidad(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                    >
                      <option value="Piezas">Piezas</option>
                      <option value="Cilindros">Cilindros</option>
                      <option value="Tiras">Tiras</option>
                      <option value="Litros">Litros</option>
                      <option value="Metros">Metros</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Precio Unitario ($ MXN)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={precioUnitario}
                    onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm shadow-red-500/10"
                  >
                    Guardar en Almacén
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
