import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface Service {
  name: string;
  slug: string;
  shortDescription?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  columns = ['name', 'slug', 'shortDescription', 'isActive'];
  services: Service[] = [];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Service[]>('/api/websites/1/services').subscribe(services => {
      this.services = services;
    });
  }
}
