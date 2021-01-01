import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SpinnerService } from '../../services/spinner.service';
import { OrganizationApi } from '../../shared/api/organizationapi';
import { first } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  @ViewChild('testTable') testTable: Table;
  @ViewChild('editPermissionModal') public editPermissionModalDialog: ModalDirective;

  permissionsData: any;
  RolesList: any = [];
  isNeedToRenderUIModal = false;
  displayHeader: string;
  permissionListObj: any;

  constructor(
    private spinnerService: SpinnerService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.spinnerService.showSpinner();
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
    promise.then(() => {
      this.getAllUserRoles();
      this.spinnerService.hideSpinner();
    });
  }

  getAllUserRoles(): void {
    this.spinnerService.showSpinner();
    this.organizationApi.getUserRoles().pipe(first()).subscribe(userRolesRes => {
      if (userRolesRes && (userRolesRes['flag'] === 1)) {
        this.permissionsData = userRolesRes['data'];
        this.spinnerService.hideSpinner();
      }
    }, error => {
      this.spinnerService.hideSpinner();
      console.log(error);
    });
  }

  openAddEditDialog(permissionObj: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = 'Edit Permission';
    this.permissionListObj = permissionObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
  }
}
