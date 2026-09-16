import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
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
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatTableModule],
  templateUrl: './appointment-leads.component.html',
  styleUrl: './appointment-leads.component.scss'
})
export class AppointmentLeadsComponent implements OnInit {
  columns = ['name', 'contact', 'preferredDate', 'status', 'createdAt', 'actions'];
  leads: AppointmentLead[] = [];
  selectedLead?: AppointmentLead;
  statuses = [
    { value: 1, label: 'New' },
    { value: 2, label: 'Contacted' },
    { value: 3, label: 'Scheduled' },
    { value: 4, label: 'Completed' },
    { value: 5, label: 'Cancelled' },
    { value: 6, label: 'Closed' }
  ];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.loadLeads();
  }

  selectLead(lead: AppointmentLead) {
    this.api.get<AppointmentLead>(`/api/appointments/${lead.id}`).subscribe(selectedLead => {
      this.selectedLead = selectedLead;
    });
  }

  updateStatus(lead: AppointmentLead, status: number) {
    this.api.put<void>(`/api/appointments/${lead.id}/status`, { status }).subscribe(() => {
      this.loadLeads();
      this.selectLead({ ...lead, status });
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
