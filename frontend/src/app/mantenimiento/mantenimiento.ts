import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Categoria } from '../model/categoria';
import { Proveedor } from '../model/proveedor';
import { Reparacion } from '../model/reparacion';
import { SolicitudPresupuesto } from '../model/solicitud-presupuesto';
import { Material } from '../model/material';

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <header class="section-header">
        <div>
          <h2>Mantenimiento</h2>
          <p class="muted">Estado de equipos y reparaciones</p>
        </div>
        <a class="btn-secondary" routerLink="/">Inicio</a>
      </header>

      <section class="card">
        <header class="section-header compact">
          <div>
            <h3>Categorias</h3>
            <p class="muted">Gestion de categorias para almacen</p>
          </div>
          <button class="btn-primary" (click)="openCategoriasModal()">Abrir</button>
        </header>
      </section>

      <section class="card">
        <header class="section-header compact">
          <div>
            <h3>Proveedores</h3>
            <p class="muted">Alta y gestion de proveedores</p>
          </div>
          <button class="btn-primary" (click)="openProveedoresModal()">Abrir</button>
        </header>
      </section>

      <section class="card">
        <header class="section-header compact">
          <div>
            <h3>Reparaciones</h3>
            <p class="muted">Material en reparacion y fechas de recogida</p>
          </div>
          <button class="btn-primary" (click)="openReparacionesModal()">Abrir</button>
        </header>
      </section>

      <section class="card">
        <header class="section-header compact">
          <div>
            <h3>Solicitudes de presupuesto</h3>
            <p class="muted">Seguimiento de solicitudes a proveedores</p>
          </div>
          <button class="btn-primary" (click)="openSolicitudesModal()">Abrir</button>
        </header>
      </section>

      <div class="modal-backdrop" *ngIf="showCategoriasModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Categorias</h3>
            <button class="icon-btn" (click)="closeCategoriasModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="form-grid compact-grid">
              <input [(ngModel)]="nuevaCategoria.nombre" placeholder="Nombre de categoria">
              <input [(ngModel)]="nuevaCategoria.descripcion" placeholder="Descripcion">
              <button class="btn-primary" (click)="guardarCategoria()">Agregar categoria</button>
            </div>
            <table class="modern-table" *ngIf="categorias.length">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripcion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of categorias">
                  <td><input [(ngModel)]="c.nombre"></td>
                  <td><input [(ngModel)]="c.descripcion"></td>
                  <td>
                    <button class="btn-link" (click)="actualizarCategoria(c)">Guardar</button>
                    <button class="btn-link danger" (click)="borrarCategoria(c.id)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showProveedoresModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Proveedores</h3>
            <button class="icon-btn" (click)="closeProveedoresModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="form-grid">
              <input [(ngModel)]="nuevoProveedor.nombre" placeholder="Nombre">
              <input [(ngModel)]="nuevoProveedor.nif" placeholder="NIF / CIF">
              <input [(ngModel)]="nuevoProveedor.email" placeholder="Email">
              <input [(ngModel)]="nuevoProveedor.telefono" placeholder="Telefono">
              <input [(ngModel)]="nuevoProveedor.direccion" placeholder="Direccion">
              <input [(ngModel)]="nuevoProveedor.contacto" placeholder="Persona de contacto">
              <input [(ngModel)]="nuevoProveedor.notas" placeholder="Notas">
              <label class="check-label">
                <input type="checkbox" [(ngModel)]="nuevoProveedor.proveedorMaterial">
                Proveedor de material
              </label>
              <label class="check-label">
                <input type="checkbox" [(ngModel)]="nuevoProveedor.proveedorReparacion">
                Proveedor de reparaciones
              </label>
              <button class="btn-primary" (click)="guardarProveedor()">Agregar proveedor</button>
            </div>
            <table class="modern-table" *ngIf="proveedores.length">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>NIF</th>
                  <th>Email</th>
                  <th>Telefono</th>
                  <th>Material</th>
                  <th>Reparacion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of proveedores">
                  <td><input [(ngModel)]="p.nombre"></td>
                  <td><input [(ngModel)]="p.nif"></td>
                  <td><input [(ngModel)]="p.email"></td>
                  <td><input [(ngModel)]="p.telefono"></td>
                  <td><input type="checkbox" [(ngModel)]="p.proveedorMaterial"></td>
                  <td><input type="checkbox" [(ngModel)]="p.proveedorReparacion"></td>
                  <td>
                    <button class="btn-link" (click)="actualizarProveedor(p)">Guardar</button>
                    <button class="btn-link danger" (click)="borrarProveedor(p.id)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showReparacionesModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Reparaciones</h3>
            <button class="icon-btn" (click)="closeReparacionesModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="form-grid">
              <label>
                Material
                <select [(ngModel)]="nuevaReparacion.materialId">
                  <option value="">Selecciona material</option>
                  <option *ngFor="let m of materiales" [value]="m.id">{{ m.nombre }}</option>
                </select>
              </label>
              <label>
                Proveedor
                <select [(ngModel)]="nuevaReparacion.proveedorId">
                  <option value="">Selecciona proveedor</option>
                  <option *ngFor="let p of proveedoresReparacion" [value]="p.id">{{ p.nombre }}</option>
                </select>
              </label>
              <label>
                Fecha entrega
                <input type="date" [(ngModel)]="nuevaReparacion.fechaEntrega">
              </label>
              <label>
                Fecha recogida
                <input type="date" [(ngModel)]="nuevaReparacion.fechaRecogida">
              </label>
              <input [(ngModel)]="nuevaReparacion.notas" placeholder="Notas">
              <button class="btn-primary" (click)="guardarReparacion()">Registrar reparacion</button>
            </div>
            <table class="modern-table" *ngIf="reparaciones.length">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Proveedor</th>
                  <th>Entrega</th>
                  <th>Recogida</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of reparaciones">
                  <td>{{ nombreMaterial(r.materialId) }}</td>
                  <td>{{ nombreProveedor(r.proveedorId) }}</td>
                  <td><input type="date" [(ngModel)]="r.fechaEntrega"></td>
                  <td><input type="date" [(ngModel)]="r.fechaRecogida"></td>
                  <td><input [(ngModel)]="r.notas"></td>
                  <td>
                    <button class="btn-link" (click)="actualizarReparacion(r)">Guardar</button>
                    <button class="btn-link danger" (click)="borrarReparacion(r.id)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showSolicitudesModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Solicitudes de presupuesto</h3>
            <button class="icon-btn" (click)="closeSolicitudesModal()">&times;</button>
          </header>
          <div class="modal-body">
            <table class="modern-table" *ngIf="solicitudes.length">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Material</th>
                  <th>Precio</th>
                  <th>Recogida</th>
                  <th>Devolucion</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of solicitudes">
                  <td>{{ nombreProveedor(s.proveedorId) }}</td>
                  <td>{{ nombreMaterial(s.materialId) }}</td>
                  <td><input type="number" min="0" step="0.01" [(ngModel)]="s.precio"></td>
                  <td><input type="date" [(ngModel)]="s.fechaRecogida"></td>
                  <td><input type="date" [(ngModel)]="s.fechaDevolucion"></td>
                  <td><input [(ngModel)]="s.notas"></td>
                  <td>
                    <button class="btn-link" (click)="actualizarSolicitud(s)">Guardar</button>
                    <button class="btn-link danger" (click)="borrarSolicitud(s.id)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
    .btn-link { background: none; border: none; color: #2c3e50; cursor: pointer; margin-right: 8px; }
    .btn-link.danger { color: #c0392b; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 1rem; }
    .compact-grid { gap: 24px; }
    .compact-grid input { padding: 0.4rem 0.55rem; font-size: 0.85rem; }
    .compact-grid .btn-primary { padding: 0.45rem 0.75rem; font-size: 0.85rem; height: 36px; align-self: end; }
    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { text-align: left; padding: 0.75rem; background: #f8f9fa; color: #666; font-weight: 600; }
    .modern-table td { padding: 0.75rem; border-bottom: 1px solid #eee; }
    input, select { padding: 0.5rem 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; width: 100%; }
    .check-label { display: flex; align-items: center; gap: 8px; }

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
      width: min(1200px, 95vw);
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
export class MantenimientoComponent implements OnInit {
  categorias: Categoria[] = [];
  nuevaCategoria: Categoria = { nombre: '', descripcion: '' };

  proveedores: Proveedor[] = [];
  nuevoProveedor: Proveedor = this.resetProveedor();

  reparaciones: Reparacion[] = [];
  nuevaReparacion: Reparacion = this.resetReparacion();

  solicitudes: SolicitudPresupuesto[] = [];
  materiales: Material[] = [];
  showCategoriasModal = false;
  showProveedoresModal = false;
  showReparacionesModal = false;
  showSolicitudesModal = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProveedores();
    this.cargarMateriales();
    this.cargarReparaciones();
    this.cargarSolicitudes();
  }

  get proveedoresReparacion(): Proveedor[] {
    return this.proveedores.filter(p => p.proveedorReparacion);
  }

  guardarCategoria() {
    if (!this.nuevaCategoria.nombre?.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    this.apiService.saveCategoria(this.nuevaCategoria).subscribe({
      next: () => {
        this.nuevaCategoria = { nombre: '', descripcion: '' };
        this.cargarCategorias();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar la categoria')
    });
  }

  openCategoriasModal() {
    this.showCategoriasModal = true;
  }

  closeCategoriasModal() {
    this.showCategoriasModal = false;
  }

  actualizarCategoria(categoria: Categoria) {
    if (!categoria.id) return;
    this.apiService.updateCategoria(categoria.id, categoria).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar la categoria')
    });
  }

  borrarCategoria(id?: string) {
    if (id && confirm('Eliminar categoria?')) {
      this.apiService.deleteCategoria(id).subscribe(() => this.cargarCategorias());
    }
  }

  guardarProveedor() {
    if (!this.nuevoProveedor.nombre?.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    this.apiService.saveProveedor(this.nuevoProveedor).subscribe({
      next: () => {
        this.nuevoProveedor = this.resetProveedor();
        this.cargarProveedores();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar el proveedor')
    });
  }

  openProveedoresModal() {
    this.showProveedoresModal = true;
  }

  closeProveedoresModal() {
    this.showProveedoresModal = false;
  }

  actualizarProveedor(proveedor: Proveedor) {
    if (!proveedor.id) return;
    this.apiService.updateProveedor(proveedor.id, proveedor).subscribe({
      next: () => this.cargarProveedores(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar el proveedor')
    });
  }

  borrarProveedor(id?: string) {
    if (id && confirm('Eliminar proveedor?')) {
      this.apiService.deleteProveedor(id).subscribe(() => this.cargarProveedores());
    }
  }

  guardarReparacion() {
    if (!this.nuevaReparacion.materialId || !this.nuevaReparacion.proveedorId) {
      alert('Material y proveedor son obligatorios');
      return;
    }
    this.apiService.saveReparacion(this.nuevaReparacion).subscribe({
      next: () => {
        this.nuevaReparacion = this.resetReparacion();
        this.cargarReparaciones();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar la reparacion')
    });
  }

  openReparacionesModal() {
    this.showReparacionesModal = true;
  }

  closeReparacionesModal() {
    this.showReparacionesModal = false;
  }

  actualizarReparacion(reparacion: Reparacion) {
    if (!reparacion.id) return;
    this.apiService.updateReparacion(reparacion.id, reparacion).subscribe({
      next: () => this.cargarReparaciones(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar la reparacion')
    });
  }

  borrarReparacion(id?: string) {
    if (id && confirm('Eliminar reparacion?')) {
      this.apiService.deleteReparacion(id).subscribe(() => this.cargarReparaciones());
    }
  }

  actualizarSolicitud(solicitud: SolicitudPresupuesto) {
    if (!solicitud.id) return;
    this.apiService.updateSolicitudPresupuesto(solicitud.id, solicitud).subscribe({
      next: () => this.cargarSolicitudes(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar la solicitud')
    });
  }

  openSolicitudesModal() {
    this.showSolicitudesModal = true;
  }

  closeSolicitudesModal() {
    this.showSolicitudesModal = false;
  }

  borrarSolicitud(id?: string) {
    if (id && confirm('Eliminar solicitud?')) {
      this.apiService.deleteSolicitudPresupuesto(id).subscribe(() => this.cargarSolicitudes());
    }
  }

  private cargarCategorias() {
    this.apiService.getCategorias().subscribe({
      next: (data) => this.categorias = data ?? [],
      error: (err) => console.error('Error cargando categorias:', err)
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

  private cargarReparaciones() {
    this.apiService.getReparaciones().subscribe({
      next: (data) => this.reparaciones = data ?? [],
      error: (err) => console.error('Error cargando reparaciones:', err)
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

  private resetProveedor(): Proveedor {
    return {
      nombre: '',
      nif: '',
      email: '',
      telefono: '',
      direccion: '',
      contacto: '',
      notas: '',
      proveedorMaterial: false,
      proveedorReparacion: false
    };
  }

  private resetReparacion(): Reparacion {
    return {
      materialId: '',
      proveedorId: '',
      fechaEntrega: '',
      fechaRecogida: '',
      notas: ''
    };
  }
}
