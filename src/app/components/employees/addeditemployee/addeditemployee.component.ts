import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService, AuthenticationService, AlertMessageService, CustomvalidationService } from '../../../services';
import { first } from 'rxjs/operators';
import { EmployeeRequest } from '../../../models/employeerequest';
import { DatePipe } from '@angular/common';
import { DesignationMasterApi, EmployeeApi, OrganizationApi } from '../../../shared/api';
import { MessageService } from 'primeng/api/';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditemployee',
  templateUrl: './addeditemployee.component.html',
  styleUrls: ['./addeditemployee.component.css']
})
export class AddeditemployeeComponent implements OnInit {

  addEditEmployeeForm: FormGroup;
  submitted = false;
  employeeDesignationList: any;
  employee: EmployeeRequest;
  selectedDesignation: any;
  getEmployeeIdFromParams: any;
  lableName = '';
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  maxDate: Date;
  userNamesData: any;
  UserNameDuplicate = false;
  FinalUsername: any;
  isUserName: any;
  UserId: any;
  loading = false;
  isNeedToRender = true;
  isShowPassword = false;
  localstorageData: any;
  error: any;
  allRoles: any;
  securityQuestionTypes: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private employeeApi: EmployeeApi,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private alertMessageService: AlertMessageService,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private designationMasterApi: DesignationMasterApi,
    private organizationApi: OrganizationApi,
    private customvalidationService: CustomvalidationService,
  ) {
    this.employee = new EmployeeRequest();
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.employee.roleId = 1;
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.getAllDesignations();
    this.getRoles();
    this.addEditEmployeeValidation();
    this.getUserByUserNames(true);
    this.updatedSource();
    this.getEmployeeById(true);
  }

  getRoles() {
    this.organizationApi.getUserRoles().pipe(first()).subscribe(res => {
      if (res && (res['flag'] === 1)) {
        res['data'].map((data) => {
          data.value = data.id;
          data.label = data.name;
        });
        this.allRoles = res['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  private updatedSource(): void {
    this.employeeService.employeeUpdatedSourceForEmployee.subscribe(res => {
      if (res) {
        this.getEmployeeById(true);
        this.getUserByUserNames(true);
      }
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
          this.securityQuestionTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.SECURITYQUESTIONTYPE);
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  private addEditEmployeeValidation() {
    this.addEditEmployeeForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z]+(?: [a-z|A-Z]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      middleName: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z]+(?: [a-z|A-Z]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      lastName: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z]+(?: [a-z|A-Z]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      tbirthDate: ['', Validators.required],
      companyEmail: ['', Validators.compose([Validators.required, Validators.email,
      this.customvalidationService.cannotContainSpace])],
      panNumber: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$'),
        this.customvalidationService.cannotContainSpace]
      )],
      aadharNumber: ['', Validators.compose([
        Validators.required,
        Validators.minLength(12),
        this.customvalidationService.cannotContainSpace
      ])],
      designationId: ['', Validators.required],
      userName: ['', Validators.compose([
        Validators.required,
        this.customvalidationService.cannotContainSpace
      ])],
      empPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        this.customvalidationService.cannotContainSpace
      ])],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      gender: ['', Validators.required],
      roleId: ['', Validators.required],
      isActive: ['', Validators.required],
      tjoiningDate: ['', Validators.required]
    });
  }

  get f() { return this.addEditEmployeeForm.controls; }

  getEmployeeById(isNeedToRefresh: boolean) {
    this.getEmployeeIdFromParams = parseInt(this.activatedRoute.snapshot.paramMap.get('employeeId'), 10);
    if (this.getEmployeeIdFromParams && this.getEmployeeIdFromParams > 0) {
      this.lableName = 'Update Employee';
      this.employeeApi.getEmployeeDetailsById(this.getEmployeeIdFromParams, isNeedToRefresh).pipe(first())
        .subscribe(resEmployeeData => {
          if (resEmployeeData && (resEmployeeData['flag'] === 1)) {
            this.employee = resEmployeeData['data']['employeeDetails'][0];
            this.employee.tbirthDate = this.datepipe.transform(this.employee.birthDate, 'yyyy-MM-dd');
            this.employee.tjoiningDate = this.datepipe.transform(this.employee.joiningDate, 'yyyy-MM-dd');
            this.employee.empPassword = this.customvalidationService.get('123456$#@$^@1ERF', this.employee.password);
            this.isUserName = this.employee.userName;
            if (this.UserId === this.employee.employeeId) {
              this.isNeedToRender = false;
            }
          } else {
            this.messageService.add({
              key: 'commonMsg', severity: 'error', summary: 'Error Message',
              detail: resEmployeeData['message']
            });
          }
        });
    } else {
      this.lableName = 'Add Employee';
      this.employee.gender = 1;
      this.isNeedToRender = true;
    }
  }

  getUserByUserNames(isNeedToRefresh: boolean): void {
    this.employeeApi.getAllUsersByUserNames(isNeedToRefresh).pipe(first()).subscribe(userNamesRes => {
      if (userNamesRes && userNamesRes['flag'] === 1) {
        this.userNamesData = userNamesRes['data'];
      }
    }, error => {
      this.error = error;
      console.log(this.error);
    });
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  getAllDesignations() {
    this.designationMasterApi.getAllDesignationsByNames(true).pipe(first()).subscribe(employeeDesignationListResponse => {
      if (employeeDesignationListResponse && (employeeDesignationListResponse['flag'] === 1)) {
        if (employeeDesignationListResponse['data'] && employeeDesignationListResponse['data'].length > 0) {
          this.employeeDesignationList = employeeDesignationListResponse['data'].filter(s => s.isActive === 'Active');
          if (this.employeeDesignationList && this.employeeDesignationList.length > 0) {
            this.employeeDesignationList.map((designationsDropdownRes) => {
              designationsDropdownRes.value = designationsDropdownRes.id; delete designationsDropdownRes.id;
              designationsDropdownRes.label = designationsDropdownRes.name; delete designationsDropdownRes.name;
            });
            this.employeeDesignationList = this.employeeDesignationList;
          }
        }
      }
    }, error => {
      this.error = error;
      console.log(this.error);
    });
  }

  onSubmitAddEditEmployeeForm() {
    this.submitted = true;
    if (this.addEditEmployeeForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.employee = this.addEditEmployeeForm.value;

      // To check if username is already exits.
      if (this.isUserName !== this.employee.userName) {
        const UserNameExist = this.userNamesData.map(uname => uname.userName).
          filter(name => name === this.addEditEmployeeForm.value.userName);
        if (UserNameExist && UserNameExist.length !== 0) {
          this.loading = false;
          this.messageService.add({
            key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
            detail: 'Username is already exist.'
          });
          return;
        }
      }

      this.employee.gender = parseInt(this.addEditEmployeeForm.value.gender, 10);
      this.employee.designationId = parseInt(this.addEditEmployeeForm.value.designationId, 10);
      this.employee.roleId = parseInt(this.addEditEmployeeForm.value.roleId, 10);
      this.employee.birthDate = this.datepipe.transform(this.addEditEmployeeForm.value.tbirthDate, 'yyyy-MM-dd');
      this.employee.joiningDate = this.datepipe.transform(this.addEditEmployeeForm.value.tjoiningDate, 'yyyy-MM-dd');
      this.employee.password = this.customvalidationService.set('123456$#@$^@1ERF', this.addEditEmployeeForm.value.empPassword);

      if (this.getEmployeeIdFromParams && this.getEmployeeIdFromParams > 0) {
        this.employee.employeeId = this.getEmployeeIdFromParams;
        if (this.employee.employeeId !== this.UserId) {
          this.employee.isActive = this.addEditEmployeeForm.value.isActive;
        } else {
          this.employee.isActive = this.selectedIsActiveType;
        }
        this.employee.modifiedBy = this.UserId;
        // When password edit form here, it also update into localstorge.
        if (this.employee.employeeId === this.UserId) {
          this.localstorageData = JSON.parse(localStorage.getItem('currentUser'));
          this.localstorageData.data.password = this.employee.password;
          localStorage.setItem('currentUser', JSON.stringify(this.localstorageData));
        }
      } else {
        this.employee.createdBy = this.UserId;
        delete this.employee.tbirthDate;
        delete this.employee.tjoiningDate;
      }

      this.employeeApi.addEditEmployeeDetails(this.employee).pipe(first()).subscribe(res => {
        if (res && (res['flag'] === 1)) {
          this.loading = false;
          this.router.navigate(['/employees']);
          this.alertMessageService.success(res['message'], this.options);
        } else {
          this.loading = false;
          this.messageService.add({
            key: 'commonMsg', severity: 'error', summary: 'Error Message',
            detail: res['message']
          });
        }
      }, error => {
        console.log(error);
      });
    }
  }

  resetForm() {
    this.submitted = false;
    this.addEditEmployeeForm.reset();
  }

  isNeedToRenderPassword(val: any) {
    if (val && (val !== undefined || val !== '')) {
      this.isShowPassword = !this.isShowPassword;
    }
  }

}

