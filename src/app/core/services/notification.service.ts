import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { AppNotification } from "../models/notification";

@Injectable({
    providedIn: 'root'
})

export class NotificationService {

    // BehaviorSubject — holds current list of all notifications
    // new subscribers immediately get current value
    private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
    notifications$ = this.notificationsSubject.asObservable();

    // ReplaySubject — replays last 5 notifications to new subscribers
    // useful for showing recent activity
    private recentSubject = new ReplaySubject<AppNotification>(5);
    recent$ = this.recentSubject.asObservable();

    // auto increment id
    private nextId = 1;

    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor() {
        // seed some initial notifications
        this.addNotification('Welcome!', 'Welcome to MJSuite dashboard', 'success');
        this.addNotification('New Order', 'A new order has been placed', 'info');
        this.addNotification('Low Stock', 'Product stock is running low', 'warning');
        this.addNotification('Login Alert', 'New login detected', 'error');
    }


    addNotification(title: string, message: string, type: AppNotification['type']): void {
        const notification: AppNotification = {
            id: this.nextId++,
            title,
            message,
            type,
            isRead: false,
            createdAt: new Date()
        }

        // update BehaviorSubject — add to beginning of list
        const current = this.notificationsSubject.getValue();
        this.notificationsSubject.next([notification, ...current]);

        // push to replay subject
        this.recentSubject.next(notification)

        // update unread count
        this.updateUnreadCount();
    }

    //MARK as read
    markAsRead(id: number): void {
        const updated = this.notificationsSubject.getValue().map((n) => n.id === id ? { ...n, isRead: true } : n);
        this.notificationsSubject.next(updated);
        this.updateUnreadCount();
    }

    // MARK all as read
    markAllAsRead(): void {
        const updated = this.notificationsSubject.getValue().map(n => ({ ...n, isRead: true }))
        this.notificationsSubject.next(updated);
        this.updateUnreadCount();

    }

    // DELETE notification
    deleteNotification(id: number): void {
        const updated = this.notificationsSubject.getValue().filter(n => n.id !== id);
        this.notificationsSubject.next(updated);
        this.updateUnreadCount();
    }

    // CLEAR all
    clearAll(): void {
        this.notificationsSubject.next([]);
        this.updateUnreadCount();
    }

    // update unread count
    private updateUnreadCount(): void {
        const count = this.notificationsSubject.getValue().filter(n => !n.isRead).length;
        this.unreadCountSubject.next(count);
    }
}