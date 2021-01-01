import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';
import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../services';
import { DesignationMasterRequest } from '../../../models/designationmasterrequest';
import { DesignationMasterApi, OrganizationApi } from '../../../shared/api';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-designations-list',
  templateUrl: './designations-list.component.html',
  styleUrls: ['./designations-list.component.css']
})
export class DesignationsListComponent implements OnInit {
  @ViewChild('designationtable') designationtable: Table;

  designationData: any = [];
  allDesignationNames: any;
  selectedDesignationForCheckBox: DesignationMasterRequest[];
  deleteMultipleParams: any;
  clickDelete: boolean = true;
  designationModulePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  designationListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private designationMasterApi: DesignationMasterApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.getAllDesignationsList();
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.designationModulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.DESIGNATIONS_SCREEN)[0];
        if (this.designationModulePermission && this.designationModulePermission !== undefined) {
          this.designationModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getAllDesignationsList() {
    this.designationMasterApi.getAllEmployeeDesignation().pipe(first()).subscribe(designationRes => {
      if (designationRes && designationRes['flag'] === 1) {
        this.designationData = designationRes['data'];
        this.allDesignationNames = this.designationData.map(d => d.designation);
      }
    }, error => {
      console.log(error);
    });
  }

  exportExcelDesignations(designationArgs: any) {
    if (designationArgs && designationArgs.length > 0) {
      const designationIds = designationArgs.map((designationId: { id: any; }) => designationId.id);
      this.designationMasterApi.exportToExcelDesignation(designationIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Designations';
        link.click();
        this.selectedDesignationForCheckBox = [];
      }, error => {
        console.log(error);
      });
    } else {
      this.messageService.add({ key: 'commonMsg', severity: 'warn', summary: 'Warn Message', detail: 'There are unselected checkboxes.' });
    }
  }

  showConfirmForDeleteDesignations(deleteDesignationData: any) {
    if (deleteDesignationData && deleteDesignationData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteDesignationKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteDesignationData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteDesigantionDetails(designationData: any) {
    this.messageService.clear('deleteDesignationKey');
    if (designationData && designationData.length > 0) {
      this.deleteMultipleDesignations(designationData);
    } else if (designationData && designationData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSignleDesignation(designationData, loggedInUserId);
    }
  }

  private deleteMultipleDesignations(designationDataForDelete: any) {
    const designationIds = designationDataForDelete.map((designationId: { id: any; }) => designationId.id);
    this.deleteMultipleParams = { Ids: designationIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.designationMasterApi.deletedSelectedIds(this.deleteMultipleParams).pipe(first()).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedDesignationForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.getAllDesignationsList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: res['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSignleDesignation(designationData: any, loggedInUserId: number) {
    this.designationMasterApi.deleteDesignationById(designationData, loggedInUserId).pipe(first()).subscribe(deleteDesignationRes => {
      if (deleteDesignationRes && deleteDesignationRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteDesignationRes['message']
        });
        this.getAllDesignationsList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteDesignationRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedDesignationForCheckBox && this.selectedDesignationForCheckBox.length > 0) {
      this.selectedDesignationForCheckBox = [];
    }
    this.messageService.clear('deleteDesignationKey');
  }

  showDesignationDialog(designationObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = designationObj === undefined ? 'Add Designation' : 'Edit Designation';
    this.designationListObj = designationObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getAllDesignationsList();
    }
  }
}
