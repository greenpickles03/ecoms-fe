import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-send-otp-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './send-otp-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendOtpPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = '/api/users/';

  readonly statusMessage = signal('');
  readonly submitAttempted = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit(): void {
    this.submitAttempted.set(true);
    this.statusMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const emailRequest = {
        email: this.form.getRawValue().email
    }
    console.log(emailRequest);
    this.http.post(this.baseUrl + 'generate-code', { emailRequest }).subscribe({
      next: (res:any) => {
        console.log(res);
        if(res.success) {

        }
        // void this.router.navigate(['/forgot-password'], {
        //   queryParams: { email: emailRequest.email }
        // });
      },
      error: (error: unknown) => {
        console.error('Send OTP failed:', error);
        this.statusMessage.set('We could not send the verification code. Check the email and try again.');
      }
    });
  }
}