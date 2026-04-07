import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly baseUrl = '/api/auth/';

  readonly statusMessage = signal('');
  readonly submitAttempted = signal(false);
  readonly showPassword = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(4)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor() {
    const email = this.route.snapshot.queryParamMap.get('email');

    if (email) {
      this.form.controls.email.setValue(email);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((showPassword) => !showPassword);
  }

  submit(): void {
    this.submitAttempted.set(true);
    this.statusMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const resetRequest = this.form.getRawValue();

    this.http.post(this.baseUrl + 'forgot-password', resetRequest).subscribe({
      next: () => {
        this.showPassword.set(false);
        this.statusMessage.set(`Password updated for ${resetRequest.email}. The account can now sign in with the new credentials.`);
      },
      error: (error: unknown) => {
        console.error('Password reset failed:', error);
        this.statusMessage.set('The reset request failed. Check the email, code, and new password, then try again.');
      }
    });
  }
}