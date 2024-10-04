import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {DevisComponent} from "./devis/devis.component";
import {FactureComponent} from "./facture/facture.component";
import {EditComponent} from "./edit/edit.component";
import { AuthGuard } from './shared/auth.guard';
import { ClientComponent } from './client/client.component';
import { ClientCreateComponent } from './client/client-create/client-create.component';
import { ClientAllComponent } from './client/client-all/client-all.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'devis', component: DevisComponent, canActivate: [AuthGuard] },
  { path: 'facture', component: FactureComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'client', component: ClientComponent, canActivate: [AuthGuard]},
  { path: 'client/add', component: ClientCreateComponent, canActivate: [AuthGuard]},
  { path: 'client/all', component: ClientAllComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]}
];
