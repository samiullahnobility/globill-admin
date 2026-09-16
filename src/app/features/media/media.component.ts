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

interface Provider { id: number; name: string; }
interface Website { id: number; name: string; providerId: number; }
interface MediaItem { id: number; providerId: number; websiteId?: number; fileName: string; url: string; fileType: string; fileSize: number; altText?: string; }

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  columns = ['fileName', 'url', 'fileType', 'fileSize', 'actions'];
  providers: Provider[] = [];
  websites: Website[] = [];
  media: MediaItem[] = [];
  selectedProviderId = 0;
  editingId?: number;

  form = this.fb.group({
    providerId: [0, Validators.required],
    websiteId: [null as number | null],
    fileName: ['', Validators.required],
    url: ['', Validators.required],
    fileType: ['image/jpeg', Validators.required],
    fileSize: [0],
    altText: ['']
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Provider[]>('/api/providers').subscribe(providers => {
      this.providers = providers;
      this.selectedProviderId = providers[0]?.id ?? 0;
      this.form.patchValue({ providerId: this.selectedProviderId });
      this.loadMedia();
    });
    this.api.get<Website[]>('/api/websites').subscribe(websites => this.websites = websites);
  }

  providerWebsites() {
    return this.websites.filter(website => website.providerId === this.selectedProviderId);
  }

  loadMedia() {
    if (!this.selectedProviderId) return;
    this.form.patchValue({ providerId: this.selectedProviderId });
    this.api.get<MediaItem[]>(`/api/providers/${this.selectedProviderId}/media`).subscribe(media => this.media = media);
  }

  edit(item: MediaItem) {
    this.editingId = item.id;
    this.form.patchValue(item);
  }

  cancel() {
    this.editingId = undefined;
    this.form.reset({ providerId: this.selectedProviderId, websiteId: null, fileType: 'image/jpeg', fileSize: 0 });
  }

  save() {
    if (this.form.invalid) return;
    const request = this.form.getRawValue();
    const action = this.editingId ? this.api.put<void>(`/api/media/${this.editingId}`, request) : this.api.post<void>('/api/media', request);
    action.subscribe(() => {
      this.cancel();
      this.loadMedia();
    });
  }

  delete(item: MediaItem) {
    this.api.delete<void>(`/api/media/${item.id}`).subscribe(() => this.loadMedia());
  }
}
