import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);

  readonly statusMessage = signal('');
  readonly submitAttempted = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true]
  });

  submit(): void {
    this.submitAttempted.set(true);
    this.statusMessage.set('');

    const loginRequest = {
      email: this.form.getRawValue().email,
      password: this.form.getRawValue().password,
    }

    console.log('Login request payload:', loginRequest);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    this.statusMessage.set(`Welcome back, ${this.form.getRawValue().email}. Your login flow is ready for API wiring.`);
  }
}