import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { Material } from '../model/material';
import { Personal } from '../model/personal';
import { Evento } from '../model/evento';
import { Almacen } from '../model/almacen';
import { RegistroHoras } from '../model/registro-horas';
import { Categoria } from '../model/categoria';
import { Proveedor } from '../model/proveedor';
import { Reparacion } from '../model/reparacion';
import { SolicitudPresupuesto } from '../model/solicitud-presupuesto';
import { Cliente } from '../model/cliente';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8081/api';

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
