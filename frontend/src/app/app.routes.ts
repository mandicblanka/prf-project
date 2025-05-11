import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'login/:id', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'topics', loadComponent: () => import('./topics/topics.component').then((c) => c.TopicsComponent) },
    { path: 'topic/:id', loadComponent: () => import('./topic-view/topic-view.component').then((c) => c.TopicViewComponent) },
    { path: 'my-topics', loadComponent: () => import('./my-topics/my-topics.component').then((c) => c.MyTopicsComponent), canActivate: [authGuard] },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent), canActivate: [authGuard, adminGuard] },
    { path: '**', redirectTo: 'topics' }
];
