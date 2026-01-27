import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Material } from '../model/material';
import { Almacen } from '../model/almacen';
import { Categoria } from '../model/categoria';

@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="almacen-container">
      <header class="section-header">
        <div>
          <h2>Gestion de almacen</h2>
          <p class="muted">Inventario tecnico por almacen</p>
        </div>
        <a class="btn-secondary" routerLink="/">Inicio</a>
      </header>

      <section class="card">
        <div class="section-header">
          <div>
            <h3>Alta de almacenes</h3>
            <p class="muted">Crear nuevos almacenes y sus ubicaciones</p>
          </div>
          <button class="btn-primary" (click)="openAlmacenModal()">Abrir</button>
        </div>
      </section>

      <section class="card">
        <div class="toolbar">
          <label>
            Almacen
            <select [(ngModel)]="almacenFiltro" (ngModelChange)="onFilterChange()">
              <option value="">Todos</option>
              <option *ngFor="let a of almacenes" [value]="a.nombre">{{ a.nombre }}</option>
              <option *ngIf="!almacenes.length" value="Principal">Principal</option>
            </select>
          </label>
          <label>
            Filas
            <select [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange()">
              <option [ngValue]="5">5</option>
              <option [ngValue]="10">10</option>
              <option [ngValue]="20">20</option>
              <option [ngValue]="50">50</option>
            </select>
          </label>
          <button class="btn-secondary" (click)="openInventarioModal()">Inventario</button>
          <button class="btn-primary" (click)="openMaterialModal()">Alta de material</button>
        </div>
        <div class="repair-note" *ngIf="repairCount > 0">
          Aviso: {{ repairCount }} elemento(s) en reparacion.
        </div>
      </section>

      <div class="modal-backdrop" *ngIf="showAlmacenModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Alta de almacenes</h3>
            <button class="icon-btn" (click)="closeAlmacenModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="form-grid">
              <input [(ngModel)]="nuevoAlmacen.nombre" placeholder="Nombre del almacen">
              <input [(ngModel)]="nuevoAlmacen.ubicacion" placeholder="Ubicacion">
              <input [(ngModel)]="nuevoAlmacen.descripcion" placeholder="Descripcion">
            </div>
            <div class="toolbar almacen-toolbar">
              <label>
                Filas
                <select [(ngModel)]="almacenPageSize" (ngModelChange)="onAlmacenPageSizeChange()">
                  <option [ngValue]="5">5</option>
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                </select>
              </label>
              <button class="btn-primary" (click)="guardarAlmacen()">Agregar almacen</button>
            </div>

            <div class="pagination" *ngIf="almacenTotalPages > 1">
              <button class="btn-link" (click)="prevAlmacenPage()" [disabled]="almacenPage === 1">Anterior</button>
              <span>Pagina {{ almacenPage }} de {{ almacenTotalPages }}</span>
              <button class="btn-link" (click)="nextAlmacenPage()" [disabled]="almacenPage === almacenTotalPages">Siguiente</button>
            </div>

            <table class="compact-table" *ngIf="almacenes.length">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ubicacion</th>
                  <th>Descripcion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of almacenesPaginados">
                  <td>{{ a.nombre }}</td>
                  <td>{{ a.ubicacion }}</td>
                  <td>{{ a.descripcion }}</td>
                  <td><button class="btn-link" (click)="borrarAlmacen(a.id)">Eliminar</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showInventarioModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Inventario de materiales</h3>
            <button class="icon-btn" (click)="closeInventarioModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="toolbar inventario-toolbar">
              <button class="btn-primary" (click)="imprimirInventario()">Imprimir</button>
              <button class="btn-secondary" (click)="marcarInventarioHoy()">Marcar hoy</button>
              <label>
                Filas
                <select [(ngModel)]="inventarioPageSize" (ngModelChange)="onInventarioPageSizeChange()">
                  <option [ngValue]="5">5</option>
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                </select>
              </label>
            </div>
            <div class="pagination" *ngIf="inventarioTotalPages > 1">
              <button class="btn-link" (click)="prevInventarioPage()" [disabled]="inventarioPage === 1">Anterior</button>
              <span>Pagina {{ inventarioPage }} de {{ inventarioTotalPages }}</span>
              <button class="btn-link" (click)="nextInventarioPage()" [disabled]="inventarioPage === inventarioTotalPages">Siguiente</button>
            </div>
            <table class="compact-table">
              <thead>
                <tr>
                  <th>Inventariado</th>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Almacen</th>
                  <th>Ubicacion</th>
                  <th>Total</th>
                  <th>Reservado</th>
                  <th>En reparacion</th>
                  <th>Disponible</th>
                  <th>Tarifa dia</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of inventarioPaginados">
                  <td>
                    <input
                      type="checkbox"
                      [ngModel]="inventarioDone(m)"
                      (ngModelChange)="setInventarioDone(m, $event)"
                    >
                  </td>
                  <td>
                    <input
                      class="inline-input"
                      type="date"
                      [ngModel]="inventarioDate(m)"
                      (ngModelChange)="setInventarioDate(m, $event)"
                    >
                  </td>
                  <td>{{ m.nombre }}</td>
                  <td>{{ m.categoria }}</td>
                  <td>{{ m.almacen }}</td>
                  <td>{{ m.ubicacionAlmacen }}</td>
                  <td>{{ m.stockTotal }}</td>
                  <td>{{ m.stockReservado }}</td>
                  <td>{{ m.stockReparacion }}</td>
                  <td>{{ m.stockDisponible }}</td>
                  <td>{{ m.tarifaDia }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-backdrop" *ngIf="showMaterialModal">
        <div class="modal">
          <header class="modal-header">
            <h3>Alta de material</h3>
            <button class="icon-btn" (click)="closeMaterialModal()">&times;</button>
          </header>
          <div class="modal-body">
            <div class="form-card">
              <label>
                Nombre
                <input [(ngModel)]="nuevoMaterial.nombre" placeholder="Nombre del equipo">
              </label>
              <label>
                Categoria
                <select [(ngModel)]="nuevoMaterial.categoria">
                  <option *ngFor="let c of categoriasDisponibles" [value]="c.nombre">{{ c.nombre }}</option>
                </select>
              </label>
              <label>
                Almacen
                <select [(ngModel)]="nuevoMaterial.almacen">
                  <option *ngFor="let a of almacenes" [value]="a.nombre">{{ a.nombre }}</option>
                  <option *ngIf="!almacenes.length" value="Principal">Principal</option>
                </select>
              </label>
              <label>
                Ubicacion
                <input [(ngModel)]="nuevoMaterial.ubicacionAlmacen" placeholder="Ubicacion">
              </label>
              <label>
                Total
                <input type="number" min="0" [(ngModel)]="nuevoMaterial.stockTotal" placeholder="Stock total">
              </label>
              <label>
                En reparacion
                <input type="number" min="0" [(ngModel)]="nuevoMaterial.stockReparacion" placeholder="En reparacion">
              </label>
              <label>
                Tarifa dia
                <input type="number" min="0" step="0.01" [(ngModel)]="nuevoMaterial.tarifaDia" placeholder="Tarifa dia">
              </label>
              <div class="form-actions align-end">
                <button class="btn-primary" (click)="agregarMaterial()">Agregar material</button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Almacen</th>
                  <th>Ubicacion</th>
                  <th>Total</th>
                  <th>En reparacion</th>
                  <th>Tarifa dia</th>
                  <th>Reservado</th>
                  <th>Disponible</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of materialesPaginados">
                  <td>{{ m.nombre }}</td>
                  <td>
                    <select
                      [(ngModel)]="m.categoria"
                      (ngModelChange)="actualizarCategoriaMaterial(m)"
                    >
                      <option *ngFor="let c of categoriasParaMaterial(m)" [value]="c">{{ c }}</option>
                    </select>
                  </td>
                  <td>{{ m.almacen }}</td>
                  <td>
                    <input
                      class="inline-input"
                      [(ngModel)]="m.ubicacionAlmacen"
                      (blur)="actualizarUbicacion(m)"
                    >
                  </td>
                  <td>{{ m.stockTotal }}</td>
                  <td>
                    <input
                      class="inline-input"
                      type="number"
                      min="0"
                      [(ngModel)]="m.stockReparacion"
                      (change)="actualizarStockReparacion(m)"
                    >
                  </td>
                  <td>{{ m.tarifaDia }}</td>
                  <td>{{ m.stockReservado }}</td>
                  <td>{{ m.stockDisponible }}</td>
                  <td><button class="btn-link" (click)="borrarMaterial(m.id)">Eliminar</button></td>
                </tr>
              </tbody>
            </table>

            <div class="pagination" *ngIf="totalPages > 1">
              <button class="btn-link" (click)="prevPage()" [disabled]="currentPage === 1">Anterior</button>
              <span>Pagina {{ currentPage }} de {{ totalPages }}</span>
              <button class="btn-link" (click)="nextPage()" [disabled]="currentPage === totalPages">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .almacen-container { padding: 20px; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }

    .card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
    .toolbar { margin-bottom: 1rem; }
    .toolbar label { display: inline-flex; gap: 10px; align-items: center; font-weight: 600; }
    .toolbar select { padding: 0.4rem 0.6rem; border: 1px solid #ddd; border-radius: 6px; }
    .toolbar { display: flex; gap: 16px; flex-wrap: wrap; }
    .almacen-toolbar { align-items: center; justify-content: space-between; margin-top: 12px; }

    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 1rem; }
    .form-card { margin-bottom: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
    .form-card label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #344054; }
    .form-card input, .form-card select, .form-grid input { padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; }
    .form-actions { margin-top: 12px; }
    .form-actions.align-end { align-self: end; margin-top: 0; }
    .btn-primary { background: #27ae60; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer; }
    .btn-primary:hover { background: #219150; }
    .btn-link { background: none; border: none; color: #2c3e50; cursor: pointer; }
    .btn-link[disabled] { opacity: 0.5; cursor: not-allowed; }
    .inline-input { width: 90px; padding: 0.35rem 0.5rem; border: 1px solid #ddd; border-radius: 6px; }
    .toolbar .btn-secondary { height: 36px; }

    .pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 1rem; }
    .repair-note { margin: 0 0 1rem; padding: 0.6rem 0.8rem; background: #fff6e6; border: 1px solid #f0c36d; border-radius: 8px; color: #7a4d00; font-weight: 600; }

    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
    th { background: #f4f4f4; }
    .compact-table th, .compact-table td { padding: 8px; }

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
      width: min(1200px, 98vw);
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
    .inventario-toolbar { flex-wrap: nowrap; align-items: center; }
    .inventario-toolbar label { margin-left: auto; }
  `]
})
export class AlmacenComponent implements OnInit {
  materiales: Material[] = [];
  almacenes: Almacen[] = [];
  categorias: Categoria[] = [];
  almacenFiltro = '';
  currentPage = 1;
  pageSize = 10;
  showAlmacenModal = false;
  almacenPage = 1;
  almacenPageSize = 5;
  showInventarioModal = false;
  showMaterialModal = false;
  inventarioEstado: Record<string, { done: boolean; date: string }> = {};
  inventarioPage = 1;
  inventarioPageSize = 10;

  nuevoMaterial: Material = this.emptyMaterial();
  nuevoAlmacen: Almacen = { nombre: '', ubicacion: '', descripcion: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarAlmacenes();
    this.cargarMateriales();
    this.cargarCategorias();
  }

  get materialesFiltrados(): Material[] {
    if (!this.almacenFiltro) return this.materiales;
    return this.materiales.filter(m => m.almacen === this.almacenFiltro);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.materialesFiltrados.length / this.pageSize));
  }

  get almacenTotalPages(): number {
    return Math.max(1, Math.ceil(this.almacenes.length / this.almacenPageSize));
  }

  get repairCount(): number {
    return this.materialesFiltrados.reduce((acc, m) => acc + (m.stockReparacion ?? 0), 0);
  }

  get materialesPaginados(): Material[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.materialesFiltrados.slice(start, start + this.pageSize);
  }

  get inventarioTotalPages(): number {
    return Math.max(1, Math.ceil(this.materialesFiltrados.length / this.inventarioPageSize));
  }

  get inventarioPaginados(): Material[] {
    const start = (this.inventarioPage - 1) * this.inventarioPageSize;
    return this.materialesFiltrados.slice(start, start + this.inventarioPageSize);
  }

  get almacenesPaginados(): Almacen[] {
    const start = (this.almacenPage - 1) * this.almacenPageSize;
    return this.almacenes.slice(start, start + this.almacenPageSize);
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  onPageSizeChange() {
    this.currentPage = 1;
  }

  onInventarioPageSizeChange() {
    this.inventarioPage = 1;
  }

  onAlmacenPageSizeChange() {
    this.almacenPage = 1;
  }

  prevPage() {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage() {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }

  prevInventarioPage() {
    this.inventarioPage = Math.max(1, this.inventarioPage - 1);
  }

  nextInventarioPage() {
    this.inventarioPage = Math.min(this.inventarioTotalPages, this.inventarioPage + 1);
  }

  prevAlmacenPage() {
    this.almacenPage = Math.max(1, this.almacenPage - 1);
  }

  nextAlmacenPage() {
    this.almacenPage = Math.min(this.almacenTotalPages, this.almacenPage + 1);
  }

  cargarAlmacenes() {
    this.apiService.getAlmacenes().subscribe(data => {
      this.almacenes = data ?? [];
      this.almacenPage = Math.min(this.almacenPage, this.almacenTotalPages);
      if (!this.nuevoMaterial.almacen && this.almacenes.length) {
        this.nuevoMaterial.almacen = this.almacenes[0].nombre;
      }
      if (!this.nuevoMaterial.almacen && !this.almacenes.length) {
        this.nuevoMaterial.almacen = 'Principal';
      }
    });
  }

  cargarMateriales() {
    this.apiService.getMateriales().subscribe(data => {
      this.materiales = (data ?? []).map(m => this.normalizeMaterial(m));
    });
  }

  cargarCategorias() {
    this.apiService.getCategorias().subscribe(data => {
      this.categorias = data ?? [];
      if (!this.nuevoMaterial.categoria) {
        this.nuevoMaterial.categoria = this.categorias[0]?.nombre ?? '';
      }
    });
  }

  openAlmacenModal() {
    this.showAlmacenModal = true;
  }

  closeAlmacenModal() {
    this.showAlmacenModal = false;
  }

  openInventarioModal() {
    this.inventarioPage = 1;
    this.showInventarioModal = true;
  }

  closeInventarioModal() {
    this.showInventarioModal = false;
  }

  openMaterialModal() {
    this.showMaterialModal = true;
  }

  closeMaterialModal() {
    this.showMaterialModal = false;
  }

  marcarInventarioHoy() {
    const today = new Date().toISOString().slice(0, 10);
    this.materialesFiltrados.forEach(m => {
      const key = m.id || m.nombre;
      if (!key) return;
      this.inventarioEstado[key] = { done: true, date: today };
    });
  }

  inventarioKey(material: Material): string {
    return material.id || material.nombre || '';
  }

  inventarioDone(material: Material): boolean {
    const key = this.inventarioKey(material);
    return key ? this.inventarioEstado[key]?.done ?? false : false;
  }

  setInventarioDone(material: Material, value: boolean) {
    const key = this.inventarioKey(material);
    if (!key) return;
    this.inventarioEstado[key] = {
      done: value,
      date: this.inventarioEstado[key]?.date ?? ''
    };
  }

  inventarioDate(material: Material): string {
    const key = this.inventarioKey(material);
    return key ? this.inventarioEstado[key]?.date ?? '' : '';
  }

  setInventarioDate(material: Material, value: string) {
    const key = this.inventarioKey(material);
    if (!key) return;
    this.inventarioEstado[key] = {
      done: this.inventarioEstado[key]?.done ?? false,
      date: value ?? ''
    };
  }

  imprimirInventario() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  guardarAlmacen() {
    if (!this.nuevoAlmacen.nombre?.trim()) {
      alert('El nombre del almacen es obligatorio');
      return;
    }
    this.apiService.saveAlmacen(this.nuevoAlmacen).subscribe({
      next: () => {
        this.nuevoAlmacen = { nombre: '', ubicacion: '', descripcion: '' };
        this.cargarAlmacenes();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar el almacen')
    });
  }

  borrarAlmacen(id?: string) {
    if (id && confirm('Eliminar almacen?')) {
      this.apiService.deleteAlmacen(id).subscribe(() => this.cargarAlmacenes());
    }
  }

  agregarMaterial() {
    const material = this.normalizeMaterial(this.nuevoMaterial);
    this.apiService.saveMaterial(material).subscribe({
      next: () => {
        this.cargarMateriales();
        this.nuevoMaterial = this.emptyMaterial();
        if (this.almacenes.length) {
          this.nuevoMaterial.almacen = this.almacenes[0].nombre;
        }
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar el material')
    });
  }

  borrarMaterial(id?: string) {
    if (id && confirm('Eliminar equipo?')) {
      this.apiService.deleteMaterial(id).subscribe(() => this.cargarMateriales());
    }
  }

  actualizarStockReparacion(material: Material) {
    if (!material.id) return;
    if ((material.stockReparacion ?? 0) < 0) {
      alert('La cantidad en reparacion no puede ser negativa');
      material.stockReparacion = 0;
      return;
    }
    this.apiService.updateMaterial(material.id, material).subscribe({
      next: () => this.cargarMateriales(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar el stock en reparacion')
    });
  }

  actualizarUbicacion(material: Material) {
    if (!material.id) return;
    this.apiService.updateMaterial(material.id, material).subscribe({
      next: () => this.cargarMateriales(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar la ubicacion')
    });
  }

  actualizarCategoriaMaterial(material: Material) {
    if (!material.id) return;
    this.apiService.updateMaterial(material.id, material).subscribe({
      next: () => this.cargarMateriales(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar la categoria')
    });
  }

  private emptyMaterial(): Material {
    return {
      nombre: '',
      categoria: '',
      stockTotal: 0,
      stockDisponible: 0,
      stockReservado: 0,
      stockReparacion: 0,
      tarifaDia: 0,
      almacen: 'Principal',
      ubicacionAlmacen: '',
      estado: 'Operativo'
    };
  }

  private normalizeMaterial(material: Material): Material {
    const stockTotal = material.stockTotal ?? 0;
    const stockReservado = material.stockReservado ?? 0;
    const stockReparacion = material.stockReparacion ?? 0;
    const stockDisponible = material.stockDisponible ?? (stockTotal - stockReservado - stockReparacion);
    const tarifaDia = material.tarifaDia ?? 0;

    return {
      ...material,
      stockTotal,
      stockReservado,
      stockReparacion,
      stockDisponible,
      tarifaDia,
      almacen: (material.almacen ?? '').trim() || 'Principal',
      ubicacionAlmacen: material.ubicacionAlmacen ?? '',
      estado: material.estado ?? 'Operativo'
    };
  }

  get categoriasDisponibles(): { nombre: string }[] {
    return this.categorias;
  }

  categoriasParaMaterial(material: Material): string[] {
    const base = this.categoriasDisponibles.map(c => c.nombre);
    const actual = (material.categoria ?? '').trim();
    if (actual && !base.includes(actual)) {
      return [actual, ...base];
    }
    return base;
  }
}
