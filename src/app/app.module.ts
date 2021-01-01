import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './containers';
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
import { AppRoutingModule } from './app.routing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { P404Component } from './shared/pages/error/404.component';
import { P500Component } from './shared/pages/error/500.component';
import { LoginComponent } from './shared/pages/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AlertMessageModule } from './shared/components/alert-message/alert-message.module';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import {
  ProjectsService, CustomersService, AdminLeavesService, HolidaysService, TimeSheetService, DesignationmasterService,
  AttendanceService, EmployeeService, DashboardService, NotificationService, OrganizationService, InvoiceService, DocumentsService
} from './services';
import {
  ProjectsApi, CustomersApi, AdminLeaveApi, HolidaysApi, TimeSheetApi,
  DesignationMasterApi, AttendanceApi, EmployeeApi, AdminDashboardApi, NotificationsApi, DepartmentApi, OrganizationApi,
  InvoiceAPi, DocumentsApi
} from './shared/api';
import { DepartmentService } from './services/department.service';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UiModalModule } from './shared/components/ui-modal/ui-modal.module';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './services/loader-interceptor.service';
import { SpinnerModule } from './shared/components/spinner/spinner.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    AlertMessageModule,
    ToastModule,
    UiModalModule,
    SpinnerModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    ChangePasswordComponent,
    NotificationListComponent,
  ],
  providers: [
    DatePipe,
    MessageService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ProjectsApi, useExisting: ProjectsService },
    { provide: CustomersApi, useExisting: CustomersService },
    { provide: AdminLeaveApi, useExisting: AdminLeavesService },
    { provide: HolidaysApi, useExisting: HolidaysService },
    { provide: TimeSheetApi, useExisting: TimeSheetService },
    { provide: DesignationMasterApi, useExisting: DesignationmasterService },
    { provide: AttendanceApi, useExisting: AttendanceService },
    { provide: EmployeeApi, useExisting: EmployeeService },
    { provide: AdminDashboardApi, useExisting: DashboardService },
    { provide: NotificationsApi, useExisting: NotificationService },
    { provide: DepartmentApi, useExisting: DepartmentService },
    { provide: OrganizationApi, useExisting: OrganizationService },
    { provide: InvoiceAPi, useExisting: InvoiceService },
    { provide: DocumentsApi, useExisting: DocumentsService },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  entryComponents: [ChangePasswordComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
