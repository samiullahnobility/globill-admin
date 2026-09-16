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
interface Page { id: number; title: string; slug: string; content?: string; metaTitle?: string; metaDescription?: string; canonicalUrl?: string; status: string; displayOrder: number; }

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  columns = ['title', 'slug', 'status', 'displayOrder', 'actions'];
  websites: Website[] = [];
  pages: Page[] = [];
  selectedWebsiteId = 0;
  editingId?: number;

  form = this.fb.group({
    websiteId: [0, Validators.required],
    title: ['', Validators.required],
    slug: ['', Validators.required],
    content: [''],
    metaTitle: [''],
    metaDescription: [''],
    canonicalUrl: [''],
    status: ['Draft'],
    displayOrder: [0]
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<Website[]>('/api/websites').subscribe(websites => {
      this.websites = websites;
      this.selectedWebsiteId = websites[0]?.id ?? 0;
      this.form.patchValue({ websiteId: this.selectedWebsiteId });
      this.loadPages();
    });
  }

  loadPages() {
    if (!this.selectedWebsiteId) return;
    this.form.patchValue({ websiteId: this.selectedWebsiteId });
    this.api.get<Page[]>(`/api/websites/${this.selectedWebsiteId}/pages`).subscribe(pages => this.pages = pages);
  }

  edit(page: Page) {
    this.editingId = page.id;
    this.form.patchValue(page);
  }

  cancel() {
    this.editingId = undefined;
    this.form.reset({ websiteId: this.selectedWebsiteId, status: 'Draft', displayOrder: 0 });
  }

  save() {
    if (this.form.invalid) return;
    const request = this.form.getRawValue();
    const action = this.editingId ? this.api.put<void>(`/api/pages/${this.editingId}`, request) : this.api.post<void>('/api/pages', request);
    action.subscribe(() => {
      this.cancel();
      this.loadPages();
    });
  }

  delete(page: Page) {
    this.api.delete<void>(`/api/pages/${page.id}`).subscribe(() => this.loadPages());
  }
}
