import { RoleBasePermission } from './../../../../shared/constances/rolebasepermission';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../../services';
import { first } from 'rxjs/operators';
import { EmployeePriorExperienceRequest } from '../../../../models/emppriorexperiencerequest';
import { EmployeeApi, OrganizationApi } from '../../../../shared/api';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table/table';
import * as moment from 'moment';

@Component({
  selector: 'app-priorexperience-list',
  templateUrl: './priorexperience-list.component.html',
  styleUrls: ['./priorexperience-list.component.css']
})
export class PriorExperienceListComponent implements OnInit {
  @Input() employeeId: any;
  @ViewChild('priorexptable') priorexptable: Table;

  employeePriorExpData: any = [];
  selectedPriorExpForCheckBox: EmployeePriorExperienceRequest[];
  deleteMultipleParams: any;
  modulePermission: any;
  roleId: any;
  isNeedToRenderUIModal = false;
  displayHeader: string;
  priorExpListObj: any;
  dynamicButtonsobj: any = {};

  constructor(
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private organizationApi: OrganizationApi,
  ) { }

  ngOnInit(): void {
    this.getEmployeePriorExperienceDetails(true);
    this.getLocalStoragePermissionData();
  }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.modulePermission = rolePermissionRes['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_EXPERIENCE_HISTORY_SCREEN)[0];
        if (this.modulePermission && this.modulePermission !== undefined) {
          this.modulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  getEmployeePriorExperienceDetails(isNeedToRefresh: boolean) {
    if (this.employeeId && this.employeeId > 0) {
      this.employeeApi.getEmployeeDetailsById(parseInt(this.employeeId, 10), isNeedToRefresh)
        .pipe(first()).subscribe(employeePriorExpResponse => {
          if (employeePriorExpResponse && (employeePriorExpResponse['flag'] === 1)) {
            this.employeePriorExpData = employeePriorExpResponse['data']['employmentHistory'];
          }
        }, error => {
          console.log(error);
        });
    }
  }

  showConfirmForDeletePriorExp(deletePriorExpData: any) {
    if (deletePriorExpData && deletePriorExpData.length !== 0) {
      this.messageService.clear();
      this.messageService.add({
        key: 'deletePriorExpkey', sticky: true, severity: 'warn', summary: 'Are you sure?',
        detail: 'Confirm to proceed.', data: deletePriorExpData
      });
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'There are unselected checkboxes.'
      });
    }
  }

  deletePriorExpDetails(priorExpData: any) {
    this.messageService.clear('deletePriorExpkey');
    if (priorExpData && priorExpData.length > 0) {
      this.deleteMultiplePriorExp(priorExpData);
    } else if (priorExpData && priorExpData !== 0) {
      const loggedInUserId = this.authenticationService.IsUserId();
      this.deleteSinglePriorExp(priorExpData, loggedInUserId);
    }
  }

  private deleteMultiplePriorExp(priorExpDataForDelete: any) {
    const priorExpIds = priorExpDataForDelete.map((priorExpId: { id: any; }) => priorExpId.id);
    this.deleteMultipleParams = { Ids: priorExpIds, loggedInUserId: this.authenticationService.IsUserId() };
    this.employeeApi.deletedSelectedPriorExpIds(this.deleteMultipleParams).pipe(first()).subscribe(deleteMultiplePriorExpRes => {
      if (deleteMultiplePriorExpRes && deleteMultiplePriorExpRes['flag'] === 1) {
        this.selectedPriorExpForCheckBox = [];
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deleteMultiplePriorExpRes['message']
        });
        this.getEmployeePriorExperienceDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deleteMultiplePriorExpRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  private deleteSinglePriorExp(priorExpData: any, loggedInUserId: any) {
    this.employeeApi.deletePriorExperienceById(priorExpData, loggedInUserId).pipe(first()).subscribe(deletePriorExpRes => {
      if (deletePriorExpRes && deletePriorExpRes['flag'] === 1) {
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: deletePriorExpRes['message']
        });
        this.getEmployeePriorExperienceDetails(true);
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: deletePriorExpRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  onReject() {
    if (this.selectedPriorExpForCheckBox && this.selectedPriorExpForCheckBox.length > 0) {
      this.selectedPriorExpForCheckBox = [];
    }
    this.messageService.clear('deletePriorExpkey');
  }

  openAddEditDialog(priorExpObj?: any) {
    this.isNeedToRenderUIModal = true;
    this.displayHeader = priorExpObj === undefined ? 'Add Experience History' : 'Edit Experience History';
    this.priorExpListObj = priorExpObj;
  }

  closeUIModal(arg?: any) {
    this.isNeedToRenderUIModal = false;
    if (arg === 1) {
      this.getEmployeePriorExperienceDetails(true);
    }
  }

  customSortForPriorExpTable(event: SortEvent) {
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
        const test = value1.substr(2, 1);
        const date1 = moment(value1, 'DD-MMM-YYYY');
        const date2 = moment(value2, 'DD-MMM-YYYY');
        if (test === '-' || test === '/') {
          result = date1.diff(date2, 'days');
        } else {
          result = value1.localeCompare(value2);
        }
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }
}
