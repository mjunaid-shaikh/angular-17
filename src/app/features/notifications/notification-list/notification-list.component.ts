import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification } from '../../../core/models/notification';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    FormsModule,          // ← for [(ngModel)] in add form
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule      // ← for matTooltip
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent implements OnInit, OnDestroy {

  notifications: AppNotification[] = [];
  recentNotifications: AppNotification[] = [];
  unreadCount: number = 0;

  // for add form
  newTitle: string = '';
  newMessage: string = '';
  newType: AppNotification['type'] = 'info';

  // Subject to handle unsubscription — prevents memory leaks
  private destroy$ = new Subject<void>();

  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    // subscribe to BehaviorSubject — all notifications
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))  // ← auto unsubscribe on destroy
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    // subscribe to ReplaySubject — recent 5 notifications
    this.notificationService.recent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        // ReplaySubject emits one by one — collect into array
        if (!this.recentNotifications.find(n => n.id === notification.id)) {
          this.recentNotifications = [notification, ...this.recentNotifications].slice(0, 5);
        }
      });

    // subscribe to unread count BehaviorSubject
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  // cleanup subscriptions on component destroy
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNotification(): void {
    if (!this.newTitle.trim() || !this.newMessage.trim()) return;
    this.notificationService.addNotification(this.newTitle, this.newMessage, this.newType);
    // reset form
    this.newTitle = '';
    this.newMessage = '';
    this.newType = 'info';
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id);
  }

  clearAll(): void {
    this.notificationService.clearAll();
    this.recentNotifications = [];
  }

  getIcon(type: AppNotification['type']): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type];
  }
}