import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login'
	},
	{
		path: 'login',
		title: 'Login',
		loadComponent: () => import('./features/auth/pages/login-page').then((module) => module.LoginPage)
	},
	{
		path: 'signup',
		title: 'Sign Up',
		loadComponent: () => import('./features/auth/pages/signup-page').then((module) => module.SignupPage)
	},
	{
		path: 'send-otp',
		title: 'Send OTP',
		loadComponent: () => import('./features/auth/pages/send-otp-page').then((module) => module.SendOtpPage)
	},
	{
		path: 'forgot-password',
		title: 'Forgot Password',
		loadComponent: () => import('./features/auth/pages/forgot-password-page').then((module) => module.ForgotPasswordPage)
	},
	{
		path: '**',
		redirectTo: 'login'
	}
];
