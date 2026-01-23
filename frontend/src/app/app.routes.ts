import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AlmacenComponent } from './almacen/almacen';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'almacen', component: AlmacenComponent },
  {
    path: 'eventos',
    loadComponent: () => import('./eventos/eventos').then(m => m.EventosComponent)
  },
  { path: 'presupuestos', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'personal',
  loadComponent: () => import('./personal/personal').then(m => m.PersonalComponent) },
  { path: 'mantenimiento', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'configuracion', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
  { path: '**', redirectTo: '' }
];
