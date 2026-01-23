import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Material } from '../model/material';

@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="almacen-container">
      <h2>📦 Gestión de Almacén</h2>

      <!-- Formulario para añadir material -->
      <div class="form-card">
        <input [(ngModel)]="nuevoMaterial.nombre" placeholder="Nombre del equipo">
        <select [(ngModel)]="nuevoMaterial.categoria">
          <option value="Audio">Audio</option>
          <option value="Vídeo">Vídeo</option>
          <option value="Iluminación">Iluminación</option>
        </select>
        <button (click)="agregarMaterial()">Añadir al Stock</button>
      </div>

      <!-- Tabla de materiales -->
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let m of materiales">
            <td>{{m.nombre}}</td>
            <td>{{m.categoria}}</td>
            <td>{{m.stockDisponible}} / {{m.stockTotal}}</td>
            <td>{{m.ubicacionAlmacen}}</td>
            <td><button (click)="borrarMaterial(m.id)">Eliminar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .almacen-container { padding: 20px; }
    .form-card { margin-bottom: 20px; display: flex; gap: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
    th { background: #f4f4f4; }
  `]
})
export class AlmacenComponent implements OnInit {
  materiales: Material[] = [];
  nuevoMaterial: Material = { nombre: '', categoria: 'Audio', stockTotal: 0, stockDisponible: 0, ubicacionAlmacen: '', estado: 'Operativo' };

  constructor(private apiService: ApiService) {}

  ngOnInit() { this.cargarMateriales(); }

  cargarMateriales() {
    this.apiService.getMateriales().subscribe(data => this.materiales = data);
  }

  agregarMaterial() {
    this.apiService.saveMaterial(this.nuevoMaterial).subscribe(() => {
      this.cargarMateriales();
      this.nuevoMaterial = { nombre: '', categoria: 'Audio', stockTotal: 0, stockDisponible: 0, ubicacionAlmacen: '', estado: 'Operativo' };
    });
  }

  borrarMaterial(id?: string) {
    if (id && confirm('¿Eliminar equipo?')) {
      this.apiService.deleteMaterial(id).subscribe(() => this.cargarMateriales());
    }
  }
}
