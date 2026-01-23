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
  { path: 'presupuestos', loadComponent: () => import('./presupuestos/presupuestos').then(m => m.PresupuestosComponent) },
  { path: 'personal',
  loadComponent: () => import('./personal/personal').then(m => m.PersonalComponent) },
  { path: 'mantenimiento', loadComponent: () => import('./mantenimiento/mantenimiento').then(m => m.MantenimientoComponent) },
  { path: 'configuracion', loadComponent: () => import('./configuracion/configuracion').then(m => m.ConfiguracionComponent) },
  { path: '**', redirectTo: '' }
];
