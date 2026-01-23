import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Material } from '../model/material';
import { Almacen } from '../model/almacen';

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
        <h3>Alta de almacenes</h3>
        <div class="form-grid">
          <input [(ngModel)]="nuevoAlmacen.nombre" placeholder="Nombre del almacen">
          <input [(ngModel)]="nuevoAlmacen.ubicacion" placeholder="Ubicacion">
          <input [(ngModel)]="nuevoAlmacen.descripcion" placeholder="Descripcion">
          <button class="btn-primary" (click)="guardarAlmacen()">Agregar almacen</button>
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
            <tr *ngFor="let a of almacenes">
              <td>{{ a.nombre }}</td>
              <td>{{ a.ubicacion }}</td>
              <td>{{ a.descripcion }}</td>
              <td><button class="btn-link" (click)="borrarAlmacen(a.id)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
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
        </div>
        <div class="repair-note" *ngIf="repairCount > 0">
          Aviso: {{ repairCount }} elemento(s) en reparacion.
        </div>

        <div class="form-card">
          <input [(ngModel)]="nuevoMaterial.nombre" placeholder="Nombre del equipo">
          <select [(ngModel)]="nuevoMaterial.categoria">
            <option value="Audio">Audio</option>
            <option value="Video">Video</option>
            <option value="Iluminacion">Iluminacion</option>
          </select>
          <select [(ngModel)]="nuevoMaterial.almacen">
            <option *ngFor="let a of almacenes" [value]="a.nombre">{{ a.nombre }}</option>
            <option *ngIf="!almacenes.length" value="Principal">Principal</option>
          </select>
          <input [(ngModel)]="nuevoMaterial.ubicacionAlmacen" placeholder="Ubicacion">
          <input type="number" min="0" [(ngModel)]="nuevoMaterial.stockTotal" placeholder="Stock total">
          <input type="number" min="0" [(ngModel)]="nuevoMaterial.stockReparacion" placeholder="En reparacion">
          <input type="number" min="0" step="0.01" [(ngModel)]="nuevoMaterial.tarifaDia" placeholder="Tarifa dia">
          <button class="btn-primary" (click)="agregarMaterial()">Agregar material</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoria</th>
              <th>Almacen</th>
              <th>Ubicacion</th>
              <th>Total</th>
              <th>Reservado</th>
              <th>En reparacion</th>
              <th>Disponible</th>
              <th>Tarifa dia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of materialesPaginados">
              <td>{{ m.nombre }}</td>
              <td>{{ m.categoria }}</td>
              <td>{{ m.almacen }}</td>
              <td>{{ m.ubicacionAlmacen }}</td>
              <td>{{ m.stockTotal }}</td>
              <td>{{ m.stockReservado }}</td>
              <td>
                <input
                  class="inline-input"
                  type="number"
                  min="0"
                  [(ngModel)]="m.stockReparacion"
                  (change)="actualizarStockReparacion(m)"
                >
              </td>
              <td>{{ m.stockDisponible }}</td>
              <td>{{ m.tarifaDia }}</td>
              <td><button class="btn-link" (click)="borrarMaterial(m.id)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>

        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn-link" (click)="prevPage()" [disabled]="currentPage === 1">Anterior</button>
          <span>Pagina {{ currentPage }} de {{ totalPages }}</span>
          <button class="btn-link" (click)="nextPage()" [disabled]="currentPage === totalPages">Siguiente</button>
        </div>
      </section>
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

    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 1rem; }
    .form-card { margin-bottom: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
    .form-card input, .form-card select, .form-grid input { padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; }
    .btn-primary { background: #2c3e50; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer; }
    .btn-link { background: none; border: none; color: #2c3e50; cursor: pointer; }
    .btn-link[disabled] { opacity: 0.5; cursor: not-allowed; }
    .inline-input { width: 90px; padding: 0.35rem 0.5rem; border: 1px solid #ddd; border-radius: 6px; }

    .pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 1rem; }
    .repair-note { margin: 0 0 1rem; padding: 0.6rem 0.8rem; background: #fff6e6; border: 1px solid #f0c36d; border-radius: 8px; color: #7a4d00; font-weight: 600; }

    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
    th { background: #f4f4f4; }
    .compact-table th, .compact-table td { padding: 8px; }

    .btn-secondary { background: #eef2f6; color: #344054; border: none; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; text-decoration: none; }
  `]
})
export class AlmacenComponent implements OnInit {
  materiales: Material[] = [];
  almacenes: Almacen[] = [];
  almacenFiltro = '';
  currentPage = 1;
  pageSize = 10;

  nuevoMaterial: Material = this.emptyMaterial();
  nuevoAlmacen: Almacen = { nombre: '', ubicacion: '', descripcion: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarAlmacenes();
    this.cargarMateriales();
  }

  get materialesFiltrados(): Material[] {
    if (!this.almacenFiltro) return this.materiales;
    return this.materiales.filter(m => m.almacen === this.almacenFiltro);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.materialesFiltrados.length / this.pageSize));
  }

  get repairCount(): number {
    return this.materialesFiltrados.reduce((acc, m) => acc + (m.stockReparacion ?? 0), 0);
  }

  get materialesPaginados(): Material[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.materialesFiltrados.slice(start, start + this.pageSize);
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  onPageSizeChange() {
    this.currentPage = 1;
  }

  prevPage() {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage() {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }

  cargarAlmacenes() {
    this.apiService.getAlmacenes().subscribe(data => {
      this.almacenes = data ?? [];
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

  private emptyMaterial(): Material {
    return {
      nombre: '',
      categoria: 'Audio',
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
}
