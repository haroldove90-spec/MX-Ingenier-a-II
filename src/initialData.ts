import { Client, Equipment, Intervention, Quote, ServiceOrder, MaintenanceAlert, Material, Tool, Invoice } from './types';

export const initialClients: Client[] = [
  {
    id: 'cli-1',
    razonSocial: 'Hoteles del Pacífico S.A. de C.V.',
    rfc: 'HPA950812HP1',
    email: 'contacto@hotelespacifico.mx',
    telefono: '5541235678',
    direcciones: [
      'Av. Costera Miguel Alemán 120, Acapulco Gro.',
      'Boulevard Kukulcán Km 12.5, Zona Hotelera, Cancún Q. Roo'
    ]
  },
  {
    id: 'cli-2',
    razonSocial: 'Corporativo Alimentos del Norte',
    rfc: 'CAN100415AN3',
    email: 'mantenimiento@alimentosnorte.com.mx',
    telefono: '8183456789',
    direcciones: [
      'Carr. Nacional Km 250, Monterrey N.L.',
      'Av. Industrial 405, Parque Industrial APODACA, N.L.'
    ]
  },
  {
    id: 'cli-3',
    razonSocial: 'Clínicas Médicas del Centro',
    rfc: 'CMC081120CM9',
    email: 'administracion@clinicasdelcentro.org',
    telefono: '3336123456',
    direcciones: [
      'Calzada de la República 560, Guadalajara Jal.'
    ]
  }
];

export const initialEquipment: Equipment[] = [
  {
    id: 'eq-1',
    clientId: 'cli-1',
    marca: 'Carrier',
    modelo: '50TC-A06-A1A',
    numeroSerie: 'CAR-50TC-998877',
    capacidad: '5 Toneladas (60,000 BTUs)',
    gasRefrigerante: 'R-410A',
    voltaje: '220V Trifásico',
    ubicacion: 'Av. Costera Miguel Alemán 120, Acapulco Gro. - Área de Lobby'
  },
  {
    id: 'eq-2',
    clientId: 'cli-1',
    marca: 'Trane',
    modelo: 'TWE060D300B',
    numeroSerie: 'TRA-TWE-112233',
    capacidad: '3 Toneladas (36,000 BTUs)',
    gasRefrigerante: 'R-410A',
    voltaje: '220V Bifásico',
    ubicacion: 'Av. Costera Miguel Alemán 120, Acapulco Gro. - Oficinas Administrativas'
  },
  {
    id: 'eq-3',
    clientId: 'cli-2',
    marca: 'York',
    modelo: 'YHE36B21S',
    numeroSerie: 'YOR-YHE-445566',
    capacidad: '7.5 Toneladas (90,000 BTUs)',
    gasRefrigerante: 'R-407C',
    voltaje: '440V Trifásico',
    ubicacion: 'Carr. Nacional Km 250, Monterrey N.L. - Cuarto de Servidores'
  },
  {
    id: 'eq-4',
    clientId: 'cli-3',
    marca: 'Daikin',
    modelo: 'VRV-IV-S',
    numeroSerie: 'DAI-VRV-778899',
    capacidad: '10 Toneladas (120,000 BTUs)',
    gasRefrigerante: 'R-410A',
    voltaje: '220V Trifásico',
    ubicacion: 'Calzada de la República 560, Guadalajara Jal. - Quirófano A'
  }
];

export const initialInterventions: Intervention[] = [
  {
    id: 'int-1',
    equipmentId: 'eq-1',
    fecha: '2026-04-10',
    trabajoRealizado: 'Limpieza profunda de serpentines, soplado de drenaje y cambio de filtros de aire de retorno.',
    tecnico: 'Ing. Carlos Mendoza',
    ordenServicioFolio: 'OS-001'
  },
  {
    id: 'int-2',
    equipmentId: 'eq-3',
    fecha: '2026-05-02',
    trabajoRealizado: 'Detección de fuga en soldadura de succión, recarga de 2.5 kg de refrigerante R-407C.',
    tecnico: 'Téc. Fernando Ruiz',
    ordenServicioFolio: 'OS-002'
  }
];

export const initialQuotes: Quote[] = [
  {
    id: 'q-1',
    folio: 'COT-2026-001',
    clientId: 'cli-1',
    fecha: '2026-05-15',
    items: [
      { id: 'qi-1', descripcion: 'Suministro e instalación de Compresor Hermético de 5 Ton Carrier', cantidad: 1, precioUnitario: 18500 },
      { id: 'qi-2', descripcion: 'Mano de obra especializada por sustitución y vacío de sistema', cantidad: 1, precioUnitario: 4500 },
      { id: 'qi-3', descripcion: 'Gas Refrigerante R-410A de soporte (Cilindro parcial)', cantidad: 3, precioUnitario: 950 }
    ],
    anticipoRequeridoPorcentaje: 50,
    total: 25850,
    estado: 'Aprobado',
    notas: 'Requiere 50% de anticipo para compra de refacciones.'
  },
  {
    id: 'q-2',
    folio: 'COT-2026-002',
    clientId: 'cli-2',
    fecha: '2026-05-20',
    items: [
      { id: 'qi-4', descripcion: 'Mantenimiento Preventivo Bimestral para 3 unidades paquete York', cantidad: 3, precioUnitario: 1800 },
      { id: 'qi-5', descripcion: 'Pastillas bactericidas y lavado químico de serpentín', cantidad: 3, precioUnitario: 250 }
    ],
    anticipoRequeridoPorcentaje: 0,
    total: 6150,
    estado: 'Pendiente',
    notas: 'Cotización sujeta a aprobación presupuestaria del corporativo.'
  },
  {
    id: 'q-3',
    folio: 'COT-2026-003',
    clientId: 'cli-3',
    fecha: '2026-05-22',
    items: [
      { id: 'qi-6', descripcion: 'Sustitución de Tarjeta Electrónica Principal Daikin VRV', cantidad: 1, precioUnitario: 12400 },
      { id: 'qi-7', descripcion: 'Pruebas de comunicación, reprogramación de termostato y puesta en marcha', cantidad: 1, precioUnitario: 2200 }
    ],
    anticipoRequeridoPorcentaje: 50,
    total: 14600,
    estado: 'Aprobado',
    notas: 'Urgente para área de quirófanos.'
  }
];

export const initialServiceOrders: ServiceOrder[] = [
  {
    id: 'so-1',
    folio: 'OS-001',
    cotizacionFolio: 'COT-2026-001',
    clientId: 'cli-1',
    equipmentId: 'eq-1',
    fechaProgramada: '2026-05-18',
    fechaFin: '2026-05-19',
    tecnicoAsignado: 'Ing. Carlos Mendoza',
    descripcionServicio: 'Reemplazo de compresor Carrier de 5 Ton y carga de gas. Pruebas de amperaje y presiones de trabajo.',
    tipoMantenimiento: 'Correctivo',
    estado: 'Terminada',
    total: 25850,
    anticiposRecibidos: 12925, // 50% del total cosechado
    facturado: true,
    facturaFolio: 'FAC-001'
  },
  {
    id: 'so-2',
    folio: 'OS-002',
    cotizacionFolio: 'COT-2026-003',
    clientId: 'cli-3',
    equipmentId: 'eq-4',
    fechaProgramada: '2026-05-27', // Mañana o en estos días
    tecnicoAsignado: 'Téc. Fernando Ruiz',
    descripcionServicio: 'Instalar nueva tarjeta inteligente Daikin, validar compuertas de aire y reconectar al BMS.',
    tipoMantenimiento: 'Correctivo',
    estado: 'En Proceso',
    total: 14600,
    anticiposRecibidos: 7300, // 50% anticipo
    facturado: false
  },
  {
    id: 'so-3',
    folio: 'OS-003',
    cotizacionFolio: 'S/N - RUTINA',
    clientId: 'cli-2',
    equipmentId: 'eq-3',
    fechaProgramada: '2026-05-29',
    tecnicoAsignado: 'Ing. Carlos Mendoza',
    descripcionServicio: 'Inspección de niveles de aceite de compresor York, limpieza de filtros y verificación de correas.',
    tipoMantenimiento: 'Preventivo',
    estado: 'Programada',
    total: 2400,
    anticiposRecibidos: 0,
    facturado: false
  }
];

export const initialMaintenanceAlerts: MaintenanceAlert[] = [
  {
    id: 'alert-1',
    equipmentId: 'eq-2',
    clientId: 'cli-1',
    tipoServicio: 'Mantenimiento Preventivo Trimestral (Filtros y Drenaje)',
    mesProgramado: '2026-05',
    estado: 'Pendiente'
  },
  {
    id: 'alert-2',
    equipmentId: 'eq-3',
    clientId: 'cli-2',
    tipoServicio: 'Limpieza Química y Desinfección de Serpentín York',
    mesProgramado: '2026-05',
    estado: 'Atendido'
  },
  {
    id: 'alert-3',
    equipmentId: 'eq-4',
    clientId: 'cli-3',
    tipoServicio: 'Calibración de Sensores de Humedad y Temperatura VRV',
    mesProgramado: '2026-05',
    estado: 'Pendiente'
  }
];

export const initialMaterials: Material[] = [
  { id: 'mat-1', nombre: 'Gas Refrigerante R-410A (Cilindro 11.3 kg)', stock: 5, unidad: 'Cilindros', precioUnitario: 3400 },
  { id: 'mat-2', nombre: 'Gas Refrigerante R-22 (Cilindro 13.6 kg)', stock: 2, unidad: 'Cilindros', precioUnitario: 4800 },
  { id: 'mat-3', nombre: 'Compresor Hermético 5 Ton Carrier 220V', stock: 1, unidad: 'Piezas', precioUnitario: 14500 },
  { id: 'mat-4', nombre: 'Tubería de cobre rígida 7/8" (Tira 6m)', stock: 12, unidad: 'Tiras', precioUnitario: 1100 },
  { id: 'mat-5', nombre: 'Filtro deshidratador de líquido con soldar 3/8"', stock: 15, unidad: 'Piezas', precioUnitario: 320 },
  { id: 'mat-6', nombre: 'Aislante térmico elastomérico Armaflex 7/8"', stock: 30, unidad: 'Tiras', precioUnitario: 95 }
];

export const initialTools: Tool[] = [
  { id: 'tol-1', nombre: 'Bomba de Vacío de 8 CFM Doble Etapa', modeloSerie: 'JB-INDUSTRIES-0928', estado: 'Asignado', tecnicoAsignado: 'Ing. Carlos Mendoza', fechaAsignacion: '2026-05-18' },
  { id: 'tol-2', nombre: 'Manómetro Digital de 4 Válvulas Testo 550s', modeloSerie: 'TESTO-550S-7761', estado: 'Asignado', tecnicoAsignado: 'Téc. Fernando Ruiz', fechaAsignacion: '2026-05-20' },
  { id: 'tol-3', nombre: 'Recuperadora de Gas Refrigerante Sparkless', modeloSerie: 'PROMAX-RG6000', estado: 'Disponible' },
  { id: 'tol-4', nombre: 'Detector Electrónico de Fugas de Gas Inficon', modeloSerie: 'INFICON-DTEK-3', estado: 'Disponible' },
  { id: 'tol-5', nombre: 'Pinza Amperimétrica Fluke 376 FC con iFlex', modeloSerie: 'FLUKE-376-9023', estado: 'Asignado', tecnicoAsignado: 'Ing. Carlos Mendoza', fechaAsignacion: '2026-05-18' }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    folio: 'FAC-001',
    ordenServicioFolio: 'OS-001',
    clientId: 'cli-1',
    fechaEmision: '2026-05-20',
    subtotal: 22284.48, // 25850 / 1.16
    iva: 3565.52,
    total: 25850,
    estadoPago: 'Pagada',
    fechaVencimiento: '2026-06-20'
  },
  {
    id: 'inv-2',
    folio: 'FAC-002',
    ordenServicioFolio: 'OS-002', // En proceso
    clientId: 'cli-3',
    fechaEmision: '2026-05-25',
    subtotal: 12586.21,
    iva: 2013.79,
    total: 14600,
    estadoPago: 'Pendiente',
    fechaVencimiento: '2026-06-25'
  }
];
