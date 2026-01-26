export interface SolicitudPresupuesto {
  id?: string;
  proveedorId: string;
  materialId: string;
  precio?: number;
  fechaRecogida?: string;
  fechaDevolucion?: string;
  notas?: string;
}
