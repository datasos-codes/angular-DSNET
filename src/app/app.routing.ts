import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './shared/pages/error/404.component';
import { P500Component } from './shared/pages/error/500.component';
import { LoginComponent } from './shared/pages/login/login.component';
import { AuthGuard } from './helpers/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'employees',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/employees/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'attendances',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/attendance/attendance.module').then(m => m.AttendanceModule),
      },
      {
        path: 'leaves',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/leaves/leaves.module').then(m => m.LeavesModule),
      },
      {
        path: 'timesheets',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/timesheet/timesheet.module').then(m => m.TimeSheetModule),
      },
      {
        path: 'customers',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/customers/customers.module').then(m => m.CustomersModule),
      },
      {
        path: 'holidays',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/holidays/holidays.module').then(m => m.HolidaysModule),
      },
      {
        path: 'designations',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/designations/designations.module').then(m => m.DesignationsModule),
      },
      {
        path: 'projects',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/projects/projects.module').then(m => m.ProjectsModule),
      },
      {
        path: 'permissions',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/permissions/permissions.module').then(m => m.PermissionsModule),
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/user-profile/userprofile.module').then(m => m.UserProfileModule),
      },
      {
        path: 'invoices',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/invoice/invoice.module').then(m => m.InvoiceModule),
      },
      {
        path: 'documents',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/documents/documents.module').then(m => m.DocumentsModule),
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
