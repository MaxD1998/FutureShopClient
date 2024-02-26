import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const authRoutes: Routes = [
  {
    path: ClientRoute.login,
    component: LoginComponent,
  },
  {
    path: ClientRoute.register,
    component: RegisterComponent,
  },
];
