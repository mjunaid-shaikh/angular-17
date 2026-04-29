export interface AppNotification {
    id: number;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isRead: boolean;
    createdAt: Date;
}