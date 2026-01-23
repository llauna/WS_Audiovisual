export interface RegistroHoras {
  id?: string;
  personalId: string;
  fecha: string; // YYYY-MM-DD
  horas: number;
  tipo: 'Plantilla' | 'Extra';
  tarifaHora: number;
  notas?: string;
}
