import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpinnerService, AuthenticationService } from './../../../services';
import { ProjectsApi, DocumentsApi, OrganizationApi, EmployeeApi } from '../../../shared/api';
import { DocumentsRequest } from './../../../models/documentsrequest';
import { SortEvent, MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

interface IspublicDD {
  label: string;
  value: string;
}

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  filterFrm: FormGroup;
  projectNamesList: any;
  selectedDocumentsForCheckBox: DocumentsRequest[];
  documentsData: DocumentsRequest[];
  filterObj: { projectId: number; isPublic: string; };
  selectedIsPublic: IspublicDD;
  roleId: any;
  documentsModulePermission: any;
  deleteMultipleParams: { Ids: number[]; loggedInUserId: number; };
  documentIds: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  documentListObj: any;
  IsPublicTypes: IspublicDD[];
  keyWordTypes: any;
  isNeedToRenderAdminData = false;
  isNeedToRenderEmployeeData = false;
  dynamicButtonsobj: any = {};
  blob: any;
  viewDocumentId: number;
  selectedAllProject: any;
  selectedAllIsPublicType: any;
  IsPublicTypesArr: any;

  constructor(
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private projectsApi: ProjectsApi,
    private documentsApi: DocumentsApi,
    private authenticationService: AuthenticationService,
    private organizationApi: OrganizationApi,
    private messageService: MessageService,
    private employeeApi: EmployeeApi
  ) { }

  ngOnInit(): void {
    // this.roleBasedDataBinding();
    this.filterFormControl();
    this.getLocalStoragePermissionData();
    this.getDocuments();
    this.getDropDownNamesByTypes();
    this.getProjects();
  }

  private filterFormControl() {
    this.filterFrm = this.formBuilder.group({
      projectId: [''],
      isPublic: ['']
    });
  }

  getDropDownNamesByTypes() {
    this.employeeApi.getDropDownNamesByType().subscribe(dropdownNameRes => {
      if (dropdownNameRes && dropdownNameRes['flag'] === 1) {
        if (dropdownNameRes['data'] && dropdownNameRes['data'].length > 0) {
          dropdownNameRes['data'].map((data) => {
            data.label = data.displayName;
            data.value = data.displayValue;
          });
          this.IsPublicTypesArr = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISPUBLICTYPE);
          this.IsPublicTypesArr.unshift({ label: 'All', value: null });
          this.IsPublicTypes = this.IsPublicTypesArr;
          if (this.IsPublicTypes.length > 0) {
            this.selectedAllIsPublicType = this.IsPublicTypes[0].value;
          }
          this.keyWordTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.KEYWORDTYPE)
            .map(data => Object.assign({ label: data.label, value: data.value }));
        }
      }
    }, error => {
      console.log(error);
    });
  }

  private getProjects() {
    this.projectsApi.getAllProjectsByNames(true).subscribe(projectsRes => {
      if (projectsRes && projectsRes['flag'] === 1) {
        projectsRes['data'].map((data) => {
          data.label = data.name;
          data.value = data.id;
        });
        projectsRes['data'].unshift({ label: 'All Projects', value: null });
        this.projectNamesList = projectsRes['data'];
        if (this.projectNamesList.length > 0) {
          this.selectedAllProject = this.projectNamesList[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  downloadDocument(file) {
    this.documentsApi.downloadDocument(file.id).subscribe((downloadRes) => {
      this.blob = new Blob([downloadRes], { type: 'application/pdf' });
      const downloadURL = window.URL.createObjectURL(downloadRes);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = file.physicalPath;
      link.click();
    });
  }

  private roleBasedDataBinding() {
    if (this.authenticationService.isAdmin()) {
      this.isNeedToRenderAdminData = true;
    } else {
      this.isNeedToRenderEmployeeData = true;
    }
  }

  getDocuments() {
    this.filterObj = {
      projectId: (this.filterFrm && this.filterFrm.value.projectId && this.filterFrm.value.projectId.value) ?
        this.filterFrm.value.projectId.value : 0,
      isPublic: (this.filterFrm && this.filterFrm.value.isPublic && this.filterFrm.value.isPublic.value) ?
        this.filterFrm.value.isPublic.value : this.filterFrm.value.isPublic === 0 ? null : null,
    };
    this.documentsApi.getAllDocuments(this.filterObj).subscribe(res => {
      if (res && res['flag'] === 1) {
        if (this.authenticationService.isAdmin()) {
          this.documentsData = res['data']; // For Admin login
        } else {
          this.documentsData = res['data'].filter(s => s.isPublic === 'Yes'); // For Employee login
        }
      }
    }, error => {
      console.log(error);
    });
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.documentsModulePermission = res['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.DOCUMENTS_SCREEN)[0];
        if (this.documentsModulePermission && this.documentsModulePermission !== undefined) {
          this.documentsModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  clearFilter() {
    if (this.filterFrm && (this.filterObj.projectId > 0 || this.filterObj.isPublic !== null)) {
      this.filterFrm.controls.projectId.setValue(0);
      this.selectedAllProject = this.projectNamesList[0].value;
      this.filterFrm.value.isPublic = 0;
      this.getDocuments();
    }
  }

  customSortForDocumentsTable(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;
      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }

  showConfirmForDeleteDocument(deleteDocumentData: any) {
    if (deleteDocumentData && deleteDocumentData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteDocumentKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
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
    this.messageService.clear('deleteDocumentKey');
    if (documentData && documentData.length > 0) {
      this.documentIds = documentData.map(id => id.id);
    } else {
      this.documentIds = [documentData];
    }
    this.deleteMultipleParams = { Ids: this.documentIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.documentsApi.deletedDocumentIds(this.deleteMultipleParams).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedDocumentsForCheckBox = [];
        this.documentIds = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.getDocuments();
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

  onReject() {
    if (this.selectedDocumentsForCheckBox && this.selectedDocumentsForCheckBox.length > 0) {
      this.selectedDocumentsForCheckBox = [];
    }
    this.messageService.clear('deleteDocumentKey');
  }

  showDocumentDialog(documentObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = documentObj === undefined ? 'Add Document' : 'Edit Document';
    this.documentListObj = documentObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getDocuments();
    }
  }

  removeSelectedFile(arg?: any) {
    if (arg === 1) {
      this.getDocuments();
    }
  }

  viewDocument(documentsObj: number) {
    window.open(documentsObj['virtualPath'], '_blank');
  }

  copyExternalLink(val: string) {
    const selBox = document.createElement('textarea');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.messageService.add({
      key: 'commonMsg', severity: 'success', summary: 'Success Message',
      detail: 'External link copied!'
    });
  }
}
