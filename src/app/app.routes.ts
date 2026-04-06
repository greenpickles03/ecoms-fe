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
		path: '**',
		redirectTo: 'login'
	}
];
