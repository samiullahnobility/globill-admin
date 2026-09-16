import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/api.service';
import { FormFeedbackService } from '../../core/form-feedback.service';

interface Website {
  id: number;
  name: string;
}

@Component({
  selector: 'app-seo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './seo.component.html',
  styleUrl: './seo.component.scss'
})
export class SeoComponent implements OnInit {
  websites: Website[] = [];
  form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly feedback: FormFeedbackService) {
    this.form = this.fb.group({
      websiteId: [1],
      siteTitle: [''],
      siteDescription: [''],
      canonicalDomain: [''],
      metaTitle: [''],
      metaDescription: [''],
      canonicalUrl: [''],
      robotsDirective: ['index,follow'],
      socialImage: ['']
    });
  }

  ngOnInit() {
    this.api.get<Website[]>('/api/websites').subscribe(websites => {
      this.websites = websites;
      const websiteId = websites[0]?.id;
      if (websiteId) {
        this.form.patchValue({ websiteId });
        this.loadSeo();
      }
    });
  }

  loadSeo() {
    const websiteId = this.form.value.websiteId;
    if (!websiteId) {
      return;
    }

    this.api.get<Record<string, unknown>>(`/api/seo/website/${websiteId}`).subscribe(setting => {
      if (setting) {
        this.form.patchValue(setting);
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.feedback.invalid(this.form);
      return;
    }

    this.api.post('/api/seo', this.form.getRawValue()).subscribe(() => {
      this.feedback.success('SEO settings saved.');
    });
  }
}
