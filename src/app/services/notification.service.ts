import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NotificationsApi } from '../shared';
import { AuthenticationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements NotificationsApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  private baseUrl: string = environment.baseUrl;
  private controllerName = '/Notification/';
  refreshNotification = new BehaviorSubject<any>(false);
  allNotificationData: any;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllNotifications(loginUserId: number, isNeedToRefresh: boolean): Observable<any> {
    if (this.allNotificationData && !isNeedToRefresh) {
      return of(this.allNotificationData);
    } else {
      const serviceUrl = `${this.baseUrl}${this.controllerName}Notification/${loginUserId}`;
      return this.http.get<any>(serviceUrl, { headers: this.headers }).pipe(
        map(NotificationRes => {
          this.allNotificationData = NotificationRes;
          return this.allNotificationData;
        }), publishReplay(1), refCount(),
      );
    }
  }

  removeNotification(notificationId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveNotification/${notificationId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers }).pipe
      (map(removeNotificationRes => {
        return removeNotificationRes;
      })
      );
  }

  clearAllNotifications(loginUserId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveAllNotification/${loginUserId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers }).pipe(
      map(clearAllNotificationRes => {
        return clearAllNotificationRes;
      })
    );
  }

}
