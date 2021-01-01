import { Observable } from 'rxjs';

export abstract class NotificationsApi {
    abstract getAllNotifications(loginUserId: number, isNeedToRefresh: boolean): Observable<any>;
    abstract removeNotification(notificationId: number): Observable<any>;
    abstract clearAllNotifications(loginUserId: number): Observable<any>;
}
