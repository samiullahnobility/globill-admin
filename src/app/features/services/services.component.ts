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

interface Website { id: number; name: string; }
interface Service { id: number; name: string; slug: string; shortDescription?: string; description?: string; metaTitle?: string; metaDescription?: string; displayOrder: number; isActive: boolean; }

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTableModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  columns = ['name', 'slug', 'shortDescription', 'isActive', 'actions'];
  websites: Website[] = [];
  services: Service[] = [];
  selectedWebsiteId = 0;
  editingId?: number;

  form = this.fb.group({
    websiteId: [0, Validators.required],
    name: ['', Validators.required],
    slug: ['', Validators.required],
    shortDescription: [''],
    description: [''],
    imageMediaId: [null as number | null],
    metaTitle: [''],
    metaDescription: [''],
    displayOrder: [0],
    isActive: [true]
  });

  constructor(
    private readonly api: ApiService,
    private readonly feedback: FormFeedbackService) {}

  ngOnInit() {
    this.api.get<Website[]>('/api/websites').subscribe(websites => {
      this.websites = websites;
      this.selectedWebsiteId = websites[0]?.id ?? 0;
      this.form.patchValue({ websiteId: this.selectedWebsiteId });
      this.loadServices();
    });
  }

  loadServices() {
    if (!this.selectedWebsiteId) return;
    this.form.patchValue({ websiteId: this.selectedWebsiteId });
    this.api.get<Service[]>(`/api/websites/${this.selectedWebsiteId}/services`).subscribe(services => this.services = services);
  }

  edit(service: Service) {
    this.editingId = service.id;
    this.form.patchValue(service);
  }

  cancel() {
    this.editingId = undefined;
    this.form.reset({ websiteId: this.selectedWebsiteId, displayOrder: 0, isActive: true });
  }

  save() {
    if (this.form.invalid) {
      this.feedback.invalid(this.form);
      return;
    }
    const request = this.form.getRawValue();
    const action = this.editingId ? this.api.put<void>(`/api/services/${this.editingId}`, request) : this.api.post<void>('/api/services', request);
    action.subscribe(() => {
      const message = this.editingId ? 'Service updated.' : 'Service created.';
      this.cancel();
      this.loadServices();
      this.feedback.success(message);
    });
  }

  delete(service: Service) {
    this.api.delete<void>(`/api/services/${service.id}`).subscribe(() => {
      this.loadServices();
      this.feedback.success('Service deleted.');
    });
  }
}
