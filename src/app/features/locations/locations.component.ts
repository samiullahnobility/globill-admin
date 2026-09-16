import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';
import { FormFeedbackService } from '../../core/form-feedback.service';

interface Provider { id: number; name: string; }
interface Location { id: number; name: string; addressLine1: string; addressLine2?: string; city: string; state: string; zipCode: string; phone?: string; email?: string; businessHours?: string; isActive: boolean; }

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTableModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  columns = ['name', 'address', 'phone', 'isActive', 'actions'];
  providers: Provider[] = [];
  locations: Location[] = [];
  selectedProviderId = 0;
  editingId?: number;

  form = this.fb.group({
    providerId: [0, Validators.required],
    name: ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
    phone: [''],
    email: [''],
    businessHours: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    isActive: [true]
  });

  constructor(
    private readonly api: ApiService,
    private readonly feedback: FormFeedbackService) {}

  ngOnInit() {
    this.api.get<Provider[]>('/api/providers').subscribe(providers => {
      this.providers = providers;
      this.selectedProviderId = providers[0]?.id ?? 0;
      this.form.patchValue({ providerId: this.selectedProviderId });
      this.loadLocations();
    });
  }

  loadLocations() {
    if (!this.selectedProviderId) return;
    this.form.patchValue({ providerId: this.selectedProviderId });
    this.api.get<Location[]>(`/api/providers/${this.selectedProviderId}/locations`).subscribe(locations => this.locations = locations);
  }

  edit(location: Location) {
    this.editingId = location.id;
    this.form.patchValue(location);
  }

  cancel() {
    this.editingId = undefined;
    this.form.reset({ providerId: this.selectedProviderId, isActive: true });
  }

  save() {
    if (this.form.invalid) {
      this.feedback.invalid(this.form);
      return;
    }
    const request = this.form.getRawValue();
    const action = this.editingId ? this.api.put<void>(`/api/locations/${this.editingId}`, request) : this.api.post<void>('/api/locations', request);
    action.subscribe(() => {
      const message = this.editingId ? 'Location updated.' : 'Location created.';
      this.cancel();
      this.loadLocations();
      this.feedback.success(message);
    });
  }

  delete(location: Location) {
    this.api.delete<void>(`/api/locations/${location.id}`).subscribe(() => {
      this.loadLocations();
      this.feedback.success('Location deleted.');
    });
  }
}
