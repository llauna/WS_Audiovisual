export interface Material {
  id?: string;
  nombre: string;
  categoria: string;
  stockTotal: number;
  stockDisponible: number;
  ubicacionAlmacen: string;
  estado: string;
}
