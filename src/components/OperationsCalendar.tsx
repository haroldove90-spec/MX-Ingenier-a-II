import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Calendar, User, Clock, ChevronLeft, ChevronRight, MapPin, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export default function OperationsCalendar() {
  const { serviceOrders, clients, equipment } = useApp();
  const [viewType, setViewType] = useState<'rango' | 'tecnicos'>('rango'); // Calendar or Technicians Grid
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);

  // System current date: May 26, 2026 (which is a Tuesday)
  const baseDate = new Date('2026-05-26'); 
  
  // Calculate specific week dates based on offset
  const getWeekDates = () => {
    const startOfWeek = new Date(baseDate);
    // Find the Monday of current week
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff + currentWeekOffset * 7);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(startOfWeek);
      nextDay.setDate(startOfWeek.getDate() + i);
      dates.push(nextDay);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekStartStr = weekDates[0].toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  const weekEndStr = weekDates[6].toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' });

  // Filter service orders falling into this week
  const formatIsoDate = (d: Date) => d.toISOString().split('T')[0];

  const getOrdersForDate = (dateStr: string) => {
    return serviceOrders.filter(so => so.fechaProgramada === dateStr);
  };

  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.razonSocial || 'Cliente Desconocido';
  };

  const getEquipmentName = (eqId: string) => {
    const eq = equipment.find(e => e.id === eqId);
    return eq ? `${eq.marca} - ${eq.modelo} (${eq.capacidad})` : 'Equipo';
  };

  // Get status color
  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'Programada': return 'bg-cyan-50 border-cyan-300 text-cyan-800';
      case 'En Proceso': return 'bg-amber-50 border-amber-300 text-amber-800 animate-pulse';
      case 'Terminada': return 'bg-emerald-50 border-emerald-300 text-emerald-800';
      case 'Facturada': return 'bg-red-50 border-red-350 text-red-800';
      default: return 'bg-slate-50 border-slate-300 text-slate-800';
    }
  };

  // Unique list of technicians
  const techniciansList = ['Ing. Carlos Mendoza', 'Téc. Fernando Ruiz', 'Téc. Sofía Hernández', 'Téc. Manuel Ortega'];

  return (
    <div className="space-y-6" id="calendar-root">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Calendario de Operaciones</h2>
          <p className="text-sm text-slate-500">Agenda visual de servicios y asignaciones de personal técnico.</p>
        </div>

        {/* View Switches */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto">
          <button
            onClick={() => setViewType('rango')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewType === 'rango' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Vista Semanal
          </button>
          <button
            onClick={() => setViewType('tecnicos')}
            className={`px-3 py-1.5 rounded-lg transition-all ${viewType === 'tecnicos' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Técnicos Asignados
          </button>
        </div>
      </div>

      {viewType === 'rango' ? (
        <div className="space-y-4" id="calendar-week-view">
          {/* Calendar Controls */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2">
              <Calendar className="text-red-650 w-5 h-5" />
              <span className="font-bold text-slate-800 text-sm">
                Semana: {weekStartStr} - {weekEndStr}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentWeekOffset(0)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-lg text-slate-600 transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Week Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDates.map((date, idx) => {
              const strDate = formatIsoDate(date);
              const isToday = strDate === '2026-05-26'; // Today in user-time context
              const orders = getOrdersForDate(strDate);
              const formattedDay = date.toLocaleDateString('es-MX', { weekday: 'short' });
              const formattedDateNumber = date.getDate();

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border min-h-[300px] flex flex-col p-3 transition-colors ${
                    isToday ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/10' : 'border-slate-100'
                  }`}
                >
                  {/* Column Header */}
                  <div className="text-center pb-2 mb-3 border-b border-slate-100 flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {formattedDay}
                    </span>
                    <span className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full ${
                      isToday ? 'bg-red-600 text-white shadow-2xs' : 'text-slate-800'
                    }`}>
                      {formattedDateNumber}
                    </span>
                  </div>

                  {/* Orders list for day */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {orders.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center py-6 text-slate-300">
                        <span className="text-[10px] font-medium text-center">Sin servicios</span>
                      </div>
                    ) : (
                      orders.map(order => (
                        <div
                          key={order.id}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all hover:shadow-xs hover:border-slate-300 flex flex-col gap-1 ${getStatusStyle(order.estado)}`}
                        >
                          <div className="flex justify-between items-center font-bold">
                            <span>{order.folio}</span>
                            <span className="text-[9px] px-1 py-0.5 rounded-md uppercase font-black bg-white/60">
                              {order.tipoMantenimiento}
                            </span>
                          </div>
                          
                          <p className="font-semibold text-slate-900 truncate">
                            {getClientName(order.clientId)}
                          </p>
                          
                          <p className="text-[10px] text-slate-600 line-clamp-2">
                            {order.descripcionServicio}
                          </p>

                          <div className="mt-1.5 pt-1.5 border-t border-slate-200/50 flex flex-col gap-1 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1 font-medium">
                              <User className="w-3 h-3 text-slate-400 shrink-0" /> {order.tecnicoAsignado}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" /> {order.fechaProgramada}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Technicians Assignment View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="calendar-tech-grid">
          {techniciansList.map(tech => {
            const techOrders = serviceOrders.filter(so => so.tecnicoAsignado === tech);
            return (
              <div key={tech} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                {/* Technician Profile Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                    {tech.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{tech}</h4>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                      {techOrders.filter(o => o.estado !== 'Terminada' && o.estado !== 'Facturada').length} Pendientes
                    </span>
                  </div>
                </div>

                {/* Sub-list of services */}
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Servicios en Agenda</span>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {techOrders.length === 0 ? (
                    <p className="text-xs text-slate-300 text-center py-6">No tiene asignaciones este mes.</p>
                  ) : (
                    techOrders.map(order => {
                      const clin = clients.find(c => c.id === order.clientId);
                      const eq = equipment.find(e => e.id === order.equipmentId);
                      return (
                        <div key={order.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs hover:border-slate-200 hover:bg-slate-100/50 transition-all">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700">{order.folio}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                              order.estado === 'En Proceso' ? 'bg-amber-100 text-amber-800' :
                              order.estado === 'Terminada' || order.estado === 'Facturada' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-cyan-100 text-cyan-800'
                            }`}>
                              {order.estado}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="font-bold text-slate-800">{clin?.razonSocial}</div>
                            <div className="text-[10px] text-slate-500 line-clamp-1">{order.descripcionServicio}</div>
                          </div>

                          <div className="pt-2 border-t border-slate-200/50 flex flex-wrap justify-between items-center text-[10px] text-slate-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-2.5 h-2.5" /> {order.fechaProgramada}
                            </span>
                            {eq && (
                              <span className="text-[9px] italic text-slate-600 font-medium">
                                {eq.marca} ({eq.capacidad})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
