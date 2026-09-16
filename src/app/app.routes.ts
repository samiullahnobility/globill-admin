import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DoctorsComponent } from './features/doctors/doctors.component';
import { LoginComponent } from './features/login/login.component';
import { LocationsComponent } from './features/locations/locations.component';
import { PagesComponent } from './features/pages/pages.component';
import { ProvidersComponent } from './features/providers/providers.component';
import { AuditComponent } from './features/audit/audit.component';
import { SeoComponent } from './features/seo/seo.component';
import { AppointmentLeadsComponent } from './features/appointment-leads/appointment-leads.component';
import { MediaComponent } from './features/media/media.component';
import { ServicesComponent } from './features/services/services.component';
import { WebsitesComponent } from './features/websites/websites.component';
import { authGuard, loginGuard } from './core/auth.guard';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'providers', component: ProvidersComponent },
      { path: 'pages', component: PagesComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'doctors', component: DoctorsComponent },
      { path: 'locations', component: LocationsComponent },
      { path: 'media', component: MediaComponent },
      { path: 'appointment-leads', component: AppointmentLeadsComponent },
      { path: 'seo', component: SeoComponent },
      { path: 'audit', component: AuditComponent },
      { path: 'websites', component: WebsitesComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
