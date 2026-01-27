import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h2>Iniciar sesion</h2>
        <p class="muted">Acceso al sistema</p>

        <div class="form-grid">
          <label>
            Usuario o email
            <input [(ngModel)]="username" placeholder="usuario@dominio.com">
          </label>
          <label>
            Contrase\u00f1a
            <input type="password" [(ngModel)]="password" placeholder="••••••••">
          </label>
          <button class="btn-primary" (click)="login()" [disabled]="loading">Entrar</button>
        </div>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #f7fafc, #eef2f7);
    }
    .login-card {
      width: min(420px, 100%);
      background: #fff;
      padding: 2rem;
      border-radius: 14px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.08);
    }
    h2 { margin: 0 0 0.25rem; }
    .muted { color: #7a7a7a; margin: 0 0 1.5rem; }
    .form-grid { display: grid; gap: 12px; }
    label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #344054; }
    input { padding: 0.6rem 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95rem; }
    .btn-primary { background: #2c3e50; color: #fff; border: none; border-radius: 8px; padding: 0.65rem 1rem; cursor: pointer; }
    .error { color: #b00020; margin-top: 0.75rem; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private apiService: ApiService, private router: Router) {}

  login() {
    this.errorMessage = '';
    if (!this.username || !this.password) {
      this.errorMessage = 'Usuario y contrase\u00f1a son obligatorios';
      return;
    }
    this.loading = true;
    this.apiService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.password = '';
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'No se pudo iniciar sesi\u00f3n';
        this.loading = false;
      }
    });
  }
}
