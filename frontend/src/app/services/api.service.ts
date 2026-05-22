import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap, map, catchError, of} from 'rxjs';
import { Material } from '../model/material';
import { Personal } from '../model/personal';
import { Evento } from '../model/evento';
import { Almacen } from '../model/almacen';
import { RegistroHoras } from '../model/registro-horas';
import { NotaGasto } from '../model/nota-gasto';
import { Categoria } from '../model/categoria';
import { Proveedor } from '../model/proveedor';
import { Reparacion } from '../model/reparacion';
import { SolicitudPresupuesto } from '../model/solicitud-presupuesto';
import { Cliente } from '../model/cliente';

export interface PresupuestoLineaMaterialResumen {
  materialId?: string;
  nombre?: string;
  cantidad?: number;
  tarifaDia?: number;
  tarifa?: number;
  precio?: number;
  total?: number;
}

export interface PresupuestoLineaTecnicoResumen {
  personalId?: string;
  nombre?: string;
  horas?: number;
  tarifaHora?: number;
  total?: number;
}

export interface PresupuestoDetalleResumen {
  eventoId?: string;
  eventoTitulo?: string;
  modoCalculo?: string;
  dias?: number;
  jornadas?: number;
  multiplicador?: number;
  costeMateriales?: number;
  costeTecnicos?: number;
  costeBase?: number;
  margenPct?: number;
  margenImporte?: number;
  total?: number;
  materiales?: PresupuestoLineaMaterialResumen[];
  tecnicos?: PresupuestoLineaTecnicoResumen[];
}

export interface PresupuestoResumen {
  id?: string;
  eventoId?: string;
  eventoTitulo?: string;
  clienteId?: string;
  fechaEvento?: string;
  modoCalculo?: string;
  dias?: number;
  jornadas?: number;
  multiplicador?: number;
  margenPct?: number;
  costeMateriales?: number;
  costeTecnicos?: number;
  costeBase?: number;
  margenImporte?: number;
  importePresentado?: number;
  estado?: string;
  createdAt?: string;
  materiales?: PresupuestoLineaMaterialResumen[];
  tecnicos?: PresupuestoLineaTecnicoResumen[];
}

export interface AuthResponse {
  username: string;
  roles: string[];
  authenticated: boolean;
}

export interface UsuarioSummary {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  password?: string;
}

export interface UsuarioRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8081/api';
  private _isAuthenticated = false;

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE MATERIALES ---
  getMateriales(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materiales`);
  }

  saveMaterial(material: Material): Observable<Material> {
    return this.http.post<Material>(`${this.apiUrl}/materiales`, material);
  }

  updateMaterial(id: string, material: Material): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/materiales/${id}`, material);
  }

  deleteMaterial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materiales/${id}`);
  }

  // --- METODOS DE ALMACENES ---
  getAlmacenes(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(`${this.apiUrl}/almacenes`);
  }

  saveAlmacen(almacen: Almacen): Observable<Almacen> {
    return this.http.post<Almacen>(`${this.apiUrl}/almacenes`, almacen);
  }

  updateAlmacen(id: string, almacen: Almacen): Observable<Almacen> {
    return this.http.put<Almacen>(`${this.apiUrl}/almacenes/${id}`, almacen);
  }

  deleteAlmacen(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/almacenes/${id}`);
  }

  // --- MÉTODOS DE PERSONAL ---
  getPersonal(): Observable<Personal[]> {
    return this.http.get<Personal[]>(`${this.apiUrl}/personal`);
  }

  savePersonal(persona: Personal): Observable<Personal> {
    return this.http.post<Personal>(`${this.apiUrl}/personal`, persona);
  }

  deletePersona(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/personal/${id}`);
  }

  // --- METODOS DE HORAS ---
  getHoras(): Observable<RegistroHoras[]> {
    return this.http.get<RegistroHoras[]>(`${this.apiUrl}/horas`);
  }

  saveHora(registro: RegistroHoras): Observable<RegistroHoras> {
    return this.http.post<RegistroHoras>(`${this.apiUrl}/horas`, registro);
  }

  updateHora(id: string, registro: RegistroHoras): Observable<RegistroHoras> {
    return this.http.put<RegistroHoras>(`${this.apiUrl}/horas/${id}`, registro);
  }

  deleteHora(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horas/${id}`);
  }

  // --- METODOS DE NOTAS DE GASTOS ---
  getNotasGasto(eventoId?: string): Observable<NotaGasto[]> {
    const params = eventoId ? `?eventoId=${eventoId}` : '';
    return this.http.get<NotaGasto[]>(`${this.apiUrl}/notas-gastos${params}`);
  }

  saveNotaGasto(nota: NotaGasto): Observable<NotaGasto> {
    return this.http.post<NotaGasto>(`${this.apiUrl}/notas-gastos`, nota);
  }

  updateNotaGasto(id: string, nota: NotaGasto): Observable<NotaGasto> {
    return this.http.put<NotaGasto>(`${this.apiUrl}/notas-gastos/${id}`, nota);
  }

  deleteNotaGasto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notas-gastos/${id}`);
  }

  // --- METODOS DE AUTH ---
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        this._isAuthenticated = response.authenticated;
      })
    );
  }

  me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/me`);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this._isAuthenticated = false;
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    // Si ya sabemos que está autenticado localmente, retornar true inmediatamente
    if (this._isAuthenticated) {
      return of(true);
    }
    
    // Si no, verificar con el backend
    return this.me().pipe(
      map(response => {
        this._isAuthenticated = response.authenticated;
        return response.authenticated;
      }),
      catchError(() => {
        this._isAuthenticated = false;
        return of(false);
      })
    );
  }

  // --- METODOS DE USUARIOS ---
  getUsuarios(): Observable<UsuarioSummary[]> {
    return this.http.get<UsuarioSummary[]>(`${this.apiUrl}/usuarios`);
  }

  saveUsuario(payload: UsuarioRequest): Observable<UsuarioSummary> {
    return this.http.post<UsuarioSummary>(`${this.apiUrl}/usuarios`, payload);
  }

  updateUsuario(id: string, payload: UsuarioRequest): Observable<UsuarioSummary> {
    return this.http.put<UsuarioSummary>(`${this.apiUrl}/usuarios/${id}`, payload);
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  // --- MÉTODOS DE EVENTOS ---
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos`);
  }

  saveEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/eventos`, evento);
  }

  updateEvento(id: string, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/eventos/${id}`, evento);
  }

  deleteEvento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eventos/${id}`);
  }

  calcularPresupuestoEvento(evento: Evento, margenPct = 0): Observable<PresupuestoDetalleResumen> {
    return this.http.post<PresupuestoDetalleResumen>(
      `${this.apiUrl}/presupuestos/calcular?margenPct=${encodeURIComponent(margenPct)}`,
      evento
    );
  }

  calcularPresupuestoDesdeEvento(id: string, margenPct = 0): Observable<PresupuestoDetalleResumen> {
    return this.http.get<PresupuestoDetalleResumen>(
      `${this.apiUrl}/presupuestos/eventos/${id}?margenPct=${encodeURIComponent(margenPct)}`
    );
  }

  guardarPresupuestoDesdeEvento(id: string, margenPct = 0, estado = 'Pendiente'): Observable<PresupuestoResumen> {
    return this.http.post<PresupuestoResumen>(
      `${this.apiUrl}/presupuestos/eventos/${id}?margenPct=${encodeURIComponent(margenPct)}&estado=${encodeURIComponent(estado)}`,
      {}
    );
  }

  getPresupuestosGuardados(): Observable<PresupuestoResumen[]> {
    return this.http.get<PresupuestoResumen[]>(`${this.apiUrl}/presupuestos`);
  }

  // --- METODOS DE CATEGORIAS ---
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  saveCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/categorias`, categoria);
  }

  updateCategoria(id: string, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/categorias/${id}`, categoria);
  }

  deleteCategoria(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categorias/${id}`);
  }

  // --- METODOS DE PROVEEDORES ---
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/proveedores`);
  }

  saveProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.apiUrl}/proveedores`, proveedor);
  }

  updateProveedor(id: string, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/proveedores/${id}`, proveedor);
  }

  deleteProveedor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/proveedores/${id}`);
  }

  // --- METODOS DE REPARACIONES ---
  getReparaciones(): Observable<Reparacion[]> {
    return this.http.get<Reparacion[]>(`${this.apiUrl}/reparaciones`);
  }

  saveReparacion(reparacion: Reparacion): Observable<Reparacion> {
    return this.http.post<Reparacion>(`${this.apiUrl}/reparaciones`, reparacion);
  }

  updateReparacion(id: string, reparacion: Reparacion): Observable<Reparacion> {
    return this.http.put<Reparacion>(`${this.apiUrl}/reparaciones/${id}`, reparacion);
  }

  deleteReparacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reparaciones/${id}`);
  }

  // --- METODOS DE SOLICITUDES DE PRESUPUESTO ---
  getSolicitudesPresupuesto(): Observable<SolicitudPresupuesto[]> {
    return this.http.get<SolicitudPresupuesto[]>(`${this.apiUrl}/solicitudes-presupuesto`);
  }

  saveSolicitudPresupuesto(solicitud: SolicitudPresupuesto): Observable<SolicitudPresupuesto> {
    return this.http.post<SolicitudPresupuesto>(`${this.apiUrl}/solicitudes-presupuesto`, solicitud);
  }

  updateSolicitudPresupuesto(id: string, solicitud: SolicitudPresupuesto): Observable<SolicitudPresupuesto> {
    return this.http.put<SolicitudPresupuesto>(`${this.apiUrl}/solicitudes-presupuesto/${id}`, solicitud);
  }

  deleteSolicitudPresupuesto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/solicitudes-presupuesto/${id}`);
  }

  // --- METODOS DE CLIENTES ---
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  saveCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
  }

  updateCliente(id: string, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
  }
}
