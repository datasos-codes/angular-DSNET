import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService, AuthenticationService, AlertMessageService } from '../../services';
import { first } from 'rxjs/operators';
import { NotificationsApi } from '../../shared/api';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  @Input() notificationArr: any = [];
  @Input() NotificationCount = 0;
  nCount: number;
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  isAdminOrNOt: boolean;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private notificationsApi: NotificationsApi,
    private authenticationService: AuthenticationService,
    private alertMessageService: AlertMessageService
  ) { }

  ngOnInit() {
  }

  navigateOnHolidayDetails(notificationId, e) {
    this.notificationsApi.removeNotification(notificationId).pipe(first()).subscribe(employeeAddressResponse => {
      if (employeeAddressResponse && (employeeAddressResponse['flag'] === 1)) {
        this.notificationService.refreshNotification.next(true);
      }
    });
    e.preventDefault();
    this.router.navigate(['/holidays']);
  }

  navigateOnLeaveDetails(notificationId, e) {
    this.notificationsApi.removeNotification(notificationId).pipe(first()).subscribe(employeeAddressResponse => {
      if (employeeAddressResponse && (employeeAddressResponse['flag'] === 1)) {
        this.notificationService.refreshNotification.next(true);
      }
    });
    e.preventDefault();
    this.router.navigate(['/leaves']);
  }

  clearAllNotifications() {
    if (this.notificationArr && this.notificationArr.length > 0) {
      const loginUserId = this.authenticationService.IsUserId();
      this.notificationsApi.clearAllNotifications(loginUserId).pipe(first()).subscribe(clearAllNotificationRes => {
        if (clearAllNotificationRes && (clearAllNotificationRes['flag'] === 1)) {
          this.notificationService.refreshNotification.next(true);
          this.alertMessageService.success(clearAllNotificationRes['message'], this.options);
        } else {
          this.alertMessageService.error(clearAllNotificationRes['message'], this.options);
        }
      });
    }
  }

}
