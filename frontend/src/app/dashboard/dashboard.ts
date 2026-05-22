import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Bienvenido al Sistema de Gestión Audiovisual</h1>
        <p>Selecciona una área de trabajo para comenzar</p>
      </header>

      <div class="grid-menu">
        <!-- SECCIÓN ALMACÉN -->
        <div class="card card-almacen" routerLink="/almacen">
          <div class="card-icon">📦</div>
          <div class="card-info">
            <h3>Almacén</h3>
            <p>Control de stock e inventario técnico</p>
          </div>
        </div>

        <!-- SECCIÓN EVENTOS -->
        <div class="card card-eventos" routerLink="/eventos">
          <div class="card-icon">📅</div>
          <div class="card-info">
            <h3>Eventos</h3>
            <p>Planificación y montajes próximos</p>
          </div>
        </div>

        <!-- SECCIÓN PRESUPUESTOS -->
        <div class="card card-presupuestos" routerLink="/presupuestos">
          <div class="card-icon">💰</div>
          <div class="card-info">
            <h3>Presupuestos</h3>
            <p>Gestión comercial y cotizaciones</p>
          </div>
        </div>

        <!-- SECCIÓN PERSONAL -->
        <div class="card card-personal" routerLink="/personal">
          <div class="card-icon">👥</div>
          <div class="card-info">
            <h3>Personal</h3>
            <p>Técnicos, horarios y disponibilidad</p>
          </div>
        </div>

        <!-- SECCIÓN NOMINAS -->
        <div class="card card-nominas" routerLink="/nominas">
          <div class="card-icon">🧾</div>
          <div class="card-info">
            <h3>Nominas</h3>
            <p>Horas de plantilla y autofacturas</p>
          </div>
        </div>

        <!-- SECCIÓN MANTENIMIENTO -->
        <div class="card card-mantenimiento" routerLink="/mantenimiento">
          <div class="card-icon">🛠️</div>
          <div class="card-info">
            <h3>Mantenimiento</h3>
            <p>Estado de equipos y reparaciones</p>
          </div>
        </div>

        <!-- SECCIÓN CONFIGURACIÓN -->
        <div class="card card-config" routerLink="/configuracion">
          <div class="card-icon">⚙️</div>
          <div class="card-info">
            <h3>Configuración</h3>
            <p>Ajustes del sistema y usuarios</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .dashboard-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .dashboard-header h1 {
      font-size: 2.5rem;
      color: #1a2a3a;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .dashboard-header p {
      font-size: 1.1rem;
      color: #5d6d7e;
    }
    .grid-menu {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #edf2f7;
      position: relative;
      overflow: hidden;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.08);
      border-color: transparent;
    }
    .card-icon {
      font-size: 1.8rem;
      background: #f8fafc;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;
    }
    .card-info h3 {
      margin: 0;
      font-size: 0.95rem;
      color: #2d3748;
      font-weight: 600;
    }
    .card-info p {
      margin: 0.2rem 0 0;
      color: #718096;
      font-size: 0.8rem;
      line-height: 1.3;
    }

    /* Colores temáticos por tarjeta */
    .card-almacen:hover { background: linear-gradient(to right, #fff, #fffaf5); border-bottom: 4px solid #ed8936; }
    .card-eventos:hover { background: linear-gradient(to right, #fff, #f0f9ff); border-bottom: 4px solid #3182ce; }
    .card-presupuestos:hover { background: linear-gradient(to right, #fff, #f0fff4); border-bottom: 4px solid #38a169; }
    .card-personal:hover { background: linear-gradient(to right, #fff, #faf5ff); border-bottom: 4px solid #805ad5; }
    .card-nominas:hover { background: linear-gradient(to right, #fff, #f0fdf4); border-bottom: 4px solid #16a34a; }
    .card-mantenimiento:hover { background: linear-gradient(to right, #fff, #fff5f5); border-bottom: 4px solid #e53e3e; }
    .card-config:hover { background: linear-gradient(to right, #fff, #f7fafc); border-bottom: 4px solid #718096; }

    /* Media queries para pantallas más pequeñas */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem 0.5rem;
      }
      
      .dashboard-header {
        margin-bottom: 1.5rem;
      }
      
      .dashboard-header h1 {
        font-size: 2rem;
      }
      
      .dashboard-header p {
        font-size: 1rem;
      }
      
      .grid-menu {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.8rem;
        margin-bottom: 1.5rem;
      }
      
      .card {
        padding: 0.8rem;
        gap: 0.6rem;
      }
      
      .card-icon {
        width: 35px;
        height: 35px;
        font-size: 1.5rem;
      }
      
      .card-info h3 {
        font-size: 0.85rem;
      }
      
      .card-info p {
        font-size: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .dashboard-container {
        padding: 0.5rem;
      }
      
      .dashboard-header h1 {
        font-size: 1.8rem;
      }
      
      .grid-menu {
        grid-template-columns: 1fr;
        gap: 0.8rem;
      }
      
      .card {
        padding: 0.6rem;
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
      }
      
      .card-icon {
        width: 30px;
        height: 30px;
        font-size: 1.3rem;
      }
    }
  `]
})
export class Dashboard {}
