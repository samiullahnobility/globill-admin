import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface AuditLog {
  action: string;
  entityType: string;
  entityId?: number;
  description?: string;
  createdAt: string;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss'
})
export class AuditComponent implements OnInit {
  columns = ['action', 'entityType', 'entityId', 'description', 'createdAt'];
  logs: AuditLog[] = [];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<AuditLog[]>('/api/audit').subscribe(logs => {
      this.logs = logs;
    });
  }
}
