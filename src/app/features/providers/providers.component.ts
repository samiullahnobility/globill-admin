import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/api.service';

interface Provider {
  id: number;
  name: string;
  providerType: string;
  description?: string;
  phone?: string;
  email?: string;
  status: number;
}

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.scss'
})
export class ProvidersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  columns = ['name', 'type', 'phone', 'email', 'status', 'actions'];
  providers: Provider[] = [];
  editingId?: number;

  form = this.fb.group({
    name: ['', Validators.required],
    providerType: ['', Validators.required],
    description: [''],
    phone: [''],
    email: ['', Validators.email]
  });

  constructor(
    private readonly api: ApiService) {}

  ngOnInit() {
    this.loadProviders();
  }

  edit(provider: Provider) {
    this.editingId = provider.id;
    this.form.patchValue(provider);
  }

  cancel() {
    this.editingId = undefined;
    this.form.reset();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.form.getRawValue();
    const action = this.editingId
      ? this.api.put<void>(`/api/providers/${this.editingId}`, request)
      : this.api.post<void>('/api/providers', request);

    action.subscribe(() => {
      this.cancel();
      this.loadProviders();
    });
  }

  deactivate(provider: Provider) {
    this.api.delete<void>(`/api/providers/${provider.id}`).subscribe(() => this.loadProviders());
  }

  statusLabel(status: number) {
    return status === 1 ? 'Active' : 'Inactive';
  }

  private loadProviders() {
    this.api.get<Provider[]>('/api/providers').subscribe(providers => this.providers = providers);
  }
}
