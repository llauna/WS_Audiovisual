export interface Evento {
  id?: string;
  titulo: string;
  ubicacion?: string;
  fecha: string; // YYYY-MM-DD
  tipo: 'Evento' | 'Montaje' | 'Ensayo' | 'Otro';
  color: 'blue' | 'orange' | 'green' | 'purple';
}
