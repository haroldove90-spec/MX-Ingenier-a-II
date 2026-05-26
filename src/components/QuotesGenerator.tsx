import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Plus, 
  Trash, 
  Check, 
  X, 
  FilePlus2, 
  Receipt, 
  Coins, 
  ArrowRightLeft, 
  FileCheck2, 
  Eye, 
  Printer, 
  Sparkles, 
  Download, 
  AlertCircle,
  Clock,
  Landmark,
  FileText
} from 'lucide-react';
import { QuoteItem, Quote } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function QuotesGenerator() {
  const { quotes, clients, addQuote, updateQuoteStatus, addServiceOrder, equipment } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedQuoteForPreview, setSelectedQuoteForPreview] = useState<Quote | null>(null);
  
  // New Quote form states
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [asunto, setAsunto] = useState('Propuesta de suminsitro Instalacion de aires acondicionados');
  const [atencion, setAtencion] = useState('');
  const [estimado, setEstimado] = useState('Arq. Uriel');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [validezDias, setValidezDias] = useState<number>(15);
  const [tiempoEntrega, setTiempoEntrega] = useState('2 días');
  const [formaPago, setFormaPago] = useState('Contado');
  const [lugarEntrega, setLugarEntrega] = useState('Oaxaca de Juárez, Oax.');
  const [incluyeIva, setIncluyeIva] = useState(true);
  const [retencionIsr, setRetencionIsr] = useState(false);
  const [retencionIsrPorcentaje, setRetencionIsrPorcentaje] = useState(1.25);
  const [anticipoPorcentaje, setAnticipoPorcentaje] = useState<number>(50);
  const [notas, setNotas] = useState('Nota. Las instalaciones solo aplican con el kitt basico. El kitt basico aplica solo para una distancia de 3.5m a 4m');
  
  // Bank details states
  const [bancoTitular, setBancoTitular] = useState('CARLOS HUGO ANTONIO GARCIA');
  const [bancoNombre, setBancoNombre] = useState('BANORTE');
  const [bancoCuenta, setBancoCuenta] = useState('0822898001');
  const [bancoClabe, setBancoClabe] = useState('072 637 00822898001 7');

  const [items, setItems] = useState<Omit<QuoteItem, 'id'>[]>([
    { 
      descripcion: 'Servicio técnico especializado de climatización', 
      cantidad: 1, 
      precioUnitario: 1200, 
      categoria: 'MANO DE OBRA',
      unidadMedida: 'Servicio'
    }
  ]);

  // Convert approved quote to OS states
  const [selectedQuoteForOs, setSelectedQuoteForOs] = useState<Quote | null>(null);
  const [assignedTech, setAssignedTech] = useState('Ing. Carlos Mendoza');
  const [selectedEquipmentItem, setSelectedEquipmentItem] = useState('');

  // Helpers
  const getClientName = (id: string) => {
    return clients.find(c => c.id === id)?.razonSocial || 'Desconocido';
  };

  const getClientRfc = (id: string) => {
    return clients.find(c => c.id === id)?.rfc || 'XAXX010101000';
  };

  const handleAddItem = () => {
    setItems([...items, { descripcion: '', cantidad: 1, precioUnitario: 0, categoria: 'MANO DE OBRA', unidadMedida: 'Pza.' }]);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof Omit<QuoteItem, 'id'>, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === idx) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    }));
  };

  // Pre-load original scan template
  const handleLoadScanTemplate = () => {
    setAsunto('Propuesta de suminsitro Instalacion de aires acondicionados');
    
    // Find or locate Arquitectura Residencial
    const matchingClient = clients.find(c => 
      c.razonSocial.toLowerCase().includes('residencial') || 
      c.razonSocial.toLowerCase().includes('arquitectura')
    );
    if (matchingClient) {
      setClientId(matchingClient.id);
      setAtencion(matchingClient.razonSocial);
    } else {
      setAtencion('Arquitectura Residencial');
    }
    
    setEstimado('Arq. Uriel');
    setFecha('2026-05-23');
    setValidezDias(15);
    setTiempoEntrega('2 días');
    setFormaPago('Contado');
    setLugarEntrega('Oaxaca de Juárez, Oax.');
    setIncluyeIva(true);
    setRetencionIsr(false);
    setAnticipoPorcentaje(50);
    setNotas('Nota. Las instalaciones solo aplican con el kitt basico. El kitt basico aplica solo para una distancia de 3.5m a 4m');
    
    setBancoTitular('CARLOS HUGO ANTONIO GARCIA');
    setBancoNombre('BANORTE');
    setBancoCuenta('0822898001');
    setBancoClabe('072 637 00822898001 7');

    setItems([
      {
        categoria: 'MANO DE OBRA',
        descripcion: 'Descripcion de instalación \n1. Perforación en pared para anclaje de evaporador \na) Uso de detector de metales y cables. \nb) Cortes en azotea y/o pared\nc) Posterior a la perforación se sella interior y exterior. El interior solo aplica pasta especial y el exterior aplicación de sellador. \n2. Montaje de condensador en bases especiales para su ventilacion, incluyendo tacones antivibratorios.\n3.Colocacion de manguera de dren en pvc colocado por personal de obra civil de Arquitectura residencial.\n4. Colocación de 1 kits de tuberías de refrigerante de cobre o aleación cobre aluminio. Forrado de tuberías con cinta térmica y cinta aislante, en ductos de pvc de 3 plg ( disparos) elaborador por personal de Arquitectura residencial en coordinacion con nosotros.. \n5. Colocación de condensador en azotea o pared con bases y tacones anti vibratorios.\n6. Elaboración de vacío al sistema con bomba para retirar humedad del interior, prever fugas y validar la vida útil que se requiere',
        cantidad: 4,
        unidadMedida: 'Lote',
        precioUnitario: 1800
      },
      {
        categoria: 'EQUIPOS',
        descripcion: 'Recamarara principal de 3 x 3.75m \nAire acondicionado tipo minisplit de 12000btus',
        cantidad: 1,
        unidadMedida: 'Lote',
        precioUnitario: 8900
      },
      {
        categoria: 'EQUIPOS',
        descripcion: 'Recamarado dos \n3 x 3.90m \n12000btus',
        cantidad: 1,
        unidadMedida: 'Lote',
        precioUnitario: 8900
      },
      {
        categoria: 'EQUIPOS',
        descripcion: 'Sala 17m2 \n18000btus',
        cantidad: 1,
        unidadMedida: 'Lote',
        precioUnitario: 12500
      },
      {
        categoria: 'MATERIALES',
        descripcion: 'Soportes de Piso o techo ( Según aplique)',
        cantidad: 2,
        unidadMedida: 'Pza.',
        precioUnitario: 450
      },
      {
        categoria: 'MATERIALES',
        descripcion: 'Torinilleria y antivibratorios',
        cantidad: 4,
        unidadMedida: 'Lotes',
        precioUnitario: 180
      },
      {
        categoria: 'MATERIALES',
        descripcion: 'Pasta',
        cantidad: 2,
        unidadMedida: 'Kg.',
        precioUnitario: 95
      },
      {
        categoria: 'MATERIALES',
        descripcion: 'Selllador asfaltico',
        cantidad: 3,
        unidadMedida: 'kg.',
        precioUnitario: 80
      },
      {
        categoria: 'MATERIALES',
        descripcion: 'Poliuretano espuma',
        cantidad: 2,
        unidadMedida: 'Pzas.',
        precioUnitario: 150
      },
      {
        categoria: 'MATERIALES',
        descripcion: 'Sellador de gaucho',
        cantidad: 1,
        unidadMedida: 'Galon',
        precioUnitario: 280
      }
    ]);
  };

  // Synchronize client razon social automatically
  React.useEffect(() => {
    if (clientId && !showCreate) { 
      // Safe check
    } else {
      const selectedClient = clients.find(c => c.id === clientId);
      if (selectedClient && !atencion) {
        setAtencion(selectedClient.razonSocial);
      }
    }
  }, [clientId]);

  // Totals calculations
  const subtotal = items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
  const iva = incluyeIva ? Number((subtotal * 0.16).toFixed(2)) : 0;
  const isr = retencionIsr ? Number((subtotal * (retencionIsrPorcentaje / 100)).toFixed(2)) : 0;
  const totalCot = subtotal + iva - isr;

  const handlePostQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      alert('Se requiere seleccionar un cliente.');
      return;
    }

    const compiledItems: QuoteItem[] = items.map((item, idx) => ({
      ...item,
      id: `qi-${Date.now()}-${idx}`
    }));

    const newQuote = addQuote({
      clientId,
      fecha,
      items: compiledItems,
      anticipoRequeridoPorcentaje: Number(anticipoPorcentaje),
      total: totalCot,
      estado: 'Pendiente',
      notas: notas || undefined,
      asunto,
      atencion: atencion || getClientName(clientId),
      estimado,
      incluyeIva,
      retencionIsr,
      retencionIsrPorcentaje,
      validezDias,
      tiempoEntrega,
      formaPago,
      lugarEntrega,
      bancoTitular,
      bancoNombre,
      bancoCuenta,
      bancoClabe
    });

    // Reset
    setShowCreate(false);
    setItems([{ descripcion: 'Servicio técnico especializado de climatización', cantidad: 1, precioUnitario: 1200, categoria: 'MANO DE OBRA', unidadMedida: 'Servicio' }]);
    setNotas('Nota. Las instalaciones solo aplican con el kitt basico. El kitt basico aplica solo para una distancia de 3.5m a 4m');
    setAsunto('Propuesta de suminsitro Instalacion de aires acondicionados');
    setEstimado('Arq. Uriel');
    
    // Automatically trigger visual preview for the newly created quote
    setSelectedQuoteForPreview(newQuote);
  };

  const handleTransferToOs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuoteForOs) return;
    if (!selectedEquipmentItem) {
      alert('Debe seleccionar un equipo técnico del cliente para enlazar la OS.');
      return;
    }

    const anticipoCalculado = Number(((selectedQuoteForOs.anticipoRequeridoPorcentaje / 100) * selectedQuoteForOs.total).toFixed(2));

    addServiceOrder({
      cotizacionFolio: selectedQuoteForOs.folio,
      clientId: selectedQuoteForOs.clientId,
      equipmentId: selectedEquipmentItem,
      fechaProgramada: new Date().toISOString().split('T')[0],
      tecnicoAsignado: assignedTech,
      descripcionServicio: `${selectedQuoteForOs.asunto || 'Propuesta de Servicio'} : ` + selectedQuoteForOs.items.map(i => `${i.cantidad}x ${i.descripcion.split('\n')[0]}`).join(', '),
      tipoMantenimiento: 'Correctivo',
      estado: 'Programada',
      total: selectedQuoteForOs.total,
      anticiposRecibidos: anticipoCalculado,
      facturado: false
    });

    setSelectedQuoteForOs(null);
    setSelectedEquipmentItem('');
    alert(`¡Orden de de Servicio generada con éxito ligada a la cotización ${selectedQuoteForOs.folio}!`);
  };

  const getClientEquipment = (cId: string) => {
    return equipment.filter(e => e.clientId === cId);
  };

  const formatMx = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="quotes-root">
      
      {/* PDF PRINT ONLY WRAPPER for browser's window.print() */}
      {selectedQuoteForPreview && (
        <div className="hidden print:block print:p-0 print-container" id="print-sheet-wrapper">
          <div className="bg-white text-slate-900 p-8 max-w-[800px] mx-auto text-xs space-y-6">
            
            {/* Header Block / Letterhead */}
            <div className="flex justify-between items-start border-b pb-4">
              <div className="space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Mx Ingeniería</h1>
                <div className="text-[10px] text-slate-500 leading-relaxed">
                  <p>EMAIL: <span className="font-semibold text-slate-800">ingdeservicios@hotmail.com</span> • <span className="font-semibold text-slate-800">mxingenieria_adm@hotmail.com</span></p>
                  <p>Dirección: Riberas de San Jerónimo, Calle Atzompa 490 b Yahuiche Oaxaca</p>
                  <p>Teléfono: 9515288766 y Cel. 9515199842</p>
                </div>
              </div>
              <img 
                src="https://cossma.com.mx/mxingenieria.jpeg" 
                alt="Logo MX" 
                className="h-16 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Meta and Client header */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-100 flex-grow">
                <div><b>Atención:</b> {selectedQuoteForPreview.atencion || getClientName(selectedQuoteForPreview.clientId)}</div>
                <div><b>Estimado (a):</b> {selectedQuoteForPreview.estimado || 'Arq. Uriel'}</div>
                <div className="text-slate-700 mt-1"><b>ASUNTO:</b> {selectedQuoteForPreview.asunto || 'Propuesta de suministro Instalación'}</div>
              </div>
              <div className="text-right space-y-1 shrink-0 bg-slate-100/50 p-2.5 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500 font-medium">Oaxaca de Juárez, Oax.</div>
                <div><b>Fecha:</b> {selectedQuoteForPreview.fecha}</div>
                <div className="text-sm font-bold text-red-650">{selectedQuoteForPreview.folio}</div>
              </div>
            </div>

            {/* Categorized proposal Items table */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white font-semibold text-[10px] uppercase">
                    <th className="p-2 w-10 text-center border-r border-slate-700">Item</th>
                    <th className="p-2 border-r border-slate-700">Descripción</th>
                    <th className="p-2 w-16 text-center border-r border-slate-700">Cantidad</th>
                    <th className="p-2 w-16 text-center border-r border-slate-700">Unid. Med</th>
                    <th className="p-2 w-24 text-right border-r border-slate-700">P.U</th>
                    <th className="p-2 w-28 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dynamic render grouped by categories */}
                  {['MANO DE OBRA', 'EQUIPOS', 'MATERIALES', 'OTROS'].map((cat) => {
                    const catItems = selectedQuoteForPreview.items.filter(it => (it.categoria || 'MANO DE OBRA') === cat);
                    if (catItems.length === 0) return null;
                    return (
                      <React.Fragment key={cat}>
                        <tr className="bg-[#f2a900]/95 text-slate-950 font-bold block-header text-[11px] border-y border-slate-200">
                          <td colSpan={6} className="p-1 px-3 uppercase tracking-wider">{cat}</td>
                        </tr>
                        {catItems.map((it, idx) => (
                          <tr key={it.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-[11px] align-top">
                            <td className="p-2 text-center text-slate-400 font-medium border-r">{idx + 1}</td>
                            <td className="p-2 whitespace-pre-line leading-relaxed text-slate-800 border-r">{it.descripcion}</td>
                            <td className="p-2 text-center font-mono font-medium border-r">{it.cantidad}</td>
                            <td className="p-2 text-center text-slate-600 border-r">{it.unidadMedida || 'Lote'}</td>
                            <td className="p-2 text-right font-mono border-r">{formatMx(it.precioUnitario)}</td>
                            <td className="p-2 text-right font-mono font-bold text-slate-900">{formatMx(it.cantidad * it.precioUnitario)}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Notes box */}
            {selectedQuoteForPreview.notas && (
              <div className="p-3 bg-amber-50/40 border border-amber-200/50 rounded text-[10px] text-amber-900 italic">
                {selectedQuoteForPreview.notas}
              </div>
            )}

            {/* Payment Term and Totals Grid */}
            <div className="grid grid-cols-2 gap-6 pt-2">
              
              {/* Conditions & Banks (Left) */}
              <div className="space-y-4 text-[10px] text-slate-600">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">Condiciones Comerciales:</p>
                  <div>• Vencimiento / Vigencia: <b>{selectedQuoteForPreview.validezDias || 15} días</b></div>
                  <div>• Tiempo de entrega: <b>{selectedQuoteForPreview.tiempoEntrega || '2 días'}</b></div>
                  <div>• Forma de pago: <b>{selectedQuoteForPreview.formaPago || 'Contado'}</b></div>
                  <div>• Lugar de entrega: <b>{selectedQuoteForPreview.lugarEntrega || 'Oaxaca de Juárez, Oax.'}</b></div>
                </div>

                {/* Bank */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <p className="font-bold text-slate-800 uppercase text-[9px] tracking-wide flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-slate-500" /> Datos Bancarios para Depósito
                  </p>
                  <div>Titular: <span className="font-semibold text-slate-900">{selectedQuoteForPreview.bancoTitular || 'CARLOS HUGO ANTONIO GARCIA'}</span></div>
                  <div>Banco: <span className="font-semibold text-slate-900">{selectedQuoteForPreview.bancoNombre || 'BANORTE'}</span></div>
                  <div>Cuenta: <span className="font-semibold text-slate-900 font-mono">{selectedQuoteForPreview.bancoCuenta || '0822898001'}</span></div>
                  <div>CLABE Interbancaria: <span className="font-semibold text-slate-900 font-mono">{selectedQuoteForPreview.bancoClabe || '072 637 00822898001 7'}</span></div>
                </div>
              </div>

              {/* Totals Block (Right) */}
              <div className="space-y-1.5 self-start text-right">
                {(() => {
                  const itemsSum = selectedQuoteForPreview.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
                  const taxIva = selectedQuoteForPreview.incluyeIva ? itemsSum * 0.16 : 0;
                  const taxIsr = selectedQuoteForPreview.retencionIsr ? itemsSum * ((selectedQuoteForPreview.retencionIsrPorcentaje || 1.25) / 100) : 0;
                  const finalTotal = itemsSum + taxIva - taxIsr;
                  
                  return (
                    <div className="inline-block w-full max-w-[280px] bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Subtotal:</span>
                        <span className="font-mono">{formatMx(itemsSum)}</span>
                      </div>
                      
                      {selectedQuoteForPreview.incluyeIva && (
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>I.V.A (16%):</span>
                          <span className="font-mono">{formatMx(taxIva)}</span>
                        </div>
                      )}

                      {selectedQuoteForPreview.retencionIsr && (
                        <div className="flex justify-between text-red-650 text-[11px]">
                          <span>Retención ISR ({selectedQuoteForPreview.retencionIsrPorcentaje || 1.25}%):</span>
                          <span className="font-mono">-{formatMx(taxIsr)}</span>
                        </div>
                      )}

                      <div className="border-t pt-1.5 flex justify-between text-slate-900 font-extrabold text-sm font-mono">
                        <span>Total MXN:</span>
                        <span className="text-red-650">{formatMx(finalTotal)}</span>
                      </div>

                      {selectedQuoteForPreview.anticipoRequeridoPorcentaje > 0 && (
                        <div className="text-[9px] text-slate-400 text-center pt-2 border-t border-dashed mt-1.5">
                          Anticipo del {selectedQuoteForPreview.anticipoRequeridoPorcentaje}% requerido para inicio: <b>{formatMx(finalTotal * (selectedQuoteForPreview.anticipoRequeridoPorcentaje / 100))}</b>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Signature row */}
            <div className="pt-8 text-center flex justify-around items-center text-[10px] text-slate-400 no-print">
              <div className="space-y-1">
                <div className="w-40 border-b border-slate-300 mx-auto h-12"></div>
                <div>Elaboró: Ing. Carlos Hugo A.</div>
                <div className="text-[9px]">MX Ingeniería</div>
              </div>
              <div className="space-y-1">
                <div className="w-40 border-b border-slate-300 mx-auto h-12"></div>
                <div>Autoriza Cliente</div>
                <div className="text-[9px]">Firma de Aceptación</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Screen view content */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Generación de Cotizaciones</h2>
          <p className="text-sm text-slate-500">Creación de propuestas de servicio estructuradas basado en el formato original de Mx Ingeniería.</p>
        </div>
        <button
          onClick={() => {
            setShowCreate(true);
            // Default to empty item with category
            setItems([{ descripcion: '', cantidad: 1, precioUnitario: 0, categoria: 'MANO DE OBRA', unidadMedida: 'Lote' }]);
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shadow-red-500/10 cursor-pointer"
        >
          <FilePlus2 className="w-4 h-4" /> Crear Propuesta
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 no-print" id="quotes-layout">
        
        {/* Quotes List Section */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 flex justify-between text-xs font-bold text-slate-500">
            <span>Propuestas Emitidas</span>
            <span>Unidades: {quotes.length}</span>
          </div>

          <div className="space-y-3 font-sans" id="quotes-list-container">
            {quotes.map(q => {
              const cliName = getClientName(q.clientId);
              const anticipoRequerido = Number(((q.anticipoRequeridoPorcentaje / 100) * q.total).toFixed(2));
              return (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-slate-200 transition-all">
                  
                  {/* Left Metadata card info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-red-650 bg-red-50/50 px-2 py-0.5 rounded border border-red-250">
                        {q.folio}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Emitido: {q.fecha}
                      </span>
                      {q.asunto && (
                        <span className="text-[11px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                          {q.asunto.length > 50 ? q.asunto.substring(0, 50) + '...' : q.asunto}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{q.atencion || cliName}</h4>
                      {q.estimado && <p className="text-[11px] text-slate-400">Atención: <b>{q.estimado}</b></p>}
                    </div>

                    {/* Quotation items breakdown overview */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] border border-slate-100 max-h-36 overflow-y-auto">
                      {q.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-start text-slate-600 text-xs py-0.5 border-b border-slate-100 last:border-b-0 gap-6">
                          <span className="flex-1 truncate"><b className="text-red-600 font-semibold mr-1">[{it.categoria || 'MANO DE OBRA'}]</b> {it.descripcion.split('\n')[0]}</span>
                          <span className="font-mono shrink-0 font-medium">{it.cantidad} {it.unidadMedida || 'Lote'} x {formatMx(it.precioUnitario)} = {formatMx(it.cantidad * it.precioUnitario)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Anticipos Info badge */}
                    {q.anticipoRequeridoPorcentaje > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-red-700 bg-red-50/50 p-1.5 px-2.5 rounded-xl w-max font-medium border border-red-100">
                        <Coins className="w-3.5 h-3.5 text-red-600" />
                        <span>Anticipo del {q.anticipoRequeridoPorcentaje}%: <b>{formatMx(anticipoRequerido)}</b> para autorizar.</span>
                      </div>
                    )}
                  </div>

                  {/* Right actions and status picker */}
                  <div className="flex sm:flex-col items-end gap-3 justify-between self-stretch sm:self-auto text-right shrink-0">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cotizado</span>
                      <span className="text-xl font-extrabold text-slate-800 font-mono text-red-650">{formatMx(q.total)}</span>
                    </div>

                    {/* State Buttons / Conversion Button */}
                    <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                      
                      {/* PDF Actions */}
                      <button
                        onClick={() => setSelectedQuoteForPreview(q)}
                        className="py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver PDF original
                      </button>

                      <div className="flex items-center gap-1.5 justify-end">
                        {q.estado === 'Pendiente' ? (
                          <div className="flex gap-1 w-full justify-end">
                            <button
                              onClick={() => updateQuoteStatus(q.id, 'Aprobado')}
                              className="p-1 px-2.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                              title="Aprobar Propuesta"
                            >
                              <Check className="w-3.5 h-3.5" /> Aprobar
                            </button>
                            <button
                              onClick={() => updateQuoteStatus(q.id, 'Rechazado')}
                              className="p-1 px-2.5 bg-rose-50 text-rose-700 border border-rose-300 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors"
                              title="Rechazar Propuesta"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase ${
                              q.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {q.estado}
                            </span>

                            {q.estado === 'Aprobado' && (
                              <button
                                onClick={() => {
                                  setSelectedQuoteForOs(q);
                                  const clientEq = getClientEquipment(q.clientId);
                                  if (clientEq.length > 0) {
                                    setSelectedEquipmentItem(clientEq[0].id);
                                  }
                                }}
                                className="py-1 px-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-2xs cursor-pointer"
                                title="Generar Foliado Cruzado: Convertir a Órden de Servicio"
                              >
                                <ArrowRightLeft className="w-3 h-3" /> Generar OS
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Quick configuration settings block */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-4 font-sans no-print">
          <h3 className="font-bold text-slate-800 flex items-center gap-1">
            <Receipt className="text-slate-500 w-4 h-4" /> Configuración de Foliador
          </h3>
          <p className="text-slate-600 leading-relaxed font-semibold">
            El sistema de foliado secuencial añade correlatividad según el año fiscal actual.
          </p>
          <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-600">
            <div>Prefijo: <b className="text-slate-900">COT</b></div>
            <div>Año: <b className="text-slate-900">2026</b></div>
            <div>Consecutivo: <b className="text-red-600">+{quotes.length + 1}</b></div>
            <div>Siguiente Folio: <b className="text-emerald-600">COT-2026-{String(quotes.length + 1).padStart(3, '0')}</b></div>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed text-[10px]">
            <b>Información Fiscal:</b> Los precios generados pueden sumar el 16% de IVA y realizar la retención ISR de forma directa, tal como se especifica en los formatos oficiales de Mx Ingeniería.
          </div>
        </div>
      </div>

      {/* MODAL: CREATE PROPUESTA */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-250 p-6 w-full max-w-4xl space-y-4 max-h-[95vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center text-slate-800 border-b pb-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                    <FilePlus2 className="text-red-600" /> Crear Propuesta Cotizada (MX Ingeniería)
                  </h3>
                  <p className="text-[11px] text-slate-500">Formule propuestas detalladas con los lineamientos del formato oficial.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadScanTemplate}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-850 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                    title="Carga la cotización de 'Arquitectura Residencial' del PDF"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    Cargar Ejemplo PDF Original
                  </button>
                  <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl">×</button>
                </div>
              </div>

              <form onSubmit={handlePostQuote} className="space-y-4 text-xs font-sans">
                
                {/* 1. Datos Generales de Encabezado */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Datos Generales de Encabezado
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    {/* Client Selector */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Prospecto / Cliente</label>
                      <select
                        value={clientId}
                        onChange={(e) => {
                          setClientId(e.target.value);
                          const cl = clients.find(c => c.id === e.target.value);
                          if (cl) setAtencion(cl.razonSocial);
                        }}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                        required
                      >
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>{c.razonSocial} (S/N: {getClientRfc(c.id)})</option>
                        ))}
                      </select>
                    </div>

                    {/* Atencion Override */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Atención (Razón Social/Contacto)</label>
                      <input
                        type="text"
                        placeholder="Ej: Arquitectura Residencial"
                        value={atencion}
                        onChange={(e) => setAtencion(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                        required
                      />
                    </div>

                    {/* Estimado(a) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Estimado (a)</label>
                      <input
                        type="text"
                        placeholder="Ej: Arq. Uriel"
                        value={estimado}
                        onChange={(e) => setEstimado(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                        required
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    {/* Asunto */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="font-semibold text-slate-700">Asunto de la Propuesta</label>
                      <input
                        type="text"
                        placeholder="Ej: Propuesta de suminsitro Instalacion de aires acondicionados"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                        required
                      />
                    </div>

                    {/* Fecha */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Fecha de Emisión</label>
                      <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono"
                        required
                      />
                    </div>

                  </div>
                </div>

                {/* 2. Partidas de la Cotización */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Conceptos / Partidas</h4>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-650 font-extrabold rounded-lg hover:underline flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar Partida
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                    {items.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-3xs flex flex-col gap-2 relative">
                        
                        {/* Selector de Categoría, Unidad de Medida, Eliminar */}
                        <div className="flex justify-between items-center gap-2 border-b pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-mono font-bold text-[10px] text-slate-500">
                              {idx + 1}
                            </span>
                            <select
                              value={item.categoria || 'MANO DE OBRA'}
                              onChange={(e) => handleItemChange(idx, 'categoria', e.target.value)}
                              className="p-1 px-2.5 bg-red-50 font-bold text-[10px] text-red-700 rounded-lg border border-red-200/40 focus:outline-red-500"
                            >
                              <option value="MANO DE OBRA">MANO DE OBRA</option>
                              <option value="EQUIPOS">EQUIPOS</option>
                              <option value="MATERIALES">MATERIALES</option>
                              <option value="OTROS">OTROS</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Unidad:</span>
                            <input
                              type="text"
                              required
                              placeholder="Lote, Pza., Kg..."
                              value={item.unidadMedida || ''}
                              onChange={(e) => handleItemChange(idx, 'unidadMedida', e.target.value)}
                              className="p-1 w-20 border border-slate-200 rounded text-center text-xs"
                            />
                            
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1 text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 rounded transition-all ml-1"
                                title="Eliminar partida"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Descripción y Valores */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                          <div className="md:col-span-2 space-y-1">
                            <textarea
                              required
                              rows={2}
                              placeholder="Escriba la descripción concisa o detallada del trabajo..."
                              value={item.descripcion}
                              onChange={(e) => handleItemChange(idx, 'descripcion', e.target.value)}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500 text-xs leading-relaxed"
                            ></textarea>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 block font-bold">Cantidad</label>
                            <input
                              type="number"
                              required
                              min={1}
                              placeholder="Cant"
                              value={item.cantidad}
                              onChange={(e) => handleItemChange(idx, 'cantidad', Number(e.target.value))}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono text-center"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 block font-bold">P. Unitario ($)</label>
                            <input
                              type="number"
                              required
                              min={0}
                              placeholder="P.U"
                              value={item.precioUnitario}
                              onChange={(e) => handleItemChange(idx, 'precioUnitario', Number(e.target.value))}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500 font-mono text-right"
                            />
                          </div>
                        </div>

                        {/* Calculated line total */}
                        <div className="text-right text-[10px] text-slate-400 font-mono">
                          Importe: <b>{formatMx(item.cantidad * item.precioUnitario)}</b>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Condiciones y Datos de Pago */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Condiciones Comerciales */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Condiciones Comerciales</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Validez (Vigencia)</label>
                        <select
                          value={validezDias}
                          onChange={(e) => setValidezDias(Number(e.target.value))}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                        >
                          <option value={7}>7 días naturales</option>
                          <option value={15}>15 días naturales</option>
                          <option value={30}>30 días naturales</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Tiempo de Entrega</label>
                        <input
                          type="text"
                          placeholder="Ej. 2 días"
                          value={tiempoEntrega}
                          onChange={(e) => setTiempoEntrega(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Forma de Pago</label>
                        <input
                          type="text"
                          placeholder="Ej: Contado"
                          value={formaPago}
                          onChange={(e) => setFormaPago(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Lugar de Entrega</label>
                        <input
                          type="text"
                          placeholder="Oaxaca de Juárez, Oax."
                          value={lugarEntrega}
                          onChange={(e) => setLugarEntrega(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Anticipo Solicitado (%)</label>
                      <select
                        value={anticipoPorcentaje}
                        onChange={(e) => setAnticipoPorcentaje(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                      >
                        <option value={0}>Sin anticipo (0%)</option>
                        <option value={30}>30% de Anticipo</option>
                        <option value={50}>50% de Anticipo (Recomendado)</option>
                        <option value={75}>75% de Anticipo</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Nota del Pie (Ej: Kit de instalación)</label>
                      <input
                        type="text"
                        placeholder="..."
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                      />
                    </div>
                  </div>

                  {/* Impuestos e Instrucciones Bancarias */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">Impuestos y Retenciones</h4>
                      
                      <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-100">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={incluyeIva}
                            onChange={(e) => setIncluyeIva(e.target.checked)}
                            className="rounded text-red-600 focus:ring-red-500"
                          />
                          <span className="font-medium text-slate-800">Agregar IVA General del 16%</span>
                        </label>

                        <div className="border-t border-dashed my-2"></div>

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={retencionIsr}
                              onChange={(e) => setRetencionIsr(e.target.checked)}
                              className="rounded text-red-600 focus:ring-red-500"
                            />
                            <span className="font-medium text-slate-800">Aplicar Retención de ISR</span>
                          </label>
                          {retencionIsr && (
                            <div className="flex items-center gap-2 pl-6">
                              <span className="text-slate-500">Porcentaje:</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="1.25"
                                value={retencionIsrPorcentaje}
                                onChange={(e) => setRetencionIsrPorcentaje(Number(e.target.value))}
                                className="p-1 px-2 border w-20 text-center font-mono rounded text-xs"
                              />
                              <span className="font-mono text-slate-400">%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Datos del Banco */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5 text-slate-400" /> Cuentas de Cobro / Transferencia
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Banco</span>
                          <input
                            type="text"
                            value={bancoNombre}
                            onChange={(e) => setBancoNombre(e.target.value)}
                            className="w-full p-1.5 text-xs bg-white border rounded"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Titular</span>
                          <input
                            type="text"
                            value={bancoTitular}
                            onChange={(e) => setBancoTitular(e.target.value)}
                            className="w-full p-1.5 text-xs bg-white border rounded"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Cuenta</span>
                          <input
                            type="text"
                            value={bancoCuenta}
                            onChange={(e) => setBancoCuenta(e.target.value)}
                            className="w-full p-1.5 text-xs bg-white border font-mono rounded"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">CLABE</span>
                          <input
                            type="text"
                            value={bancoClabe}
                            onChange={(e) => setBancoClabe(e.target.value)}
                            className="w-full p-1.5 text-xs bg-white border font-mono rounded"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live calculation Overview */}
                <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center border border-zinc-800 shadow-lg pr-6">
                  <div>
                    <span className="text-zinc-400 font-medium text-[11px]">Resumen de Cálculo en Vivo:</span>
                    <div className="flex gap-4 text-[10px] text-zinc-400 mt-1">
                      <span>Subtotal: <b>{formatMx(subtotal)}</b></span>
                      {incluyeIva && <span>IVA: <b>{formatMx(iva)}</b></span>}
                      {retencionIsr && <span>Ret. ISR ({retencionIsrPorcentaje}%): <b className="text-red-400">-{formatMx(isr)}</b></span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Importe Total Propuesto</span>
                    <span className="text-2xl font-black font-mono text-red-500">{formatMx(totalCot)}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex gap-2 justify-end pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer shadow-md shadow-red-500/10"
                  >
                    Confirmar y Registrar Propuesta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: FULL PREVIEW SHEET (SIMULATED PDF EXTRACTOR AND VIEWER) */}
      <AnimatePresence>
        {selectedQuoteForPreview && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-100 rounded-2xl shadow-2xl border border-slate-300 p-6 w-full max-w-[850px] relative mt-10 mb-10"
            >
              
              {/* Modal control bar header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-250 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Eye className="text-red-650" /> Visor de Documento PDF • {selectedQuoteForPreview.folio}
                  </h3>
                  <p className="text-[10px] text-slate-550">Simulación del documento oficial listo para impresión y envío.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm shadow-red-500/10 cursor-pointer"
                    title="Imprimir documento real"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Imprimir / Descargar PDF
                  </button>
                  
                  <button
                    onClick={() => {
                      alert("Simulando descarga de archivo PDF: " + selectedQuoteForPreview.folio + ".pdf");
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                    title="Exportar archivo"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Exportar
                  </button>

                  <button 
                    onClick={() => setSelectedQuoteForPreview(null)} 
                    className="text-slate-400 hover:text-slate-600 font-bold bg-white p-1 px-2.5 rounded-xl border border-slate-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              {/* SHEET BODY CONTAINER - Renders exact visual replication from PDF scans */}
              <div className="bg-white text-slate-900 p-8 rounded-lg shadow-inner max-w-full overflow-x-auto border border-slate-300 relative select-text" id="pdf-mock-sheet">
                
                {/* 1. Header and image logo */}
                <div className="flex justify-between items-start gap-4 border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <h1 className="text-base font-extrabold tracking-tight text-slate-900 uppercase">Mx Ingeniería</h1>
                    <div className="text-[9px] text-slate-500 leading-normal font-sans">
                      <p>EMAIL: <span className="text-slate-800 font-semibold underline">ingdeservicios@hotmail.com</span> • <span className="text-slate-800 font-semibold underline">mxingenieria_adm@hotmail.com</span></p>
                      <p>Dirección: Riberas de San Jerónimo, Calle Atzompa 490 b Yahuiche Oaxaca</p>
                      <p>Teléfono: 9515288766 y Cel. 9515199842</p>
                    </div>
                  </div>
                  
                  {/* Real logo displayed without frames */}
                  <img 
                    src="https://cossma.com.mx/mxingenieria.jpeg" 
                    alt="MX Ingeniería" 
                    className="h-14 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* 2. Client Metadata block and Date info */}
                <div className="flex justify-between items-stretch gap-6 pt-4 text-[10px]">
                  
                  {/* Client card */}
                  <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-slate-400 block font-bold text-[8px] uppercase tracking-wider">Prospecto / Cliente</span>
                      <b className="text-[11px] text-slate-800">{selectedQuoteForPreview.atencion || getClientName(selectedQuoteForPreview.clientId)}</b>
                    </div>
                    <div className="mt-2 text-slate-600">
                      <div><b>Atención:</b> {selectedQuoteForPreview.atencion || getClientName(selectedQuoteForPreview.clientId)}</div>
                      <div><b>Estimado (a):</b> {selectedQuoteForPreview.estimado || 'Arq. Uriel'}</div>
                    </div>
                  </div>

                  {/* Date and Quote sequential Folio */}
                  <div className="w-52 bg-slate-50 p-3 rounded-lg border border-slate-100 text-right space-y-1">
                    <div className="text-slate-400 text-[8px] uppercase font-bold tracking-wider">Folio Informativo</div>
                    <div className="text-base font-black text-red-600 tracking-tight">{selectedQuoteForPreview.folio}</div>
                    <div className="text-slate-500 text-[9px] pt-1">
                      Oaxaca de Juárez, Oax. <br />
                      A {selectedQuoteForPreview.fecha}
                    </div>
                  </div>

                </div>

                {/* 3. Subject block */}
                <div className="mt-3 bg-red-50/50 p-2.5 rounded border border-red-100/50 text-[10px] text-red-950 font-medium">
                  ASUNTO: <span className="font-extrabold">{selectedQuoteForPreview.asunto || 'Propuesta de suminsitro Instalasión de aires acondicionados'}</span>
                </div>

                {/* 4. Categorized parts list matching yellow headers from PDF scanned sheets */}
                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold uppercase text-[9px]">
                        <th className="p-2 w-10 text-center border-r border-slate-755">Item</th>
                        <th className="p-2 border-r border-slate-755">Descripción del Concepto</th>
                        <th className="p-2 w-16 text-center border-r border-slate-755">Cantidad</th>
                        <th className="p-2 w-16 text-center border-r border-slate-755">Medida</th>
                        <th className="p-2 w-20 text-right border-r border-slate-755">P.U</th>
                        <th className="p-2 w-24 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['MANO DE OBRA', 'EQUIPOS', 'MATERIALES', 'OTROS'].map((cat) => {
                        const catItems = selectedQuoteForPreview.items.filter(it => (it.categoria || 'MANO DE OBRA') === cat);
                        if (catItems.length === 0) return null;
                        
                        return (
                          <React.Fragment key={cat}>
                            {/* Gold header block similar to yellow rows on scanned sheets */}
                            <tr className="bg-[#f1b80d] text-slate-950 font-black text-[10px] uppercase border-y border-slate-200">
                              <td colSpan={6} className="p-1 px-4 tracking-wider">{cat}</td>
                            </tr>
                            {catItems.map((it, idx) => (
                              <tr key={it.id} className="border-b border-slate-100 hover:bg-slate-50/50 text-[10px] align-top">
                                <td className="p-2 text-center text-slate-400 font-medium border-r border-slate-100">{idx + 1}</td>
                                <td className="p-2 whitespace-pre-line leading-relaxed text-slate-800 border-r border-slate-100">{it.descripcion}</td>
                                <td className="p-2 text-center font-bold font-mono border-r border-slate-100 text-slate-700">{it.cantidad}</td>
                                <td className="p-2 text-center text-slate-600 border-r border-slate-100">{it.unidadMedida || 'Lote'}</td>
                                <td className="p-2 text-right font-mono border-r border-slate-100 text-slate-600">{formatMx(it.precioUnitario)}</td>
                                <td className="p-2 text-right font-mono font-bold text-slate-900">{formatMx(it.cantidad * it.precioUnitario)}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 5. Custom Scope Footnote banner */}
                {selectedQuoteForPreview.notas && (
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded text-[9px] text-slate-500 italic">
                    <b>Nota:</b> {selectedQuoteForPreview.notas}
                  </div>
                )}

                {/* 6. Bank accounts and Totals Breakdown summary */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Left: Commercial conditions & Banks */}
                  <div className="space-y-4 text-[9px] text-slate-500">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 uppercase tracking-wider text-[8px]">Condiciones del Servicio</p>
                      <div>• Cotización vigente por: <b>{selectedQuoteForPreview.validezDias || 15} días</b></div>
                      <div>• Tiempo de entrega estimado: <b>{selectedQuoteForPreview.tiempoEntrega || '2 días'}</b></div>
                      <div>• Forma de pago acordada: <b>{selectedQuoteForPreview.formaPago || 'Contado'}</b></div>
                      <div>• Lugar de entrega: <b>{selectedQuoteForPreview.lugarEntrega || 'Oaxaca de Juárez, Oax.'}</b></div>
                    </div>

                    {/* Bank Wire Accounts card matching "BANORTE" scanned records */}
                    <div className="p-3 bg-[#f8fafc] border border-slate-200 rounded-lg space-y-1">
                      <span className="font-black text-slate-800 uppercase text-[8px] tracking-wider flex items-center gap-1.5">
                        <Landmark className="w-3 h-3 text-red-650" /> DATOS BANCARIOS DE DEPÓSITO
                      </span>
                      <div className="text-[10px] text-slate-700 pt-1 space-y-0.5">
                        <p>A nombre de: <b>{selectedQuoteForPreview.bancoTitular || 'CARLOS HUGO ANTONIO GARCIA'}</b></p>
                        <p>Banco: <b>{selectedQuoteForPreview.bancoNombre || 'BANORTE'}</b></p>
                        <p>Número de Cuenta: <b className="font-mono">{selectedQuoteForPreview.bancoCuenta || '0822898001'}</b></p>
                        <p>CLABE Interbancaria: <b className="font-mono text-slate-900">{selectedQuoteForPreview.bancoClabe || '072 637 00822898001 7'}</b></p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Calculations blocks */}
                  <div className="space-y-1 self-start text-right">
                    {(() => {
                      const itemsSum = selectedQuoteForPreview.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
                      const taxIva = selectedQuoteForPreview.incluyeIva ? itemsSum * 0.16 : 0;
                      const taxIsr = selectedQuoteForPreview.retencionIsr ? itemsSum * ((selectedQuoteForPreview.retencionIsrPorcentaje || 1.25) / 100) : 0;
                      const finalTotal = itemsSum + taxIva - taxIsr;

                      return (
                        <div className="inline-block w-full max-w-[300px] bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[10px] space-y-1.5">
                          <div className="flex justify-between text-slate-500">
                            <span>Subtotal:</span>
                            <span className="font-mono">{formatMx(itemsSum)}</span>
                          </div>
                          
                          {selectedQuoteForPreview.incluyeIva && (
                            <div className="flex justify-between text-slate-500">
                              <span>I.V.A (16%):</span>
                              <span className="font-mono">{formatMx(taxIva)}</span>
                            </div>
                          )}

                          {selectedQuoteForPreview.retencionIsr && (
                            <div className="flex justify-between text-red-600">
                              <span>(-) Retención ISR ({selectedQuoteForPreview.retencionIsrPorcentaje || 1.25}%):</span>
                              <span className="font-mono">-{formatMx(taxIsr)}</span>
                            </div>
                          )}

                          <div className="border-t pt-2 mt-1 flex justify-between text-slate-900 font-extrabold text-xs">
                            <span className="uppercase text-[9px] text-slate-700">Total Neto:</span>
                            <span className="text-red-655 font-mono text-base">{formatMx(finalTotal)}</span>
                          </div>

                          {selectedQuoteForPreview.anticipoRequeridoPorcentaje > 0 && (
                            <div className="text-[9px] text-[#4d3200] bg-orange-50/50 p-1.5 rounded border border-orange-100 text-center font-medium">
                              Arranque del {selectedQuoteForPreview.anticipoRequeridoPorcentaje}%: <b>{formatMx(finalTotal * (selectedQuoteForPreview.anticipoRequeridoPorcentaje / 100))}</b>
                            </div>
                          )}

                          <p className="text-[8px] text-slate-400 text-center uppercase pt-1">Precios en Pesos Mexicanos (MXN)</p>
                        </div>
                      );
                    })()}
                  </div>

                </div>

                {/* Print watermark/helper */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between text-[8px] text-slate-400">
                  <span>Generado digitalmente por ERP de MX Ingeniería</span>
                  <span>Oaxaca de Juárez, Oax. • {selectedQuoteForPreview.fecha}</span>
                </div>

              </div>

              {/* Instructions below the preview */}
              <div className="mt-4 bg-amber-50 p-3 rounded-xl border border-amber-200/40 text-amber-900 text-xs flex gap-2 items-start leading-relaxed">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <b>Consejo de Exportación:</b> Haz clic en el botón <b>"Imprimir / Descargar PDF"</b> para activar el cuadro de diálogo de impresión real de tu navegador. Configura la impresora como <b>"Guardar como PDF"</b> para descargar el documento con calidad vectorial perfecta e idéntica al original físico.
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CONVERT APPROVED TO OS (FOLIADO CRUZADO) */}
      <AnimatePresence>
        {selectedQuoteForOs && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md space-y-4 font-sans text-xs"
            >
              <div className="flex justify-between items-center text-slate-800 border-b pb-2">
                <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                  <FileCheck2 className="text-emerald-650 w-5 h-5" /> Foliado Cruzado: Emitir OS
                </h3>
                <button onClick={() => setSelectedQuoteForOs(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg">×</button>
              </div>

              <form onSubmit={handleTransferToOs} className="space-y-4">
                <div className="bg-emerald-50/50 p-3.5 rounded-xl space-y-1.5 border border-emerald-100 text-slate-700">
                  <div>Origen de Foliado Cotización: <b className="font-mono text-emerald-800 bg-emerald-100/50 px-1.5 py-0.5 rounded border border-emerald-200">{selectedQuoteForOs.folio}</b></div>
                  <div>Cliente asignado: <b>{getClientName(selectedQuoteForOs.clientId)}</b></div>
                  <div>Monto del Proyecto: <b className="font-mono text-emerald-700">{formatMx(selectedQuoteForOs.total)}</b></div>
                </div>

                {/* Equipment Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">Asignar Equipo Instalado</label>
                  {getClientEquipment(selectedQuoteForOs.clientId).length === 0 ? (
                    <p className="text-xs text-rose-500 font-semibold bg-rose-50 p-2.5 rounded border border-rose-100/50 leading-relaxed">
                      ⚠️ El cliente seleccionado no tiene equipos asignados en su Hojas de Vida. Vaya al módulo "Hojas de Vida" para registrar un equipo primero para poder ligar de forma correcta la Orden de Servicio.
                    </p>
                  ) : (
                    <select
                      value={selectedEquipmentItem}
                      onChange={(e) => setSelectedEquipmentItem(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                    >
                      {getClientEquipment(selectedQuoteForOs.clientId).map(e => (
                        <option key={e.id} value={e.id}>{e.marca} — {e.modelo} (Serie: {e.numeroSerie})</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Tech Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">Técnico Responsable</label>
                  <select
                    value={assignedTech}
                    onChange={(e) => setAssignedTech(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-red-500"
                  >
                    <option value="Ing. Carlos Mendoza">Ing. Carlos Mendoza</option>
                    <option value="Téc. Fernando Ruiz">Téc. Fernando Ruiz</option>
                    <option value="Téc. Sofía Hernández">Téc. Sofía Hernández</option>
                    <option value="Téc. Manuel Ortega">Téc. Manuel Ortega</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedQuoteForOs(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={getClientEquipment(selectedQuoteForOs.clientId).length === 0}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Emitir Orden Cruzada
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
