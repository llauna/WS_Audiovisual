import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Proveedor } from '../model/proveedor';
import { Material } from '../model/material';
import { SolicitudPresupuesto } from '../model/solicitud-presupuesto';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <header class="section-header">
        <div>
          <h2>Presupuestos</h2>
          <p class="muted">Gestion comercial y cotizaciones</p>
        </div>
        <a class="btn-secondary" routerLink="/">Inicio</a>
      </header>

      <div class="card">
        <header class="section-header compact">
          <div>
            <h3>Solicitud a proveedor</h3>
            <p class="muted">Peticion de material para presupuestos</p>
          </div>
        </header>
        <div class="form-grid">
          <label class="field-span-6">
            Proveedor
            <select [(ngModel)]="nuevaSolicitud.proveedorId">
              <option value="">Selecciona proveedor</option>
              <option *ngFor="let p of proveedoresMaterial" [value]="p.id">{{ p.nombre }}</option>
            </select>
          </label>
          <label class="field-span-6">
            Material
            <select [(ngModel)]="nuevaSolicitud.materialId">
              <option value="">Selecciona material</option>
              <option *ngFor="let m of materiales" [value]="m.id">{{ m.nombre }}</option>
            </select>
          </label>
          <label class="field-span-2">
            Precio
            <input type="number" min="0" step="0.01" [(ngModel)]="nuevaSolicitud.precio">
          </label>
          <div class="field-spacer" aria-hidden="true"></div>
          <label class="field-span-3">
            Fecha recogida
            <input type="date" [(ngModel)]="nuevaSolicitud.fechaRecogida">
          </label>
          <div class="field-spacer" aria-hidden="true"></div>
          <label class="field-span-3">
            Fecha devolucion
            <input type="date" [(ngModel)]="nuevaSolicitud.fechaDevolucion">
          </label>
          <input class="field-span-8" [(ngModel)]="nuevaSolicitud.notas" placeholder="Notas">
          <div class="field-spacer" aria-hidden="true"></div>
          <button class="btn-primary field-span-3" (click)="guardarSolicitud()">Solicitar presupuesto</button>
        </div>
      </div>

      <div class="card">
        <header class="section-header compact">
          <div>
            <h3>Solicitudes recientes</h3>
            <p class="muted">Historial de solicitudes enviadas</p>
          </div>
        </header>
        <table class="modern-table" *ngIf="solicitudes.length">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Material</th>
              <th>Precio</th>
              <th>Recogida</th>
              <th>Devolucion</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of solicitudes">
              <td>{{ nombreProveedor(s.proveedorId) }}</td>
              <td>{{ nombreMaterial(s.materialId) }}</td>
              <td>{{ s.precio }}</td>
              <td>{{ s.fechaRecogida }}</td>
              <td>{{ s.fechaDevolucion }}</td>
              <td>{{ s.notas }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .section-header.compact { margin-bottom: 1rem; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }
    .card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .btn-secondary { background: #eef2f6; color: #344054; border: none; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; text-decoration: none; }
    .btn-primary { background: #2c3e50; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer; }
    .form-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 14px; row-gap: 10px; margin-bottom: 1rem; }
    .form-grid label { display: flex; flex-direction: column; gap: 6px; }
    .field-span-6 { grid-column: span 6; }
    .field-span-3 { grid-column: span 3; }
    .field-span-2 { grid-column: span 2; }
    .field-span-8 { grid-column: span 8; }
    .field-spacer { grid-column: span 1; }
    @media (max-width: 720px) {
      .form-grid { grid-template-columns: 1fr; }
      .field-span-6,
      .field-span-3,
      .field-span-8,
      .field-spacer { grid-column: span 1; }
      .field-spacer { display: none; }
    }
    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { text-align: left; padding: 0.75rem; background: #f8f9fa; color: #666; font-weight: 600; }
    .modern-table td { padding: 0.75rem; border-bottom: 1px solid #eee; }
    input, select { padding: 0.5rem 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; width: 100%; }
  `]
})
export class PresupuestosComponent implements OnInit {
  proveedores: Proveedor[] = [];
  materiales: Material[] = [];
  solicitudes: SolicitudPresupuesto[] = [];
  nuevaSolicitud: SolicitudPresupuesto = this.resetSolicitud();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarProveedores();
    this.cargarMateriales();
    this.cargarSolicitudes();
  }

  get proveedoresMaterial(): Proveedor[] {
    return this.proveedores.filter(p => p.proveedorMaterial);
  }

  guardarSolicitud() {
    if (!this.nuevaSolicitud.proveedorId || !this.nuevaSolicitud.materialId) {
      alert('Proveedor y material son obligatorios');
      return;
    }
    this.apiService.saveSolicitudPresupuesto(this.nuevaSolicitud).subscribe({
      next: () => {
        this.nuevaSolicitud = this.resetSolicitud();
        this.cargarSolicitudes();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar la solicitud')
    });
  }

  private cargarProveedores() {
    this.apiService.getProveedores().subscribe({
      next: (data) => this.proveedores = data ?? [],
      error: (err) => console.error('Error cargando proveedores:', err)
    });
  }

  private cargarMateriales() {
    this.apiService.getMateriales().subscribe({
      next: (data) => this.materiales = data ?? [],
      error: (err) => console.error('Error cargando materiales:', err)
    });
  }

  private cargarSolicitudes() {
    this.apiService.getSolicitudesPresupuesto().subscribe({
      next: (data) => this.solicitudes = data ?? [],
      error: (err) => console.error('Error cargando solicitudes:', err)
    });
  }

  nombreMaterial(id?: string): string {
    const material = this.materiales.find(m => m.id === id);
    return material?.nombre || 'Desconocido';
  }

  nombreProveedor(id?: string): string {
    const proveedor = this.proveedores.find(p => p.id === id);
    return proveedor?.nombre || 'Desconocido';
  }

  private resetSolicitud(): SolicitudPresupuesto {
    return {
      proveedorId: '',
      materialId: '',
      precio: 0,
      fechaRecogida: '',
      fechaDevolucion: '',
      notas: ''
    };
  }
}
