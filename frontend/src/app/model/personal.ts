export interface Personal {
  id?: string;
  nombre: string;
  apellidos: string;
  dni: string;
  cargo: string;
  telefono: string;
  email: string;
  tipoContrato: 'Plantilla' | 'Autónomo' | 'Subcontratado';
  empresa: string;
  estado: string;
}
