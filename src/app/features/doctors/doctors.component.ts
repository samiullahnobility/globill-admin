import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface Website { id: number; name: string; }
interface Doctor { id: number; firstName: string; lastName: string; credentials?: string; specialty?: string; biography?: string; displayOrder: number; isActive: boolean; }

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  columns = ['name', 'credentials', 'specialty', 'isActive', 'actions'];
  websites: Website[] = [];
  doctors: Doctor[] = [];
  selectedWebsiteId = 0;
  editingId?: number;

  form = this.fb.group({
    websiteId: [0, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    credentials: [''],
    specialty: [''],
    biography: [''],
    photoMediaId: [null as number | null],
    displayOrder: [0],
    isActive: [true]
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Website[]>('/api/websites').subscribe(websites => {
      this.websites = websites;
      this.selectedWebsiteId = websites[0]?.id ?? 0;
      this.form.patchValue({ websiteId: this.selectedWebsiteId });
      this.loadDoctors();
    });
  }

  loadDoctors() {
    if (!this.selectedWebsiteId) return;
    this.form.patchValue({ websiteId: this.selectedWebsiteId });
    this.api.get<Doctor[]>(`/api/websites/${this.selectedWebsiteId}/doctors`).subscribe(doctors => this.doctors = doctors);
  }

  edit(doctor: Doctor) {
    this.editingId = doctor.id;
    this.form.patchValue(doctor);
  }

  cancel() {
    this.editingId = undefined;
    this.form.reset({ websiteId: this.selectedWebsiteId, displayOrder: 0, isActive: true });
  }

  save() {
    if (this.form.invalid) return;
    const request = this.form.getRawValue();
    const action = this.editingId ? this.api.put<void>(`/api/doctors/${this.editingId}`, request) : this.api.post<void>('/api/doctors', request);
    action.subscribe(() => {
      this.cancel();
      this.loadDoctors();
    });
  }

  delete(doctor: Doctor) {
    this.api.delete<void>(`/api/doctors/${doctor.id}`).subscribe(() => this.loadDoctors());
  }
}
