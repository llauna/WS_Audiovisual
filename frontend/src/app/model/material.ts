export interface Material {
  id?: string;
  nombre: string;
  categoria: string;
  stockTotal: number;
  stockDisponible: number;
  stockReservado: number;
  stockReparacion: number;
  tarifaDia: number;
  almacen: string;
  ubicacionAlmacen: string;
  estado: string;
}
