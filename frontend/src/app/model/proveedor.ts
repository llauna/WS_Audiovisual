export interface Proveedor {
  id?: string;
  nombre: string;
  nif?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  contacto?: string;
  notas?: string;
  proveedorMaterial?: boolean;
  proveedorReparacion?: boolean;
}
