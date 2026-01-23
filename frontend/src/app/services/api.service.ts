import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { Material } from '../model/material';
import { Personal } from '../model/personal';
import { Evento } from '../model/evento';
import { Almacen } from '../model/almacen';
import { RegistroHoras } from '../model/registro-horas';

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
}
