import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Search, Plus, MapPin, Edit2, Check, User, Phone, Mail, FileStack, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Client } from '../types';

export default function ClientsDirectory() {
  const { clients, addClient, updateClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [razonSocial, setRazonSocial] = useState('');
  const [rfc, setRfc] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direcciones, setDirecciones] = useState<string[]>(['']);

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setRazonSocial('');
    setRfc('');
    setEmail('');
    setTelefono('');
    setDirecciones(['']);
    setIsEditing(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleOpenEdit = (cli: Client) => {
    setEditingId(cli.id);
    setRazonSocial(cli.razonSocial);
    setRfc(cli.rfc);
    setEmail(cli.email);
    setTelefono(cli.telefono);
    setDirecciones([...cli.direcciones]);
    setIsEditing(true);
  };

  const handleAddAddressField = () => {
    setDirecciones([...direcciones, '']);
  };

  const handleRemoveAddressField = (idx: number) => {
    if (direcciones.length === 1) return;
    setDirecciones(direcciones.filter((_, i) => i !== idx));
  };

  const handleAddressChange = (idx: number, val: string) => {
    const updated = [...direcciones];
    updated[idx] = val;
    setDirecciones(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDirecciones = direcciones.filter(d => d.trim() !== '');
    if (cleanDirecciones.length === 0) {
      alert('Debe agregar al menos una dirección de envío/servicio válida.');
      return;
    }

    if (editingId) {
      updateClient({
        id: editingId,
        razonSocial,
        rfc: rfc.toUpperCase(),
        email,
        telefono,
        direcciones: cleanDirecciones
      });
    } else {
      addClient({
        razonSocial,
        rfc: rfc.toUpperCase(),
        email,
        telefono,
        direcciones: cleanDirecciones
      });
    }
    resetForm();
  };

  const filteredClients = clients.filter(c =>
    c.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="clients-root">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Directorio de Clientes</h2>
          <p className="text-sm text-slate-500">Registro unificado de datos fiscales y sucursales de servicio.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shadow-red-500/10"
        >
          <Plus className="w-4 h-4" /> Agregar Cliente
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listing & Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por razón social, RFC o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-red-500 shadow-2xs"
            />
          </div>

          <div className="space-y-4" id="clients-list">
            {filteredClients.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12">No se encontraron clientes.</p>
            ) : (
              filteredClients.map(c => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 relative group">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors border border-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Editar datos del cliente"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex justify-between items-start pr-8">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{c.razonSocial}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                        RFC: {c.rfc}
                      </span>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-650">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.telefono}</span>
                    </div>
                  </div>

                  {/* Addresses list */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Direcciones de Envío / Mantenimiento</span>
                    <div className="space-y-1">
                      {c.direcciones.map((dir, dIdx) => (
                        <div key={dIdx} className="flex gap-2 items-start text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/40">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{dir}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic creation/editing side panel */}
        <div>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl border border-red-100/50 ring-2 ring-red-500/5 shadow-lg space-y-4 text-xs"
                id="client-form"
              >
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">
                  {editingId ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
                </h3>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Razón Social o Nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Hoteles del Pacífico S.A."
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">RFC (Cédula Fiscal)</label>
                  <input
                    type="text"
                    required
                    maxLength={13}
                    placeholder="HPA950812HP1"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Correo Electrónico de Contacto</label>
                  <input
                    type="email"
                    required
                    placeholder="pagos@cliente.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Teléfono</label>
                  <input
                    type="tel"
                    required
                    placeholder="5541235678"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  />
                </div>

                {/* Dynamic addresses fields */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-700">Direcciones de Servicio / Sucursales</label>
                    <button
                      type="button"
                      onClick={handleAddAddressField}
                      className="text-[10px] text-red-650 font-bold hover:underline"
                    >
                      + Nueva Dirección
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {direcciones.map((dir, idx) => (
                      <div key={idx} className="flex gap-1.5 items-center">
                        <input
                          type="text"
                          required
                          placeholder={`Dirección Sucursal #${idx + 1}`}
                          value={dir}
                          onChange={(e) => handleAddressChange(idx, e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                        />
                        {direcciones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAddressField(idx)}
                            className="p-1 px-2.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm shadow-red-500/10"
                  >
                    <Check className="w-3.5 h-3.5" /> {editingId ? 'Guardar Cambios' : 'Registrar'}
                  </button>
                </div>
              </motion.form>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 mx-auto">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800">Catastro de Sucursales</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ingrese múltiples direcciones por cliente para mapear correctamente los equipos y habilitar el ruteo de técnicos.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Agregar Primer Cliente
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
