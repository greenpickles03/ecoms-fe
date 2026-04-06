import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPage {
  private readonly formBuilder = inject(FormBuilder);

  readonly statusMessage = signal('');
  readonly submitAttempted = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    agree: [false, [Validators.requiredTrue]]
  });

  submit(): void {
    this.submitAttempted.set(true);
    this.statusMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.statusMessage.set(`Account shell created for ${this.form.getRawValue().company}. Connect the signup endpoint to complete onboarding.`);
  }
}