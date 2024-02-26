import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientRoute } from './core/constants/client-routes/client.route';
import { unauthGuard } from './core/guards/unauth.guard';

export const routes: Routes = [
  {
    path: ClientRoute.login,
    component: LoginComponent,
    canActivate: [unauthGuard],
  },
  {
    path: ClientRoute.register,
    component: RegisterComponent,
    canActivate: [unauthGuard],
  },
];
