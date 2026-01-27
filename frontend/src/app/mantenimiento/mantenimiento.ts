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
import { Cliente } from '../model/cliente';

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

      <div class="cards-grid">
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

        <section class="card">
          <header class="section-header compact">
            <div>
              <h3>Clientes</h3>
              <p class="muted">Clientes que solicitan eventos</p>
            </div>
            <button class="btn-primary" (click)="openClientesModal()">Abrir</button>
          </header>
        </section>
      </div>

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
            <div class="form-grid provider-grid">
              <label>
                Nombre
                <input [(ngModel)]="nuevoProveedor.nombre" placeholder="Nombre">
              </label>
              <label>
                NIF / CIF
                <input [(ngModel)]="nuevoProveedor.nif" placeholder="NIF / CIF">
              </label>
              <label>
                Email
                <input [(ngModel)]="nuevoProveedor.email" placeholder="Email">
              </label>
              <label>
                Telefono
                <input [(ngModel)]="nuevoProveedor.telefono" placeholder="Telefono">
              </label>
              <label>
                Direccion
                <input [(ngModel)]="nuevoProveedor.direccion" placeholder="Direccion">
              </label>
              <label>
                Persona de contacto
                <input [(ngModel)]="nuevoProveedor.contacto" placeholder="Persona de contacto">
              </label>
              <label class="span-2">
                Notas
                <textarea rows="3" [(ngModel)]="nuevoProveedor.notas" placeholder="Notas"></textarea>
              </label>
              <div class="check-group">
                <label class="check-card">
                  <input type="checkbox" [(ngModel)]="nuevoProveedor.proveedorMaterial">
                  <span>Proveedor de material</span>
                </label>
                <label class="check-card">
                  <input type="checkbox" [(ngModel)]="nuevoProveedor.proveedorReparacion">
                  <span>Proveedor de reparaciones</span>
                </label>
              </div>
              <div class="form-actions">
                <button class="btn-primary" (click)="guardarProveedor()">Agregar proveedor</button>
              </div>
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
            <div class="form-grid reparacion-grid">
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
              <label class="date-field">
                Fecha entrega
                <input type="date" [(ngModel)]="nuevaReparacion.fechaEntrega">
              </label>
              <label class="date-field">
                Fecha recogida
                <input type="date" [(ngModel)]="nuevaReparacion.fechaRecogida">
              </label>
              <label class="span-3">
                Notas
                <textarea rows="2" [(ngModel)]="nuevaReparacion.notas" placeholder="Notas"></textarea>
              </label>
              <div class="form-actions align-stretch">
                <button class="btn-primary" (click)="guardarReparacion()">Registrar reparacion</button>
              </div>
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

      <div class="modal-backdrop" *ngIf="showClientesModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Clientes</h3>
            <button class="icon-btn" (click)="closeClientesModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="form-grid client-grid">
              <label>
                Nombre
                <input [(ngModel)]="nuevoCliente.nombre" placeholder="Nombre">
              </label>
              <label>
                NIF / CIF
                <input [(ngModel)]="nuevoCliente.nif" placeholder="NIF / CIF">
              </label>
              <label>
                Email
                <input [(ngModel)]="nuevoCliente.email" placeholder="Email">
              </label>
              <label>
                Telefono
                <input [(ngModel)]="nuevoCliente.telefono" placeholder="Telefono">
              </label>
              <label>
                Direccion
                <input [(ngModel)]="nuevoCliente.direccion" placeholder="Direccion">
              </label>
              <label>
                Persona de contacto
                <input [(ngModel)]="nuevoCliente.contacto" placeholder="Persona de contacto">
              </label>
              <label class="span-2">
                Notas
                <textarea rows="3" [(ngModel)]="nuevoCliente.notas" placeholder="Notas"></textarea>
              </label>
              <div class="form-actions">
                <button class="btn-primary" (click)="guardarCliente()">Agregar cliente</button>
              </div>
            </div>
            <table class="modern-table" *ngIf="clientes.length">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>NIF</th>
                  <th>Email</th>
                  <th>Telefono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of clientes">
                  <td><input [(ngModel)]="c.nombre"></td>
                  <td><input [(ngModel)]="c.nif"></td>
                  <td><input [(ngModel)]="c.email"></td>
                  <td><input [(ngModel)]="c.telefono"></td>
                  <td>
                    <button class="btn-link" (click)="actualizarCliente(c)">Guardar</button>
                    <button class="btn-link danger" (click)="borrarCliente(c.id)">Eliminar</button>
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
    .cards-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .section-header.compact { margin-bottom: 1rem; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }
    .card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .btn-secondary { background: #eef2f6; color: #344054; border: none; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; text-decoration: none; }
    .btn-primary { background: #27ae60; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer; }
    .btn-primary:hover { background: #219150; }
    .btn-link { background: none; border: none; color: #2c3e50; cursor: pointer; margin-right: 8px; }
    .btn-link.danger { color: #c0392b; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 1rem; }
    .compact-grid { gap: 24px; }
    .compact-grid input { padding: 0.4rem 0.55rem; font-size: 0.85rem; }
    .compact-grid .btn-primary { padding: 0.45rem 0.75rem; font-size: 0.85rem; height: 36px; align-self: end; }
    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { text-align: left; padding: 0.75rem; background: #f8f9fa; color: #666; font-weight: 600; }
    .modern-table td { padding: 0.75rem; border-bottom: 1px solid #eee; }
    input, select, textarea { padding: 0.5rem 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; width: 100%; }
    label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #344054; }
    .provider-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; column-gap: 24px; }
    .client-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; column-gap: 24px; }
    .reparacion-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; column-gap: 24px; }
    .reparacion-grid .date-field { margin-right: 8px; }
    .span-2 { grid-column: span 2; }
    .span-3 { grid-column: span 3; }
    .check-group { display: flex; gap: 12px; align-items: stretch; }
    .check-card {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 0.6rem 0.8rem;
      border: 1px solid #e4e7ec;
      border-radius: 10px;
      background: #f8fafc;
      font-weight: 600;
      color: #344054;
      cursor: pointer;
    }
    .check-card input { width: 18px; height: 18px; }
    .form-actions { display: flex; justify-content: flex-end; }
    .form-actions.align-bottom { align-items: flex-end; }
    .form-actions.align-stretch { align-items: stretch; }
    .form-actions.align-stretch .btn-primary { height: 100%; }

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
  clientes: Cliente[] = [];
  nuevoCliente: Cliente = this.resetCliente();
  showCategoriasModal = false;
  showProveedoresModal = false;
  showReparacionesModal = false;
  showSolicitudesModal = false;
  showClientesModal = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProveedores();
    this.cargarMateriales();
    this.cargarReparaciones();
    this.cargarSolicitudes();
    this.cargarClientes();
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

  openClientesModal() {
    this.showClientesModal = true;
  }

  closeClientesModal() {
    this.showClientesModal = false;
  }

  borrarSolicitud(id?: string) {
    if (id && confirm('Eliminar solicitud?')) {
      this.apiService.deleteSolicitudPresupuesto(id).subscribe(() => this.cargarSolicitudes());
    }
  }

  guardarCliente() {
    if (!this.nuevoCliente.nombre?.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    this.apiService.saveCliente(this.nuevoCliente).subscribe({
      next: () => {
        this.nuevoCliente = this.resetCliente();
        this.cargarClientes();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar el cliente')
    });
  }

  actualizarCliente(cliente: Cliente) {
    if (!cliente.id) return;
    this.apiService.updateCliente(cliente.id, cliente).subscribe({
      next: () => this.cargarClientes(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar el cliente')
    });
  }

  borrarCliente(id?: string) {
    if (id && confirm('Eliminar cliente?')) {
      this.apiService.deleteCliente(id).subscribe(() => this.cargarClientes());
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

  private cargarClientes() {
    this.apiService.getClientes().subscribe({
      next: (data) => this.clientes = data ?? [],
      error: (err) => console.error('Error cargando clientes:', err)
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

  private resetCliente(): Cliente {
    return {
      nombre: '',
      nif: '',
      email: '',
      telefono: '',
      direccion: '',
      contacto: '',
      notas: ''
    };
  }
}
