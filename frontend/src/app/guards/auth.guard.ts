import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { ApiService } from '../services/api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  return apiService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true; // Permite el acceso
      } else {
        // Solo redirigir al login si no está autenticado y no estamos ya en el login
        if (!state.url.includes('/login')) {
          router.navigate(['/login']);
        }
        return false;
      }
    })
  );
};
