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

interface Provider {
  id: number;
  name: string;
}

interface Website {
  id: number;
  providerId: number;
  name: string;
  domain: string;
  template?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status: number;
  isPublished: boolean;
  publishedAt?: string;
}

@Component({
  selector: 'app-websites',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTableModule],
  templateUrl: './websites.component.html',
  styleUrl: './websites.component.scss'
})
export class WebsitesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  columns = ['name', 'provider', 'domain', 'template', 'branding', 'status', 'actions'];
  providers: Provider[] = [];
  websites: Website[] = [];
  editingId?: number;

  form = this.fb.group({
    providerId: [0, Validators.required],
    name: ['', Validators.required],
    domain: ['', Validators.required],
    template: [''],
    primaryColor: ['#19c7b6'],
    secondaryColor: ['#071827']
  });

  constructor(
    private readonly api: ApiService,
    private readonly feedback: FormFeedbackService) {}

  ngOnInit() {
    this.loadProviders();
    this.loadWebsites();
  }

  providerName(providerId: number) {
    return this.providers.find(provider => provider.id === providerId)?.name ?? `Provider #${providerId}`;
  }

  edit(website: Website) {
    this.editingId = website.id;
    this.form.patchValue({
      providerId: website.providerId,
      name: website.name,
      domain: website.domain,
      template: website.template ?? '',
      primaryColor: website.primaryColor ?? '#19c7b6',
      secondaryColor: website.secondaryColor ?? '#071827'
    });
  }

  cancel() {
    this.editingId = undefined;
    this.form.reset({
      providerId: this.providers[0]?.id ?? 0,
      name: '',
      domain: '',
      template: '',
      primaryColor: '#19c7b6',
      secondaryColor: '#071827'
    });
  }

  save() {
    if (this.form.invalid) {
      this.feedback.invalid(this.form);
      return;
    }

    const request = this.form.getRawValue();
    const action = this.editingId
      ? this.api.put<void>(`/api/websites/${this.editingId}`, request)
      : this.api.post<void>('/api/websites', request);

    action.subscribe(() => {
      const message = this.editingId ? 'Website updated.' : 'Website created.';
      this.cancel();
      this.loadWebsites();
      this.feedback.success(message);
    });
  }

  publish(website: Website) {
    this.api.post<void>(`/api/websites/${website.id}/publish`, {}).subscribe(() => {
      this.loadWebsites();
      this.feedback.success('Website published.');
    });
  }

  unpublish(website: Website) {
    this.api.post<void>(`/api/websites/${website.id}/unpublish`, {}).subscribe(() => {
      this.loadWebsites();
      this.feedback.success('Website unpublished.');
    });
  }

  private loadProviders() {
    this.api.get<Provider[]>('/api/providers').subscribe(providers => {
      this.providers = providers;
      if (!this.form.value.providerId && providers.length > 0) {
        this.form.patchValue({ providerId: providers[0].id });
      }
    });
  }

  private loadWebsites() {
    this.api.get<Website[]>('/api/websites').subscribe(websites => this.websites = websites);
  }
}
