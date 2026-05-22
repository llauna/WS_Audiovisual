import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Personal } from '../model/personal';
import { RegistroHoras } from '../model/registro-horas';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="personal-container">
      <header class="section-header">
        <div>
          <h2>Gestion de Personal</h2>
          <p>Administra tecnicos internos, autonomos y subcontratas</p>
        </div>
        <a class="btn-secondary" routerLink="/dashboard">Inicio</a>
      </header>

      <div class="form-container card">
        <div class="section-header">
          <div>
            <h3>Registrar nuevo tecnico</h3>
            <p class="muted">Alta de personal interno y externo</p>
          </div>
          <button class="btn-save" (click)="openTecnicoModal()">Abrir</button>
        </div>
      </div>

      <div class="list-container card">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Nombre completo</th>
              <th>DNI</th>
              <th>Cargo</th>
              <th>Contrato</th>
              <th>Empresa</th>
              <th>Tarifa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of listaPersonal">
              <td><strong>{{ p.nombre }} {{ p.apellidos }}</strong></td>
              <td>{{ p.dni }}</td>
              <td>{{ p.cargo }}</td>
              <td><span class="badge" [ngClass]="p.tipoContrato">{{ p.tipoContrato }}</span></td>
              <td>{{ p.empresa }}</td>
              <td>{{ p.tarifaHora }}</td>
              <td>
                <button class="btn-delete" (click)="eliminarPersona(p.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <section class="card">
        <div class="section-header">
          <div>
            <h3>Control de horas</h3>
            <p class="muted">Registro de horas y coste por tecnico</p>
          </div>
          <button class="btn-save" (click)="openHorasModal()">Abrir</button>
        </div>
      </section>

      <div class="modal-backdrop" *ngIf="showTecnicoModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Registrar nuevo tecnico</h3>
            <button class="icon-btn" (click)="closeTecnicoModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="form-grid">
              <input [(ngModel)]="nuevaPersona.nombre" placeholder="Nombre">
              <input [(ngModel)]="nuevaPersona.apellidos" placeholder="Apellidos">
              <input [(ngModel)]="nuevaPersona.dni" placeholder="DNI / NIE">
              <input [(ngModel)]="nuevaPersona.cargo" placeholder="Cargo (ej: Tecnico Sonido)">
              <input [(ngModel)]="nuevaPersona.telefono" placeholder="Telefono">
              <input [(ngModel)]="nuevaPersona.email" placeholder="Email">
              <input type="number" min="0" step="0.01" [(ngModel)]="nuevaPersona.tarifaHora" placeholder="Tarifa por hora">

              <select [(ngModel)]="nuevaPersona.tipoContrato">
                <option value="Plantilla">Plantilla</option>
                <option value="Autonomo">Autonomo</option>
                <option value="Subcontratado">Subcontratado</option>
              </select>

              <input *ngIf="nuevaPersona.tipoContrato !== 'Plantilla'"
                     [(ngModel)]="nuevaPersona.empresa"
                     [placeholder]="nuevaPersona.tipoContrato === 'Autonomo' ? 'NIF / Razon Social' : 'Empresa Subcontrata'">
            </div>
            <button class="btn-save" (click)="guardarPersonal()">Guardar en base de datos</button>
          </div>
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showHorasModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Control de horas</h3>
            <button class="icon-btn" (click)="closeHorasModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="form-grid hours-form">
              <label>
                Tecnico
                <select [(ngModel)]="nuevoRegistro.personalId" (ngModelChange)="onTecnicoChange()">
                  <option value="">Selecciona tecnico</option>
                  <option *ngFor="let p of listaPersonal" [value]="p.id">{{ p.nombre }} {{ p.apellidos }}</option>
                </select>
              </label>
              <label>
                Fecha
                <input type="date" [(ngModel)]="nuevoRegistro.fecha">
              </label>
              <label>
                Horas
                <input type="number" min="0" step="0.25" [(ngModel)]="nuevoRegistro.horas">
              </label>
              <label>
                Tipo
                <select [(ngModel)]="nuevoRegistro.tipo">
                  <option value="Plantilla">Plantilla</option>
                  <option value="Extra">Extra</option>
                </select>
              </label>
              <label>
                Tarifa / hora
                <input type="number" min="0" step="0.01" [(ngModel)]="nuevoRegistro.tarifaHora">
              </label>
              <label>
                Notas
                <input type="text" [(ngModel)]="nuevoRegistro.notas" placeholder="Opcional">
              </label>
              <button class="btn-save" (click)="guardarHora()">Registrar horas</button>
            </div>

            <div class="toolbar">
              <label>
                Filtrar tecnico
                <select [(ngModel)]="filtroPersonalId">
                  <option value="">Todos</option>
                  <option *ngFor="let p of listaPersonal" [value]="p.id">{{ p.nombre }} {{ p.apellidos }}</option>
                </select>
              </label>
            </div>

            <div class="summary">
              <div><strong>Total horas:</strong> {{ totalHoras | number:'1.2-2' }}</div>
              <div><strong>Total coste:</strong> {{ totalCoste | number:'1.2-2' }}</div>
              <div><strong>Horas plantilla:</strong> {{ totalHorasPlantilla | number:'1.2-2' }}</div>
              <div><strong>Horas extra:</strong> {{ totalHorasExtra | number:'1.2-2' }}</div>
            </div>

            <table class="modern-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tecnico</th>
                  <th>Tipo</th>
                  <th>Horas</th>
                  <th>Tarifa</th>
                  <th>Coste</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of registrosFiltrados">
                  <td>{{ r.fecha }}</td>
                  <td>{{ nombreTecnico(r.personalId) }}</td>
                  <td>{{ r.tipo }}</td>
                  <td>{{ r.horas }}</td>
                  <td>{{ r.tarifaHora }}</td>
                  <td>{{ costeRegistro(r) | number:'1.2-2' }}</td>
                  <td>{{ r.notas }}</td>
                  <td><button class="btn-delete" (click)="eliminarHora(r.id)">Eliminar</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .personal-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 2rem; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .hours-form { align-items: end; }
    input, select { padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; }
    label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #344054; }
    .btn-save { background: #27ae60; color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; cursor: pointer; font-weight: bold; }
    .btn-save:hover { background: #219150; }

    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { text-align: left; padding: 1rem; background: #f8f9fa; color: #666; font-weight: 600; }
    .modern-table td { padding: 1rem; border-bottom: 1px solid #eee; }

    .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
    .Plantilla { background: #e3f2fd; color: #1976d2; }
    .Autonomo { background: #f3e5f5; color: #7b1fa2; }
    .Subcontratado { background: #fff3e0; color: #ef6c00; }
    .btn-delete { background: none; border: none; cursor: pointer; font-size: 0.9rem; color: #c0392b; }

    .toolbar { margin: 0 0 1rem; display: flex; gap: 12px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; margin: 0 0 1rem; padding: 0.8rem; background: #f8f9fb; border-radius: 10px; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }

    .btn-secondary { background: #eef2f6; color: #344054; border: none; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; text-decoration: none; }

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
    }
    .modal-header {
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
    }
    .modal-body { padding: 1.5rem; overflow: auto; max-height: calc(90vh - 70px); }
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
export class PersonalComponent implements OnInit {
  listaPersonal: Personal[] = [];
  nuevaPersona: Personal = this.resetForm();

  registros: RegistroHoras[] = [];
  nuevoRegistro: RegistroHoras = this.resetRegistro();
  filtroPersonalId = '';
  showHorasModal = false;
  showTecnicoModal = false;

  constructor(
    private apiService: ApiService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarPersonal();
      this.cargarHoras();
    }
  }

  cargarPersonal() {
    this.apiService.getPersonal().subscribe({
      next: (data: any[]) => {
        const normalized = data.map((p: any) => {
          const raw = (p.tipoContrato ?? p.tipocontrato ?? 'Plantilla') as string;
          const tipoContrato = raw === 'Autónomo' ? 'Autonomo' : raw;
          return { ...p, tipoContrato };
        }) as Personal[];

        this.zone.run(() => {
          this.listaPersonal = normalized;
        });
      },
      error: (error) => {
        console.error('Error al cargar personal:', error);
      }
    });
  }

  cargarHoras() {
    this.apiService.getHoras().subscribe({
      next: (data) => {
        this.registros = data ?? [];
      },
      error: (error) => console.error('Error al cargar horas:', error)
    });
  }

  guardarPersonal() {
    if (!this.nuevaPersona.nombre || !this.nuevaPersona.dni) {
      alert('Nombre y DNI son obligatorios');
      return;
    }
    this.apiService.savePersonal(this.nuevaPersona).subscribe(() => {
      this.cargarPersonal();
      this.nuevaPersona = this.resetForm();
    });
  }

  eliminarPersona(id?: string) {
    if (id && confirm('Eliminar registro de personal?')) {
      this.apiService.deletePersona(id).subscribe(() => this.cargarPersonal());
    }
  }

  openTecnicoModal() {
    this.showTecnicoModal = true;
  }

  closeTecnicoModal() {
    this.showTecnicoModal = false;
  }

  onTecnicoChange() {
    const tecnico = this.listaPersonal.find(p => p.id === this.nuevoRegistro.personalId);
    if (!tecnico) return;
    this.nuevoRegistro.tipo = tecnico.tipoContrato === 'Plantilla' ? 'Plantilla' : 'Extra';
    this.nuevoRegistro.tarifaHora = tecnico.tarifaHora ?? 0;
  }

  guardarHora() {
    if (!this.nuevoRegistro.personalId || !this.nuevoRegistro.fecha) {
      alert('Tecnico y fecha son obligatorios');
      return;
    }
    this.apiService.saveHora(this.nuevoRegistro).subscribe({
      next: () => {
        this.cargarHoras();
        this.nuevoRegistro = this.resetRegistro();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar el registro')
    });
  }

  eliminarHora(id?: string) {
    if (id && confirm('Eliminar registro de horas?')) {
      this.apiService.deleteHora(id).subscribe(() => this.cargarHoras());
    }
  }

  openHorasModal() {
    this.showHorasModal = true;
  }

  closeHorasModal() {
    this.showHorasModal = false;
  }

  get registrosFiltrados(): RegistroHoras[] {
    if (!this.filtroPersonalId) return this.registros;
    return this.registros.filter(r => r.personalId === this.filtroPersonalId);
  }

  get totalHoras(): number {
    return this.registrosFiltrados.reduce((acc, r) => acc + (r.horas ?? 0), 0);
  }

  get totalCoste(): number {
    return this.registrosFiltrados.reduce((acc, r) => acc + this.costeRegistro(r), 0);
  }

  get totalHorasPlantilla(): number {
    return this.registrosFiltrados.filter(r => r.tipo === 'Plantilla')
      .reduce((acc, r) => acc + (r.horas ?? 0), 0);
  }

  get totalHorasExtra(): number {
    return this.registrosFiltrados.filter(r => r.tipo === 'Extra')
      .reduce((acc, r) => acc + (r.horas ?? 0), 0);
  }

  costeRegistro(registro: RegistroHoras): number {
    return (registro.horas ?? 0) * (registro.tarifaHora ?? 0);
  }

  nombreTecnico(personalId: string): string {
    const tecnico = this.listaPersonal.find(p => p.id === personalId);
    return tecnico ? `${tecnico.nombre} ${tecnico.apellidos}` : 'Desconocido';
  }

  private resetForm(): Personal {
    return {
      nombre: '', apellidos: '', dni: '', cargo: '',
      telefono: '', email: '', tipoContrato: 'Plantilla',
      empresa: 'Propio', estado: 'Disponible', tarifaHora: 0
    };
  }

  private resetRegistro(): RegistroHoras {
    return {
      personalId: '',
      fecha: '',
      horas: 0,
      tipo: 'Plantilla',
      tarifaHora: 0,
      notas: ''
    };
  }
}
