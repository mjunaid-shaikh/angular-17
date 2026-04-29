import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    LoaderComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  private authService = inject(AuthService);
  private confirmDialog = inject(ConfirmDialogService)

  unreadCount = 0;
  private destroy$ = new Subject<void>();
  private notificationService = inject(NotificationService);

  navLinks = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', adminOnly: true },
    { label: 'Products', icon: 'inventory_2', route: '/products', adminOnly: true },
    { label: 'Orders', icon: 'shopping_cart', route: '/orders', adminOnly: false },
    { label: 'Notifications', icon: 'notifications', route: '/notifications', adminOnly: false },
    { label: 'Profile', icon: 'person', route: '/profile', adminOnly: false },
  ];

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  logout() {
    this.confirmDialog.confirm('Logout', 'Are you sure you want to logout?', 'Confirm', 'Cancel').subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
