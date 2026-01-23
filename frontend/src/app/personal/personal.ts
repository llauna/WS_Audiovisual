import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Personal } from '../model/personal';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="personal-container">
      <header class="section-header">
        <h2>👥 Gestión de Personal</h2>
        <p>Administra técnicos internos, autónomos y subcontratas</p>
      </header>

      <!-- Formulario de Alta -->
      <div class="form-container card">
        <h3>Registrar Nuevo Técnico</h3>
        <div class="form-grid">
          <input [(ngModel)]="nuevaPersona.nombre" placeholder="Nombre">
          <input [(ngModel)]="nuevaPersona.apellidos" placeholder="Apellidos">
          <input [(ngModel)]="nuevaPersona.dni" placeholder="DNI / NIE">
          <input [(ngModel)]="nuevaPersona.cargo" placeholder="Cargo (ej: Técnico Sonido)">
          <input [(ngModel)]="nuevaPersona.telefono" placeholder="Teléfono">
          <input [(ngModel)]="nuevaPersona.email" placeholder="Email">

          <select [(ngModel)]="nuevaPersona.tipoContrato">
            <option value="Plantilla">Plantilla</option>
            <option value="Autónomo">Autónomo</option>
            <option value="Subcontratado">Subcontratado</option>
          </select>

          <input *ngIf="nuevaPersona.tipoContrato !== 'Plantilla'"
                 [(ngModel)]="nuevaPersona.empresa"
                 [placeholder]="nuevaPersona.tipoContrato === 'Autónomo' ? 'NIF / Razón Social' : 'Empresa Subcontrata'">
        </div>
        <button class="btn-save" (click)="guardarPersonal()">Guardar en Base de Datos</button>
      </div>

      <!-- Listado de Personal -->
      <div class="list-container card">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>DNI</th>
              <th>Cargo</th>
              <th>Contrato</th>
              <th>Empresa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of listaPersonal">
              <td><strong>{{p.nombre}} {{p.apellidos}}</strong></td>
              <td>{{p.dni}}</td>
              <td>{{p.cargo}}</td>
              <td><span class="badge" [ngClass]="p.tipoContrato">{{p.tipoContrato}}</span></td>
              <td>{{p.empresa}}</td>
              <td>
                <button class="btn-delete" (click)="eliminarPersona(p.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .personal-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 2rem; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    input, select { padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; }
    .btn-save { background: #27ae60; color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; cursor: pointer; font-weight: bold; }
    .btn-save:hover { background: #219150; }

    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { text-align: left; padding: 1rem; background: #f8f9fa; color: #666; font-weight: 600; }
    .modern-table td { padding: 1rem; border-bottom: 1px solid #eee; }

    .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
    .Plantilla { background: #e3f2fd; color: #1976d2; }
    .Autónomo { background: #f3e5f5; color: #7b1fa2; }
    .Subcontratado { background: #fff3e0; color: #ef6c00; }
    .btn-delete { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
  `]
})
export class PersonalComponent implements OnInit {
  listaPersonal: Personal[] = [];
  nuevaPersona: Personal = this.resetForm();

  constructor(
    private apiService: ApiService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    // En SSR puede “parpadear” el HTML. Forzamos carga SOLO en navegador.
    if (isPlatformBrowser(this.platformId)) {
      this.cargarPersonal();
    }
  }

  cargarPersonal() {
    this.apiService.getPersonal().subscribe({
      next: (data: any[]) => {
        // Normaliza tipoContrato por si el backend devuelve "tipocontrato"
        const normalized = data.map((p: any) => ({
          ...p,
          tipoContrato: p.tipoContrato ?? p.tipocontrato ?? 'Plantilla'
        })) as Personal[];

        // Asegura que el update dispare change detection en el cliente
        this.zone.run(() => {
          this.listaPersonal = normalized;
        });
      },
      error: (error) => {
        console.error('Error al cargar personal:', error);
      }
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
    if (id && confirm('¿Eliminar registro de personal?')) {
      this.apiService.deletePersona(id).subscribe(() => this.cargarPersonal());
    }
  }

  private resetForm(): Personal {
    return {
      nombre: '', apellidos: '', dni: '', cargo: '',
      telefono: '', email: '', tipoContrato: 'Plantilla',
      empresa: 'Propio', estado: 'Disponible'
    };
  }
}
