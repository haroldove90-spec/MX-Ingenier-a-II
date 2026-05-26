export interface Client {
  id: string;
  razonSocial: string;
  rfc: string;
  email: string;
  telefono: string;
  direcciones: string[]; // Múltiples direcciones de envío/servicio
}

export interface Equipment {
  id: string;
  clientId: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  capacidad: string; // Ej: 12,000 BTU, 2 Toneladas
  gasRefrigerante: string; // Ej: R-410A, R-22
  voltaje: string; // Ej: 110V, 220V
  ubicacion: string; // Dirección de servicio específica
}

export interface Intervention {
  id: string;
  equipmentId: string;
  fecha: string;
  trabajoRealizado: string;
  tecnico: string;
  ordenServicioFolio: string;
}

export interface QuoteItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  categoria?: 'MANO DE OBRA' | 'EQUIPOS' | 'MATERIALES' | 'OTROS';
  unidadMedida?: string;
}

export interface Quote {
  id: string;
  folio: string; // COT-YYYY-XXX
  clientId: string;
  fecha: string;
  items: QuoteItem[];
  anticipoRequeridoPorcentaje: number; // Porcentaje de anticipo requerido (ej. 50%)
  total: number;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  notas?: string;
  asunto?: string;
  atencion?: string;
  estimado?: string;
  incluyeIva?: boolean;
  retencionIsr?: boolean;
  retencionIsrPorcentaje?: number;
  validezDias?: number;
  tiempoEntrega?: string;
  formaPago?: string;
  lugarEntrega?: string;
  bancoTitular?: string;
  bancoNombre?: string;
  bancoCuenta?: string;
  bancoClabe?: string;
}

export interface ServiceOrder {
  id: string;
  folio: string; // OS-XXX
  cotizacionFolio: string; // Vinculación cruzada
  clientId: string;
  equipmentId: string;
  fechaProgramada: string;
  fechaFin?: string;
  tecnicoAsignado: string;
  descripcionServicio: string;
  tipoMantenimiento: 'Correctivo' | 'Preventivo';
  fallaReportada?: string;
  diagnostico?: string;
  trabajosRealizados?: string;
  observaciones?: string;
  fotoUrl?: string;
  estado: 'Programada' | 'En Proceso' | 'Terminada' | 'Facturada';
  total: number;
  anticiposRecibidos: number; // Módulo de anticipos
  facturado: boolean;
  facturaFolio?: string;
}

export interface MaintenanceAlert {
  id: string;
  equipmentId: string;
  clientId: string;
  tipoServicio: string;
  mesProgramado: string; // "2026-05", etc.
  estado: 'Pendiente' | 'Atendido';
}

export interface Material {
  id: string;
  nombre: string;
  stock: number;
  unidad: string; // pza, kg, litro, etc.
  precioUnitario: number;
}

export interface Tool {
  id: string;
  nombre: string;
  modeloSerie: string;
  estado: 'Disponible' | 'Asignado';
  tecnicoAsignado?: string;
  fechaAsignacion?: string;
}

export interface Invoice {
  id: string;
  folio: string; // FAC-XXX
  ordenServicioFolio: string;
  clientId: string;
  fechaEmision: string;
  subtotal: number;
  iva: number;
  total: number;
  estadoPago: 'Pendiente' | 'Pagada' | 'Vencida';
  fechaVencimiento: string;
}
