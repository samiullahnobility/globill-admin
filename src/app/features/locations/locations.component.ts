import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface Location {
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
}

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent implements OnInit {
  columns = ['name', 'address', 'phone'];
  locations: Location[] = [];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Location[]>('/api/providers/1/locations').subscribe(locations => {
      this.locations = locations;
    });
  }
}
