export interface NotaGasto {
  id?: string;
  eventoId: string;
  productorId: string;
  fecha: string; // YYYY-MM-DD
  concepto: string;
  importe: number;
  estado: 'Pendiente' | 'Pagado';
}
