import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsRequest, ProjectModuleRequest } from '../../../models';
import { AuthenticationService } from '../../../services';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProjectsApi, CustomersApi, OrganizationApi } from '../../../shared/api';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';
import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  @ViewChild('projectTable') projectTable: Table;
  @ViewChild('projectModuleTable') projectModuleTable: Table;

  projectsData: any;
  filterFrm: FormGroup;
  filterProjectByModuleFrm: FormGroup;
  selectedCustomerId = 0;
  selectedModuleId = 0;
  customersList: any;
  selectedProjectsForCheckBox: ProjectsRequest[];
  selectedProjectModuleForCheckBox: ProjectModuleRequest[];
  deleteMultipleParams: { Ids: any; loggedInUserId: any; };
  perojectModulePermission: any;
  getRolePermission: any;
  localstorageData: any;
  roleId: number;
  projectsModuleData: any;
  onlyProjectName: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  projectListObj: any;
  projectModuleListObj: any;
  isOpenProjectUIDialog = false;
  isOpenProjectModuleUIDialog = false;
  dynamicButtonsobj: any = {};

  constructor(
    private projectsApi: ProjectsApi,
    private customersApi: CustomersApi,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.projectFilterControls();
    this.getAllProjectsList();
    this.getAllCustomersList();
    this.getLocalStoragePermissionData();
    this.getAllModules();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.perojectModulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.PROJECTS_SCREEN)[0];
        if (this.perojectModulePermission && this.perojectModulePermission !== undefined) {
          this.perojectModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  private projectFilterControls() {
    this.filterFrm = this.formBuilder.group({
      filterByCustomer: [''],
    });
    this.filterProjectByModuleFrm = this.formBuilder.group({
      filterByProjectModule: [''],
    });
  }

  getAllCustomersList() {
    this.customersApi.getAllCustomersByNames(true).pipe(first()).subscribe(customersRes => {
      if (customersRes && customersRes['flag'] === 1) {
        if (customersRes['data'] && customersRes['data'].length > 0) {
          customersRes['data'].map((customerDropdownRes) => {
            customerDropdownRes.value = customerDropdownRes.id;
            customerDropdownRes.label = customerDropdownRes.name;
          });
          this.customersList = customersRes['data'];
        }
      }
    }, error => {
      console.log(error);
    });
  }

  filterByCustomerName(customerId?: any) {
    if (customerId > 0) {
      this.selectedCustomerId = parseInt(customerId, 10);
      this.selectedProjectsForCheckBox = [];
      this.getAllProjectsList();
    }
  }

  getAllProjectsList() {
    if (this.selectedCustomerId && this.selectedCustomerId > 0) {
      this.getProjects(this.selectedCustomerId);
    } else {
      this.getProjects(this.selectedCustomerId);
    }
  }

  private getProjects(id: number) {
    this.projectsApi.getAllProjects(id).subscribe(projectsRes => {
      if (projectsRes && projectsRes['flag'] === 1) {
        this.projectsData = projectsRes['data'];
        this.projectsData.map((data) => {
          data.value = data.id;
          data.label = data.name;
        });
        this.onlyProjectName = this.projectsData;
      }
    }, error => {
      console.log(error);
    });
  }

  clearFilter() {
    this.filterFrm.controls.filterByCustomer.setValue('');
    this.selectedCustomerId = 0;
    this.selectedProjectsForCheckBox = [];
    this.getAllProjectsList();
  }

  exportExcelProjects(selectedProjectsArgs: any) {
    if (selectedProjectsArgs && selectedProjectsArgs.length > 0) {
      const projectIds = selectedProjectsArgs.map((projectId: { id: any; }) => projectId.id);
      this.projectsApi.exportToExcelProjects(projectIds).pipe(first()).subscribe(exportToExcelRes => {
        const blob = new Blob([exportToExcelRes], { type: exportToExcelRes.type });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Projects';
        link.click();
        this.selectedProjectsForCheckBox = [];
      }, error => {
        console.log(error);
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  showConfirmForDeleteProjects(deleteProjectData: any) {
    if (deleteProjectData && deleteProjectData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteProjectKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteProjectData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deleteProjectDetails(projectData: any) {
    this.messageService.clear('deleteProjectKey');
    if (projectData && projectData.length > 0) {
      this.deleteMultipleProjects(projectData);
    } else if (projectData && projectData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSignleProjects(projectData, loggedInUserId);
    }
  }

  private deleteMultipleProjects(selectedProjectsArgsForDelete: any) {
    const projectIds = selectedProjectsArgsForDelete.map((projectId: { id: any; }) => projectId.id);
    this.deleteMultipleParams = { Ids: projectIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.projectsApi.deletedSelectedIds(this.deleteMultipleParams).pipe(first()).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedProjectsForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.getAllProjectsList();
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

  private deleteSignleProjects(projectData: number, loggedInUserId: number) {
    this.projectsApi.deleteProjectById(projectData, loggedInUserId).pipe(first()).subscribe(deleteProjectRes => {
      if (deleteProjectRes && deleteProjectRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteProjectRes['message']
        });
        this.getAllProjectsList();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteProjectRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedProjectsForCheckBox && this.selectedProjectsForCheckBox.length > 0) {
      this.selectedProjectsForCheckBox = [];
    }
    this.messageService.clear('deleteProjectKey');
  }

  showProjectDialog(projectObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.isOpenProjectUIDialog = true;
    this.isOpenProjectModuleUIDialog = false;
    this.displayHeader = projectObj === undefined ? 'Add Project' : 'Edit Project';
    this.projectListObj = projectObj;
  }

  // Project Module portion start
  onChangefilterByProjectModule(id: any) {
    if (id > 0) {
      this.selectedModuleId = id;
      this.selectedProjectModuleForCheckBox = [];
      this.allModuleByProjectId();
    }
  }

  allModuleByProjectId() {
    if (this.selectedModuleId && this.selectedModuleId > 0) {
      this.getAllModules(this.selectedModuleId);
    }
  }

  getAllModules(id?: number) {
    this.projectsApi.getAllModulesDetails(id).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.projectsModuleData = res['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  clearFilterModuleFrm() {
    this.filterProjectByModuleFrm.controls.filterByProjectModule.setValue('');
    this.selectedModuleId = 0;
    this.selectedProjectModuleForCheckBox = [];
    this.getAllModules();
  }

  showConfirmForDeleteProjectModule(deleteProjectModuleData: any) {
    if (deleteProjectModuleData && deleteProjectModuleData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deleteProjectModuleKey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deleteProjectModuleData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  onRejectModuleDialog() {
    if (this.selectedProjectModuleForCheckBox && this.selectedProjectModuleForCheckBox.length > 0) {
      this.selectedProjectModuleForCheckBox = [];
    }
    this.messageService.clear('deleteProjectModuleKey');
  }

  deleteProjectModuleDetails(projectData: any) {
    this.messageService.clear('deleteProjectModuleKey');
    if (projectData && projectData.length > 0) {
      this.deleteMultipleProjectModules(projectData);
    } else if (projectData && projectData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSignleProjectModule(projectData, loggedInUserId);
    }
  }

  private deleteMultipleProjectModules(data: any) {
    const projectIds = data.map((projectId: { id: any; }) => projectId.id);
    this.deleteMultipleParams = { Ids: projectIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.projectsApi.deleteSelectedModuleIds(this.deleteMultipleParams).pipe(first()).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.selectedProjectModuleForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.getAllModules();
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

  private deleteSignleProjectModule(projectData: number, loggedInUserId: number) {
    const deletesingleParams = { Ids: [projectData], loggedInUserId };
    this.projectsApi.deleteSelectedModuleIds(deletesingleParams).pipe(first()).subscribe(deleteProjectRes => {
      if (deleteProjectRes && deleteProjectRes['flag'] === 1) {
        // this.selectedProjectModuleForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteProjectRes['message']
        });
        this.getAllModules();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteProjectRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  showProjectModuleDialog(projectModuleObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.isOpenProjectModuleUIDialog = true;
    this.isOpenProjectUIDialog = false;
    this.displayHeader = projectModuleObj === undefined ? 'Add Module' : 'Edit Module';
    this.projectModuleListObj = projectModuleObj;
  }
  // Project module portion end

  // Project/Project Module close event
  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (this.isOpenProjectUIDialog === true && arg === 1) {
      this.isOpenProjectUIDialog = false;
      this.getAllProjectsList();
    }
    if (this.isOpenProjectModuleUIDialog === true && arg === 1) {
      this.isOpenProjectModuleUIDialog = false;
      this.getAllModules();
    }
  }
}
