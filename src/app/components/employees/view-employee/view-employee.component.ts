import { RoleBasePermission } from './../../../shared/constances/rolebasepermission';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';
import { MobileListComponent } from '../mobile-details/mobile-list/mobile-list.component';
import { EmployeesComponent } from '../employees.component';
import { AuthenticationService, SpinnerService } from '../../../services';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
  providers: [MobileListComponent, EmployeesComponent]
})
export class ViewEmployeeComponent implements OnInit {
  @ViewChild('empAddressModal') public empAddressModalDialog: ModalDirective;
  @ViewChild('empEmailModal') public empEmailModalDialog: ModalDirective;
  @ViewChild('empDesignationModal') public empDesignationModalDialog: ModalDirective;
  @ViewChild('empSalaryModal') public empSalaryModalDialog: ModalDirective;
  @ViewChild('empDocumentsModal') public empDocumentModalDialog: ModalDirective;
  @ViewChild('empBankModal') public empBankModalDialog: ModalDirective;

  employeeId: any;
  title: string;
  employeeAddressScreen = true;
  employeeMobileScreen = true;
  employeeEmailScreen = true;
  employeeDesignationScreen = true;
  employeeSalaryScreen = true;
  employeeDocumentScreen = true;
  employeeBankScreen = true;
  employeeExperienceHisotryScreen = true;
  isNeedToRenderEPD = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    // this.getLocalStoragePermissionData();
    this.activatedRoute.params.subscribe(res => {
      this.employeeId = res.id;
    });
    this.isNeedToRenderEPD = true;
  }

  private getLocalStoragePermissionData() {
    this.employeeAddressScreen = this.authenticationService.getRoleBasePermissionData().
      filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_ADDRESS_SCREEN)[0].allowed;

    this.employeeMobileScreen = this.authenticationService.getRoleBasePermissionData().
      filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_MOBILE_SCREEN)[0].allowed;

    this.employeeEmailScreen = this.authenticationService.getRoleBasePermissionData().
      filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_EMAIL_SCREEN)[0].allowed;

    this.employeeDesignationScreen = this.authenticationService.getRoleBasePermissionData().
      filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_DESIGNATION_SCREEN)[0].allowed;

    this.employeeSalaryScreen = this.authenticationService.getRoleBasePermissionData().
      filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_SALARY_SCREEN)[0].allowed;

    this.employeeDocumentScreen = this.authenticationService.getRoleBasePermissionData().
      filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_DOCUMENT_SCREEN)[0].allowed;

    this.employeeBankScreen = this.authenticationService.getRoleBasePermissionData().
      filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_BANK_SCREEN)[0].allowed;

    this.employeeExperienceHisotryScreen = this.authenticationService.getRoleBasePermissionData().
      filter(fname => fname.featureName === RoleBasePermission.EMPLOYEE_EXPERIENCE_HISTORY_SCREEN)[0].allowed;
  }

}
