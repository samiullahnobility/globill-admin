import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/api.service';
import { FormFeedbackService } from '../../core/form-feedback.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly router: Router,
    private readonly feedback: FormFeedbackService) {
    this.form = this.fb.group({
      email: ['admin@globill.local', [Validators.required, Validators.email]],
      password: ['ChangeMe123!', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.feedback.invalid(this.form, 'Enter a valid email and password.');
      return;
    }

    this.api.post<{ token: string }>('/api/auth/login', this.form.getRawValue()).subscribe({
      next: response => {
        localStorage.setItem('globill_token', response.token);
        this.feedback.success('Signed in successfully.');
        this.router.navigateByUrl('/dashboard');
      },
      error: () => this.feedback.error('Login failed. Check your credentials.')
    });
  }
}
