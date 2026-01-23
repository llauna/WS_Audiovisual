import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { Material } from '../model/material';
import { Personal } from '../model/personal';
import { Evento } from '../model/evento';

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

  deleteMaterial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materiales/${id}`);
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

  // --- MÉTODOS DE EVENTOS ---
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos`);
  }

  saveEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/eventos`, evento);
  }

  deleteEvento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eventos/${id}`);
  }
}
