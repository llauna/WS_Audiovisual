import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AlmacenComponent } from './almacen/almacen';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'almacen',
    component: AlmacenComponent,
    canActivate: [authGuard]
  },
  {
    path: 'eventos',
    loadComponent: () => import('./eventos/eventos').then(m => m.default),
    canActivate: [authGuard]
  },
  {
    path: 'presupuestos',
    loadComponent: () => import('./presupuestos/presupuestos').then(m => m.PresupuestosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'personal',
    loadComponent: () => import('./personal/personal').then(m => m.PersonalComponent),
    canActivate: [authGuard]
  },
  {
    path: 'nominas',
    loadComponent: () => import('./nominas/nominas').then(m => m.NominasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'mantenimiento',
    loadComponent: () => import('./mantenimiento/mantenimiento').then(m => m.MantenimientoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./configuracion/configuracion').then(m => m.ConfiguracionComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
