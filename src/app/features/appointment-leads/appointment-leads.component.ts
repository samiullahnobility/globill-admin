import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface AppointmentLead {
  id: number;
  providerId: number;
  websiteId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  serviceId?: number;
  message?: string;
  status: number;
  createdAt: string;
}

@Component({
  selector: 'app-appointment-leads',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './appointment-leads.component.html',
  styleUrl: './appointment-leads.component.scss'
})
export class AppointmentLeadsComponent implements OnInit {
  columns = ['name', 'contact', 'preferredDate', 'status', 'createdAt', 'actions'];
  leads: AppointmentLead[] = [];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.loadLeads();
  }

  markContacted(lead: AppointmentLead) {
    this.api.put<void>(`/api/appointments/${lead.id}/status`, { status: 2 }).subscribe(() => {
      this.loadLeads();
    });
  }

  statusLabel(status: number) {
    const statuses: Record<number, string> = {
      1: 'New',
      2: 'Contacted',
      3: 'Scheduled',
      4: 'Completed',
      5: 'Cancelled',
      6: 'Closed'
    };

    return statuses[status] ?? 'Unknown';
  }

  private loadLeads() {
    this.api.get<AppointmentLead[]>('/api/appointments').subscribe(leads => {
      this.leads = leads;
    });
  }
}
