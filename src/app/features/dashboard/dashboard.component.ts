import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../core/api.service';

interface Dashboard {
  totalProviders: number;
  totalWebsites: number;
  publishedWebsites: number;
  newAppointmentRequests: number;
  openAppointmentRequests: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboard?: Dashboard;

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Dashboard>('/api/dashboard').subscribe(dashboard => this.dashboard = dashboard);
  }
}
