export interface Evento {
  id?: string;
  titulo: string;
  ubicacion?: string;
  clienteId?: string;
  fecha: string; // YYYY-MM-DD
  tipo: 'Evento' | 'Montaje' | 'Ensayo' | 'Otro';
  color: 'blue' | 'orange' | 'green' | 'purple';
  descripcion?: string;
  presupuesto?: number;
  presupuestoPresentado?: number;
  presupuestoEstado?: 'Pendiente' | 'Aceptado' | 'Rechazado';
  tecnicos?: number;
  materiales?: EventoMaterial[];
  dias?: number;
  jornadas?: number;
  modoCalculo?: 'Dias' | 'Jornadas';
  tecnicosDetalle?: EventoTecnico[];
}

export interface EventoMaterial {
  materialId?: string;
  nombre: string;
  cantidad: number;
}

export interface EventoTecnico {
  personalId?: string;
  nombre?: string;
  horas?: number;
  tarifaHora?: number;
}
