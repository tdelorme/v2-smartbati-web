import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {DevisComponent} from "./devis/devis.component";
import {FactureComponent} from "./facture/facture.component";
import {EditComponent} from "./edit/edit.component";
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'devis', component: DevisComponent, canActivate: [AuthGuard] },
  { path: 'facture', component: FactureComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: EditComponent, canActivate: [AuthGuard] },
];
