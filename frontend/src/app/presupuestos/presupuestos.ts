import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Proveedor } from '../model/proveedor';
import { Material } from '../model/material';
import { SolicitudPresupuesto } from '../model/solicitud-presupuesto';
import { Evento } from '../model/evento';
import { Cliente } from '../model/cliente';
import { PresupuestoResumen } from '../services/api.service';

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
        <a class="btn-secondary" routerLink="/dashboard">Inicio</a>
      </header>

      <div class="cards-grid">
      <div class="card">
        <header class="section-header compact">
          <div>
            <h3>Solicitud a proveedor</h3>
            <p class="muted">Peticion de material para presupuestos</p>
          </div>
          <button class="btn-success" (click)="openSolicitudProveedorModal()">Abrir</button>
        </header>
      </div>

      <div class="card">
        <header class="section-header compact">
          <div>
            <h3>Presupuesto a cliente</h3>
            <p class="muted">Importe presentado ligado al evento</p>
          </div>
          <button class="btn-success" (click)="openPresupuestoClienteModal()">Abrir</button>
        </header>
      </div>

      <div class="card">
        <header class="section-header compact">
          <div>
            <h3>Solicitudes recientes</h3>
            <p class="muted">Historial de solicitudes enviadas</p>
          </div>
          <button class="btn-success" (click)="openSolicitudesRecientesModal()">Abrir</button>
        </header>
      </div>

      <div class="card">
        <header class="section-header compact">
          <div>
            <h3>Eventos con presupuesto presentado</h3>
            <p class="muted">Solo eventos con importe presentado</p>
          </div>
          <button class="btn-success" (click)="openEventosAceptadosModal()">Abrir</button>
        </header>
      </div>

      <div class="card">
        <header class="section-header compact">
          <div>
            <h3>Eventos pendientes o sin presupuesto</h3>
            <p class="muted">No se deben realizar hasta ser aceptados</p>
          </div>
          <button class="btn-success" (click)="openEventosPendientesModal()">Abrir</button>
        </header>
      </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showSolicitudProveedorModal">
      <div class="modal">
        <header class="modal-header">
          <h3>Solicitud a proveedor</h3>
          <button class="icon-btn" (click)="closeSolicitudProveedorModal()">&times;</button>
        </header>
        <div class="modal-body">
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
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showPresupuestoClienteModal">
      <div class="modal">
        <header class="modal-header">
          <h3>Presupuesto a cliente</h3>
          <button class="icon-btn" (click)="closePresupuestoClienteModal()">&times;</button>
        </header>
        <div class="modal-body">
          <div class="form-grid">
            <label class="field-span-6">
              Evento
              <select [(ngModel)]="eventoSeleccionadoId" (ngModelChange)="onEventoChange()">
                <option value="">Selecciona evento</option>
                <option *ngFor="let e of eventos" [value]="e.id">{{ e.titulo }} - {{ e.fecha }}</option>
              </select>
            </label>
            <label class="field-span-6">
              Cliente
              <input [value]="clienteEventoSeleccionado" placeholder="Cliente" disabled>
            </label>
              <label class="field-span-2">
                Ppto. calculado
                <input class="input-compact" [value]="presupuestoCalculadoEvento | number:'1.2-2'" disabled>
              </label>
              <label class="field-span-2">
                Importe presentado
                <input class="input-compact" type="number" min="0" step="0.01" [(ngModel)]="importePresentado" disabled>
              </label>
              <label class="field-span-2">
                GM (%)
                <input class="input-compact" type="number" min="0" step="0.01" [(ngModel)]="granMargenPct" (ngModelChange)="onGranMargenChange()">
              </label>
              <label class="field-span-2">
                Estado
                <select class="input-compact" [(ngModel)]="estadoPresupuesto">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Aceptado">Aceptado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </label>
              <label class="field-span-3">
                Fecha evento
                <input class="input-compact" [value]="fechaEventoSeleccionado" disabled>
              </label>
              <button class="btn-primary field-span-3" (click)="guardarPresupuestoEvento()">Presentar presupuesto</button>
          </div>
          <div class="quote-breakdown" *ngIf="eventoSeleccionado">
            <h4>Detalle del presupuesto</h4>
            <div class="quote-meta">
              <div><strong>Duracion:</strong> {{ duracionLabel }}</div>
              <div><strong>Coste tecnicos:</strong> {{ tecnicosCosteEvento | number:'1.2-2' }}</div>
              <div><strong>Coste material:</strong> {{ materialesCosteEvento | number:'1.2-2' }}</div>
              <div><strong>Coste total:</strong> {{ presupuestoCalculadoEvento | number:'1.2-2' }}</div>
              <div><strong>Gran margen:</strong> {{ granMargenImporte | number:'1.2-2' }}</div>
              <div><strong>Total con margen:</strong> {{ totalConMargen | number:'1.2-2' }}</div>
            </div>

            <table class="modern-table" *ngIf="materialesDetalle.length; else sinMaterial">
              <thead>
                <tr>
                  <th>Duracion</th>
                  <th>Material</th>
                  <th>Unidades</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of materialesDetalle">
                  <td>{{ duracionLabel }}</td>
                  <td>{{ m.nombre }}</td>
                  <td>{{ m.cantidad }}</td>
                  <td>{{ m.tarifa | number:'1.2-2' }}</td>
                  <td>{{ m.totalConMargen | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
            <ng-template #sinMaterial>
              <p class="muted">No hay material asociado.</p>
            </ng-template>

            <table class="modern-table" *ngIf="tecnicosDetalle.length; else sinTecnicos">
              <thead>
                <tr>
                  <th>Tecnico</th>
                  <th>Horas</th>
                  <th>Tarifa</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of tecnicosDetalle">
                  <td>{{ t.nombre }}</td>
                  <td>{{ t.horas }}</td>
                  <td>{{ t.tarifa | number:'1.2-2' }}</td>
                  <td>{{ t.totalConMargen | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
            <ng-template #sinTecnicos>
              <p class="muted">No hay tecnicos asociados.</p>
            </ng-template>

            <div class="quote-actions">
              <button class="btn-secondary" (click)="generarCorreoPresupuesto()">Generar correo</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showSolicitudesRecientesModal">
      <div class="modal">
        <header class="modal-header">
          <h3>Solicitudes recientes</h3>
          <button class="icon-btn" (click)="closeSolicitudesRecientesModal()">&times;</button>
        </header>
        <div class="modal-body">
          <table class="modern-table" *ngIf="solicitudes.length; else noSolicitudesModal">
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
          <ng-template #noSolicitudesModal>
            <p class="muted">No hay solicitudes recientes.</p>
          </ng-template>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showEventosAceptadosModal">
      <div class="modal">
        <header class="modal-header">
          <h3>Eventos con presupuesto presentado</h3>
          <button class="icon-btn" (click)="closeEventosAceptadosModal()">&times;</button>
        </header>
        <div class="modal-body">
          <table class="modern-table" *ngIf="eventosAceptados.length; else noPresupuestosModal">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Presupuesto presentado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of eventosAceptados">
                <td>{{ e.titulo }}</td>
                <td>{{ e.fecha }}</td>
                <td>{{ nombreCliente(e.clienteId) }}</td>
                <td>{{ e.presupuestoPresentado | number:'1.2-2' }}</td>
                <td>
                  <span class="status-pill"
                    [class.accepted]="e.presupuestoEstado === 'Aceptado'"
                    [class.pending]="!e.presupuestoEstado || e.presupuestoEstado === 'Pendiente'"
                    [class.rejected]="e.presupuestoEstado === 'Rechazado'">
                    {{ e.presupuestoEstado || 'Pendiente' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <ng-template #noPresupuestosModal>
            <p class="muted">No hay eventos aceptados.</p>
          </ng-template>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showEventosPendientesModal">
      <div class="modal">
        <header class="modal-header">
          <h3>Eventos pendientes o sin presupuesto</h3>
          <button class="icon-btn" (click)="closeEventosPendientesModal()">&times;</button>
        </header>
        <div class="modal-body">
          <table class="modern-table" *ngIf="eventosPendientes.length; else noPendientesModal">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Presupuesto presentado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of eventosPendientes">
                <td>{{ e.titulo }}</td>
                <td>{{ e.fecha }}</td>
                <td>{{ nombreCliente(e.clienteId) }}</td>
                <td>{{ e.presupuestoPresentado | number:'1.2-2' }}</td>
                <td>
                  <span class="status-pill"
                    [class.accepted]="e.presupuestoEstado === 'Aceptado'"
                    [class.pending]="!e.presupuestoEstado || e.presupuestoEstado === 'Pendiente'"
                    [class.rejected]="e.presupuestoEstado === 'Rechazado'">
                    {{ e.presupuestoEstado || 'Pendiente' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <ng-template #noPendientesModal>
            <p class="muted">No hay eventos pendientes o sin presupuesto.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .section-header.compact { margin-bottom: 1rem; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }
    .cards-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
    .card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .btn-secondary { background: #eef2f6; color: #344054; border: none; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; text-decoration: none; }
    .btn-primary { background: #2c3e50; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer; }
    .btn-success { background: #27ae60; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer; }
    .btn-success:hover { background: #219150; }
    .form-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 20px; row-gap: 10px; margin-bottom: 1rem; }
    .form-grid label { display: flex; flex-direction: column; gap: 6px; }
    .field-span-6 { grid-column: span 6; }
    .field-span-3 { grid-column: span 3; }
    .field-span-2 { grid-column: span 2; }
    .field-span-4 { grid-column: span 4; }
    .field-span-8 { grid-column: span 8; }
    .field-spacer { grid-column: span 1; }
    @media (max-width: 720px) {
      .form-grid { grid-template-columns: 1fr; }
      .field-span-6,
      .field-span-3,
      .field-span-4,
      .field-span-8,
      .field-spacer { grid-column: span 1; }
      .field-spacer { display: none; }
    }
    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { text-align: left; padding: 0.75rem; background: #f8f9fa; color: #666; font-weight: 600; }
    .modern-table td { padding: 0.75rem; border-bottom: 1px solid #eee; }
    .quote-breakdown { margin-top: 1.5rem; }
    .quote-breakdown h4 { margin: 0 0 0.75rem; }
    .quote-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.5rem 1rem;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }
    .quote-actions { margin-top: 1rem; }
    .status-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .status-pill.accepted { background: #e8f8ee; color: #1e7e34; }
    .status-pill.pending { background: #fff4e5; color: #a16207; }
    .status-pill.rejected { background: #ffe9e9; color: #b42318; }
    input, select { padding: 0.5rem 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; width: 100%; }
    .input-compact {
      padding: 0.35rem 0.5rem;
      font-size: 0.85rem;
      height: 34px;
      line-height: 1.2;
      box-sizing: border-box;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: #fff;
      width: min(1100px, 95vw);
      max-height: 90vh;
      border-radius: 14px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
    }
    .modal-body {
      padding: 1.5rem;
      overflow: auto;
      max-height: calc(90vh - 70px);
    }
    .icon-btn {
      border: none;
      background: #f1f3f5;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
    }
  `]
})
export class PresupuestosComponent implements OnInit {
  proveedores: Proveedor[] = [];
  materiales: Material[] = [];
  solicitudes: SolicitudPresupuesto[] = [];
  eventos: Evento[] = [];
  clientes: Cliente[] = [];
  presupuestos: PresupuestoResumen[] = [];
  nuevaSolicitud: SolicitudPresupuesto = this.resetSolicitud();
  eventoSeleccionadoId = '';
  importePresentado = 0;
  estadoPresupuesto: 'Pendiente' | 'Aceptado' | 'Rechazado' = 'Pendiente';
  showSolicitudProveedorModal = false;
  showPresupuestoClienteModal = false;
  showSolicitudesRecientesModal = false;
  showEventosAceptadosModal = false;
  showEventosPendientesModal = false;
  granMargenPct = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarProveedores();
    this.cargarMateriales();
    this.cargarSolicitudes();
    this.cargarEventos();
    this.cargarClientes();
    this.cargarPresupuestos();
  }

  openSolicitudProveedorModal() {
    this.showSolicitudProveedorModal = true;
  }

  closeSolicitudProveedorModal() {
    this.showSolicitudProveedorModal = false;
  }

  openPresupuestoClienteModal() {
    this.resetPresupuestoClienteForm();
    this.showPresupuestoClienteModal = true;
  }

  closePresupuestoClienteModal() {
    this.showPresupuestoClienteModal = false;
    this.resetPresupuestoClienteForm();
  }

  openSolicitudesRecientesModal() {
    this.showSolicitudesRecientesModal = true;
  }

  closeSolicitudesRecientesModal() {
    this.showSolicitudesRecientesModal = false;
  }

  openEventosAceptadosModal() {
    this.showEventosAceptadosModal = true;
  }

  closeEventosAceptadosModal() {
    this.showEventosAceptadosModal = false;
  }

  openEventosPendientesModal() {
    this.showEventosPendientesModal = true;
  }

  closeEventosPendientesModal() {
    this.showEventosPendientesModal = false;
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

  onEventoChange() {
    const evento = this.eventoSeleccionado;
    if (!evento) {
      this.resetPresupuestoClienteForm(false);
      return;
    }
    const presupuestoGuardado = this.presupuestoGuardadoSeleccionado;
    this.granMargenPct = presupuestoGuardado?.margenPct ?? 0;
    this.estadoPresupuesto = this.normalizeEstadoPresupuesto(
      presupuestoGuardado?.estado ?? evento.presupuestoEstado
    );
    this.syncImportePresentado();
  }

  guardarPresupuestoEvento() {
    const evento = this.eventoSeleccionado;
    if (!evento?.id) {
      alert('Selecciona un evento');
      return;
    }
    if (!this.importePresentado || this.importePresentado <= 0) {
      alert('El importe presentado debe ser mayor que 0');
      return;
    }
    this.apiService.guardarPresupuestoDesdeEvento(evento.id, this.granMargenPct, this.estadoPresupuesto).subscribe({
      next: () => {
        const payload: Evento = {
          ...evento,
          presupuestoPresentado: this.importePresentado,
          presupuestoEstado: this.estadoPresupuesto
        };
        this.apiService.updateEvento(evento.id!, payload).subscribe({
          next: () => {
            this.cargarEventos();
            this.cargarPresupuestos();
          },
          error: (err) => alert(err?.error?.message || 'No se pudo actualizar el evento')
        });
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar el presupuesto')
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

  private cargarEventos() {
    this.apiService.getEventos().subscribe({
      next: (data) => this.eventos = data ?? [],
      error: (err) => console.error('Error cargando eventos:', err)
    });
  }

  private cargarPresupuestos() {
    this.apiService.getPresupuestosGuardados().subscribe({
      next: (data) => {
        this.presupuestos = data ?? [];
        if (this.eventoSeleccionadoId) {
          this.onEventoChange();
        }
      },
      error: (err) => console.error('Error cargando presupuestos:', err)
    });
  }

  private cargarClientes() {
    this.apiService.getClientes().subscribe({
      next: (data) => this.clientes = data ?? [],
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }

  get eventoSeleccionado(): Evento | undefined {
    return this.eventos.find(e => e.id === this.eventoSeleccionadoId);
  }

  get presupuestoGuardadoSeleccionado(): PresupuestoResumen | undefined {
    const id = this.eventoSeleccionado?.id;
    if (!id) return undefined;
    const encontrados = (this.presupuestos ?? [])
      .filter(p => p.eventoId === id)
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    return encontrados[0];
  }

  get clienteEventoSeleccionado(): string {
    const id = this.eventoSeleccionado?.clienteId;
    if (!id) return '';
    return this.clientes.find(c => c.id === id)?.nombre ?? '';
  }

  get fechaEventoSeleccionado(): string {
    return this.eventoSeleccionado?.fecha ?? '';
  }

  get presupuestoCalculadoEvento(): number {
    return this.materialesCosteEvento + this.tecnicosCosteEvento;
  }

  get materialesCosteEvento(): number {
    return (this.materialesDetalle ?? []).reduce((acc, item) => acc + (item.total ?? 0), 0);
  }

  get tecnicosCosteEvento(): number {
    return (this.tecnicosDetalle ?? []).reduce((acc, item) => acc + (item.total ?? 0), 0);
  }

  get granMargenImporte(): number {
    const baseGuardado = this.presupuestoGuardadoSeleccionado?.costeBase;
    const base = baseGuardado != null && baseGuardado > 0 ? baseGuardado : this.presupuestoCalculadoEvento;
    const pct = this.granMargenPct ?? 0;
    return base * (pct / 100);
  }

  get totalConMargen(): number {
    const baseGuardado = this.presupuestoGuardadoSeleccionado?.costeBase;
    const base = baseGuardado != null && baseGuardado > 0 ? baseGuardado : this.presupuestoCalculadoEvento;
    return base + this.granMargenImporte;
  }

  get duracionLabel(): string {
    const evento = this.eventoSeleccionado;
    if (!evento) return '';
    if (evento.modoCalculo === 'Jornadas') {
      return `${evento.jornadas ?? 0} jornadas`;
    }
    return `${evento.dias ?? 0} dias`;
  }

  get materialesDetalle(): { nombre: string; cantidad: number; tarifa: number; total: number; totalConMargen: number }[] {
    const presupuestoGuardado = this.presupuestoGuardadoSeleccionado;
    if (presupuestoGuardado?.materiales?.length) {
      const marginFactor = 1 + ((this.granMargenPct ?? 0) / 100);
      const evento = this.eventoSeleccionado;
      const multiplier = presupuestoGuardado.multiplicador
        ?? (evento?.modoCalculo === 'Jornadas'
          ? (evento?.jornadas ?? 1)
          : (evento?.dias ?? 1));
      return (presupuestoGuardado.materiales ?? [])
        .map(item => {
          const material = this.resolveMaterial(item.materialId, item.nombre);
          const cantidad = item.cantidad ?? 0;
          const tarifa = this.resolveTarifaMaterialPresupuesto(item, material);
          const total = (item.total != null && item.total > 0)
            ? item.total
            : cantidad * tarifa * multiplier;
          return {
            nombre: material?.nombre ?? item.nombre ?? 'Sin nombre',
            cantidad,
            tarifa,
            total,
            totalConMargen: total * marginFactor
          };
        })
        .filter(item => item.cantidad > 0);
    }
    const evento = this.eventoSeleccionado;
    if (!evento) return [];
    const multiplier = evento.modoCalculo === 'Jornadas'
      ? (evento.jornadas ?? 1)
      : (evento.dias ?? 1);
    const marginFactor = 1 + ((this.granMargenPct ?? 0) / 100);
    return (evento.materiales ?? []).map(item => {
      if ((!item.materialId && !item.nombre) || !item.cantidad) {
        return null;
      }
      const mat = this.resolveMaterial(item.materialId, item.nombre);
      const tarifa = mat?.tarifaDia ?? 0;
      const cantidad = item.cantidad ?? 0;
      const total = cantidad * tarifa * multiplier;
      return {
        nombre: mat?.nombre ?? item.nombre ?? 'Sin nombre',
        cantidad,
        tarifa,
        total,
        totalConMargen: total * marginFactor
      };
    }).filter((m): m is { nombre: string; cantidad: number; tarifa: number; total: number; totalConMargen: number } => !!m && m.cantidad > 0);
  }

  get tecnicosDetalle(): { nombre: string; horas: number; tarifa: number; total: number; totalConMargen: number }[] {
    const presupuestoGuardado = this.presupuestoGuardadoSeleccionado;
    if (presupuestoGuardado?.tecnicos?.length) {
      const marginFactor = 1 + ((this.granMargenPct ?? 0) / 100);
      return (presupuestoGuardado.tecnicos ?? [])
        .map(item => ({
          nombre: item.nombre ?? 'Sin nombre',
          horas: item.horas ?? 0,
          tarifa: item.tarifaHora ?? 0,
          total: item.total ?? 0,
          totalConMargen: (item.total ?? 0) * marginFactor
        }))
        .filter(item => item.horas > 0);
    }
    const evento = this.eventoSeleccionado;
    if (!evento) return [];
    const multiplier = evento.modoCalculo === 'Jornadas'
      ? (evento.jornadas ?? 1)
      : (evento.dias ?? 1);
    const marginFactor = 1 + ((this.granMargenPct ?? 0) / 100);
    return (evento.tecnicosDetalle ?? []).map(t => {
      const horas = t.horas ?? 0;
      const tarifa = t.tarifaHora ?? 0;
      const total = horas * tarifa * multiplier;
      return {
        nombre: t.nombre ?? 'Sin nombre',
        horas,
        tarifa,
        total,
        totalConMargen: total * marginFactor
      };
    }).filter(t => t.horas > 0);
  }

  onGranMargenChange() {
    this.syncImportePresentado();
  }

  private syncImportePresentado() {
    this.importePresentado = this.totalConMargen;
  }

  private resetPresupuestoClienteForm(clearSelection = true) {
    if (clearSelection) {
      this.eventoSeleccionadoId = '';
    }
    this.importePresentado = 0;
    this.estadoPresupuesto = 'Pendiente';
    this.granMargenPct = 0;
  }

  private normalizeEstadoPresupuesto(
    estado?: string | null
  ): 'Pendiente' | 'Aceptado' | 'Rechazado' {
    if (estado === 'Aceptado' || estado === 'Rechazado' || estado === 'Pendiente') {
      return estado;
    }
    return 'Pendiente';
  }

  private resolveTarifaMaterialPresupuesto(
    item: { materialId?: string; nombre?: string; cantidad?: number; tarifaDia?: number; tarifa?: number; precio?: number; total?: number },
    material?: Material
  ): number {
    const cantidad = item.cantidad ?? 0;
    const tarifaGuardada = item.tarifaDia ?? item.tarifa ?? item.precio;
    if (tarifaGuardada != null && tarifaGuardada > 0) return tarifaGuardada;
    if (material?.tarifaDia != null && material.tarifaDia > 0) return material.tarifaDia;
    if (cantidad > 0 && item.total != null && item.total > 0) return item.total / cantidad;
    return 0;
  }

  generarCorreoPresupuesto() {
    const evento = this.eventoSeleccionado;
    if (!evento) return;
    const cliente = this.clienteEventoSeleccionado || 'Cliente';
    const asunto = `Presupuesto - ${evento.titulo ?? 'Evento'}`;
    const lineasMaterial = this.materialesDetalle
      .map(m => `- ${m.nombre} | ${m.cantidad} uds | ${m.tarifa.toFixed(2)} | ${m.total.toFixed(2)}`)
      .join('\n');

    const cuerpo = [
      `Cliente: ${cliente}`,
      `Evento: ${evento.titulo ?? ''}`,
      `Fecha: ${evento.fecha ?? ''}`,
      `Duracion: ${this.duracionLabel}`,
      '',
      'Material:',
      lineasMaterial || '- Sin material',
      '',
      `Coste tecnicos: ${this.tecnicosCosteEvento.toFixed(2)}`,
      `Coste material: ${this.materialesCosteEvento.toFixed(2)}`,
      `Coste total: ${this.presupuestoCalculadoEvento.toFixed(2)}`,
      `Gran margen (${(this.granMargenPct ?? 0).toFixed(2)}%): ${this.granMargenImporte.toFixed(2)}`,
      `Total con margen: ${this.totalConMargen.toFixed(2)}`,
      '',
      `Importe presentado: ${(this.importePresentado ?? 0).toFixed(2)}`
    ].join('\n');

    const mailto = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    if (typeof window !== 'undefined') {
      window.location.href = mailto;
    }
  }

  get eventosAceptados(): Evento[] {
    return (this.eventos ?? [])
      .filter(e => (e.presupuestoPresentado ?? 0) > 0 && e.presupuestoEstado === 'Aceptado')
      .sort((a, b) => (a.fecha ?? '').localeCompare(b.fecha ?? ''));
  }

  get eventosPendientes(): Evento[] {
    return (this.eventos ?? [])
      .filter(e => (e.presupuestoPresentado ?? 0) <= 0 || e.presupuestoEstado !== 'Aceptado')
      .sort((a, b) => (a.fecha ?? '').localeCompare(b.fecha ?? ''));
  }

  nombreCliente(id?: string): string {
    if (!id) return '';
    return this.clientes.find(c => c.id === id)?.nombre ?? '';
  }

  nombreMaterial(id?: string): string {
    const material = this.materiales.find(m => m.id === id) ?? this.materiales.find(m => m.nombre === id);
    return material?.nombre || 'Desconocido';
  }

  private resolveMaterial(materialId?: string, nombre?: string): Material | undefined {
    const targetId = this.normalizeLookup(materialId);
    const targetName = this.normalizeLookup(nombre);
    return this.materiales.find(m => this.normalizeLookup(m.id) === targetId)
      ?? this.materiales.find(m => this.normalizeLookup(m.nombre) === targetId)
      ?? this.materiales.find(m => this.normalizeLookup(m.nombre) === targetName);
  }

  private normalizeLookup(value?: string | null): string {
    return (value ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
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
