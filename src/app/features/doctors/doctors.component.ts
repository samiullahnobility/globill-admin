import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface Doctor {
  firstName: string;
  lastName: string;
  credentials?: string;
  specialty?: string;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit {
  columns = ['name', 'credentials', 'specialty'];
  doctors: Doctor[] = [];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Doctor[]>('/api/websites/1/doctors').subscribe(doctors => {
      this.doctors = doctors;
    });
  }
}
