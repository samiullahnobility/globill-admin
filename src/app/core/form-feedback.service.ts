import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class FormFeedbackService {
  private readonly snackBar = inject(MatSnackBar);

  invalid(form: FormGroup, message = 'Please fix the highlighted fields.') {
    form.markAllAsTouched();
    this.error(message);
  }

  success(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3200,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-toast', 'app-toast-success']
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4200,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-toast', 'app-toast-error']
    });
  }
}
