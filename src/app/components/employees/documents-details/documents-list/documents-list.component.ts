import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { EmployeeService, AuthenticationService } from '../../../../services';
import { EmployeeDocumentRequest } from '../../../../models/employeedocumentrequest';
import { first } from 'rxjs/operators';
import { EmployeeApi, OrganizationApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css']
})
export class DocumentsListComponent implements OnInit {
  @Input() employeeId: any;
  @ViewChild('documentTable') documentTable: Table;

  employeeDocumentData: any = [];
  selectedDocumentForCheckBox: EmployeeDocumentRequest[];
  deleteMultipleParams: any;
  blob: any;
  localstorageData: any;
  modulePermission: any;
  roleId: any;
  isNeedToRenderUIModal: boolean;
  displayHeader: string;
  documentListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private employeeApi: EmployeeApi,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.getEmployeeDocumentDetails(true);
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.modulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_DOCUMENT_SCREEN)[0];
        if (this.modulePermission && this.modulePermission !== undefined) {
          this.modulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getEmployeeDocumentDetails(isNeedToRefresh: boolean): void {
    if (this.employeeId && this.employeeId > 0) {
      this.employeeApi.getEmployeeDetailsById(parseInt(this.employeeId, 10), isNeedToRefresh)
        .pipe(first()).subscribe(employeeDocumentDetails => {
          if (employeeDocumentDetails && (employeeDocumentDetails['flag'] === 1)) {
            this.employeeDocumentData = employeeDocumentDetails['data']['empDocument'];
          }
        }, error => {
          console.log(error);
        });
    }
  }

  showConfirmForDeleteDocument(deleteDocumentData: any) {
    if (deleteDocumentData && deleteDocumentData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteDocumentkey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteDocumentData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteDocumentDetails(documentData: any) {
    this.messageService.clear('deleteDocumentkey');
    if (documentData && documentData.length > 0) {
      this.deleteMultipleDocument(documentData);
    } else if (documentData && documentData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSingleDocument(documentData, loggedInUserId);
    }
  }

  private deleteMultipleDocument(documentDataForDelete: any) {
    const documentIds = documentDataForDelete.map((documentId: { id: any; }) => documentId.id);
    this.deleteMultipleParams = { Ids: documentIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.employeeApi.deletedSelectedDocumentIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultipleDocumentRes => {
      if (deleteMultipleDocumentRes && deleteMultipleDocumentRes['flag'] === 1) {
        this.selectedDocumentForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultipleDocumentRes['message']
        });
        this.getEmployeeDocumentDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultipleDocumentRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSingleDocument(documentData: any, loggedInUserId: any) {
    this.employeeApi.deleteDocumentById(documentData, loggedInUserId).pipe(first()).subscribe(deleteDocRes => {
      if (deleteDocRes && deleteDocRes['flag'] === 1) {
        if ((loggedInUserId === deleteDocRes['data'].userId) && deleteDocRes['data'].typeId === 'Profile photo') {
          this.localstorageData = JSON.parse(localStorage.getItem('currentUser'));
          this.localstorageData.data.path = deleteDocRes['data'].url;
          localStorage.setItem('currentUser', JSON.stringify(this.localstorageData));
          this.employeeService.refreshProfileImage.next(true);
        }
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteDocRes['message']
        });
        this.getEmployeeDocumentDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteDocRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedDocumentForCheckBox && this.selectedDocumentForCheckBox.length > 0) {
      this.selectedDocumentForCheckBox = [];
    }
    this.messageService.clear('deleteDocumentkey');
  }

  downloadFile(file) {
    this.employeeApi.getFile(file.id).subscribe((downloadRes) => {
      this.blob = new Blob([downloadRes], { type: 'application/pdf' });
      const downloadURL = window.URL.createObjectURL(downloadRes);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = file.fileName;
      link.click();
    });
  }

  openAddEditDialog(documentObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = documentObj === undefined ? 'Add Document' : 'Edit Document';
    this.documentListObj = documentObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getEmployeeDocumentDetails(true);
    }
  }

}
