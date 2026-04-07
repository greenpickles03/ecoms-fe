import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth/';

  readonly statusMessage = signal('');
  readonly submitAttempted = signal(false);
  readonly showPassword = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true]
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

    const loginRequest = {
      email: this.form.getRawValue().email,
      password: this.form.getRawValue().password,
    };

    this.http.post(this.baseUrl + 'login', loginRequest).subscribe({
      next: (response:any) => {
        console.log('Login successful:', response.token);
        localStorage.setItem('authToken', response.token);
        this.showPassword.set(false);
        this.statusMessage.set(`Welcome back, ${this.form.getRawValue().email}. Your login flow is ready for API wiring.`);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.statusMessage.set('Login failed. Please check your credentials and try again.');
      }
    });
  }
}