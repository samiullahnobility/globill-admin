import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-seo',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './seo.component.html',
  styleUrl: './seo.component.scss'
})
export class SeoComponent {
  form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService) {
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

  save() {
    this.api.post('/api/seo', this.form.getRawValue()).subscribe();
  }
}
