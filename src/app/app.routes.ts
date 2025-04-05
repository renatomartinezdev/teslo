import { Routes } from '@angular/router';
import { NotAuthenticadedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import ('./auth/auth.routes'),
    //TODO: Guards
    canMatch: [
      NotAuthenticadedGuard
    ]
  },

  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  },

];
