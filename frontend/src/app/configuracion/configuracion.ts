import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, UsuarioSummary, UsuarioRequest } from '../services/api.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <header class="section-header">
        <div>
          <h2>Configuracion</h2>
          <p class="muted">Ajustes del sistema y usuarios</p>
        </div>
        <a class="btn-secondary" routerLink="/">Inicio</a>
      </header>

      <div class="card">
        <div class="section-header compact">
          <div>
            <h3>Usuarios</h3>
            <p class="muted">Listado de usuarios en la base de datos</p>
          </div>
        </div>

        <div class="form-grid user-form">
          <label>
            Usuario
            <input [(ngModel)]="nuevoUsuario.username" placeholder="usuario">
          </label>
          <label>
            Email
            <input [(ngModel)]="nuevoUsuario.email" placeholder="usuario@dominio.com">
          </label>
          <label>
            Contraseña
            <input type="password" [(ngModel)]="nuevoUsuario.password" placeholder="••••••••">
          </label>
          <label>
            Rol
            <select [(ngModel)]="nuevoUsuario.role">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button class="btn-primary" (click)="crearUsuario()">Crear usuario</button>
        </div>

        <table class="modern-table" *ngIf="usuarios.length; else noUsuarios">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Nueva contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of usuarios">
              <td><input [(ngModel)]="u.username" placeholder="usuario"></td>
              <td><input [(ngModel)]="u.email" placeholder="email"></td>
              <td>
                <select [(ngModel)]="u.role">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td><input type="password" [(ngModel)]="u.password" placeholder="opcional"></td>
              <td>
                <button class="btn-link" (click)="guardarUsuario(u)">Guardar</button>
                <button class="btn-link danger" (click)="borrarUsuario(u)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noUsuarios>
          <p class="muted">No hay usuarios registrados.</p>
        </ng-template>
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
    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { text-align: left; padding: 0.75rem; background: #f8f9fa; color: #666; font-weight: 600; }
    .modern-table td { padding: 0.75rem; border-bottom: 1px solid #eee; }
    .form-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; align-items: end; margin-bottom: 1rem; }
    .btn-primary { background: #2c3e50; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1rem; cursor: pointer; }
    .btn-link { background: none; border: none; color: #2c3e50; cursor: pointer; margin-right: 8px; }
    .btn-link.danger { color: #c0392b; }
    input, select { padding: 0.5rem 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; width: 100%; }
    @media (max-width: 720px) {
      .modern-table th, .modern-table td { padding: 0.6rem; }
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ConfiguracionComponent implements OnInit {
  usuarios: UsuarioSummary[] = [];
  nuevoUsuario: UsuarioRequest = this.resetUsuario();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.apiService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data ?? [],
      error: () => this.usuarios = []
    });
  }

  crearUsuario() {
    if (!this.nuevoUsuario.username && !this.nuevoUsuario.email) {
      alert('Usuario o email es obligatorio');
      return;
    }
    if (!this.nuevoUsuario.password) {
      alert('La contraseña es obligatoria');
      return;
    }
    this.apiService.saveUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.nuevoUsuario = this.resetUsuario();
        this.cargarUsuarios();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo crear el usuario')
    });
  }

  guardarUsuario(usuario: UsuarioSummary) {
    if (!usuario.id) return;
    this.apiService.updateUsuario(usuario.id, {
      username: usuario.username,
      email: usuario.email,
      role: usuario.role,
      password: (usuario as any).password
    }).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar el usuario')
    });
  }

  borrarUsuario(usuario: UsuarioSummary) {
    if (!usuario.id) return;
    if (!confirm('Eliminar usuario?')) return;
    this.apiService.deleteUsuario(usuario.id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => alert(err?.error?.message || 'No se pudo eliminar el usuario')
    });
  }

  private resetUsuario(): UsuarioRequest {
    return {
      username: '',
      email: '',
      password: '',
      role: 'USER'
    };
  }
}
