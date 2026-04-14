import { Routes } from '@angular/router';
import { LayoutComponent } from './features/dashboard/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent)  // ← list page
            },
            {
                path: 'orders/create',
                loadComponent: () => import('./features/orders/order-form/order-form.component').then(m => m.OrderFormComponent)  // ← create page
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
            },
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];