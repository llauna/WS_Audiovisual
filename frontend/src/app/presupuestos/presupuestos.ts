import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <header class="section-header">
        <div>
          <h2>Presupuestos</h2>
          <p class="muted">Gestion comercial y cotizaciones</p>
        </div>
        <a class="btn-secondary" routerLink="/">Inicio</a>
      </header>

      <div class="card">
        <p>Seccion en construccion.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }
    .card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .btn-secondary { background: #eef2f6; color: #344054; border: none; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; text-decoration: none; }
  `]
})
export class PresupuestosComponent {}
