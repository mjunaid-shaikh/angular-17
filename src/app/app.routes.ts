import { Routes } from '@angular/router';
import { LayoutComponent } from './features/dashboard/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // 1. Auth routes — public, no layout
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
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    // 2. Protected routes — wrapped in layout
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
            }, {
                path: 'orders',
                loadComponent: () => import('./features/orders/order-form/order-form.component').then(m => m.OrderFormComponent)
            },
        ]
    },
    // fallback
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
