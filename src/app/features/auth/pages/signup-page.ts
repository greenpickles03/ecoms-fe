import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/users/';

  readonly statusMessage = signal('');
  readonly submitAttempted = signal(false);
  readonly showPassword = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    agree: [false, [Validators.requiredTrue]]
  });

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

    const registrationRequest = {
      name: this.form.getRawValue().fullName,
      email: this.form.getRawValue().email,
      password: this.form.getRawValue().password
    };

    console.log('Submitting registration:', registrationRequest);
    this.http.post(this.baseUrl + 'register', registrationRequest).subscribe({
      next: (response: unknown) => {
        console.log('Signup successful:', response);
        this.form.reset({
          fullName: '',
          email: '',
          password: '',
          agree: false
        });
        this.showPassword.set(false);
        this.submitAttempted.set(false);
        this.statusMessage.set(`Account created for ${registrationRequest.name}. Connect the signup endpoint to complete onboarding.`);
      },
      error: (error) => {
        console.error('Signup failed:', error);
        this.statusMessage.set('Signup failed. Please check your details and try again.');
      }
    });

  }
}