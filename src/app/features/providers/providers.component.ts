import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface Provider {
  name: string;
  providerType: string;
  phone?: string;
  email?: string;
}

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.scss'
})
export class ProvidersComponent implements OnInit {
  columns = ['name', 'type', 'phone', 'email'];
  providers: Provider[] = [];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Provider[]>('/api/providers').subscribe(providers => this.providers = providers);
  }
}
