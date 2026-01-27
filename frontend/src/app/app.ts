import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service'; // Asegúrate de que apunte a api.service.ts
import { Material } from './model/material';
import { RouterOutlet } from '@angular/router';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  // Variables originales para pruebas
  mensajeBackend: string = 'Probando conexión con el backend...';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    // 1. Tu prueba de conexión original
    this.probarConexion();
  }

  probarConexion() {
    this.apiService.getMateriales().subscribe({
      next: () => this.mensajeBackend = 'Conexión con el Backend: OK ✅',
      error: (error) => {
        this.mensajeBackend = 'Backend desconectado ❌ (Asegúrate de arrancar Spring Boot)';
        // No imprimimos el error completo para no ensuciar la consola si ya sabemos qué es
      }
    });
  }

  salir() {
    if (!confirm('Cerrar sesion?')) return;
    this.apiService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
