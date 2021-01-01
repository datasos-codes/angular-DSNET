import { Component, OnInit } from '@angular/core';
import { AuthenticationService, CustomvalidationService } from '../../services';
import { EmployeeApi } from '../../shared/api';
import { first } from 'rxjs/operators';
import { EmployeeRequest } from '../../models';
import { MessageService } from 'primeng/api';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DropDownTypes } from '../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserProfileComponent implements OnInit {
  loggedInUserDataId: number = 0;
  userProfile: any;
  fetchUserProfileData: any;
  editUserForm: FormGroup;
  submitted = false;
  loading = false;
  isShowPassword = false;
  maxDate: Date;
  employeeDesignationList: any;
  localstorageData: any;
  userJoiningDate: string;
  isUserName: any;
  employeeDesignationName: string;
  securityQuestionTypes: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private customvalidationService: CustomvalidationService
  ) {
    this.userProfile = new EmployeeRequest();
    this.fetchUserProfileData = new EmployeeRequest();
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.loggedInUserDataId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.addEditEmployeeValidation();
    this.getUserById(this.loggedInUserDataId);
  }

  private addEditEmployeeValidation() {
    this.editUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      tbirthDate: ['', Validators.required],
      companyEmail: ['', Validators.compose([Validators.required, Validators.email])],
      panNumber: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$')]
      )],
      aadharNumber: ['', Validators.compose([
        Validators.required,
        Validators.minLength(12),
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ])],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      gender: ['', Validators.required]
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
        }
      }
    }, error => {
      console.log(error);
    });
  }

  get f() { return this.editUserForm.controls; }

  getUserById(userId: number) {
    if (userId && userId > 0) {
      this.employeeApi.getEmployeeDetailsById(userId).pipe(first()).subscribe(res => {
        if (res && (res['flag'] === 1)) {
          this.fetchUserProfileData = res['data']['employeeDetails'][0];
          this.fetchUserProfileData.tbirthDate = this.datepipe.transform(this.fetchUserProfileData.birthDate, 'yyyy-MM-dd');
          this.fetchUserProfileData.password = this.customvalidationService.get('123456$#@$^@1ERF', this.fetchUserProfileData.password);
          this.userJoiningDate = this.datepipe.transform(this.fetchUserProfileData.joiningDate, 'yyyy-MM-dd');
          this.isUserName = this.fetchUserProfileData.userName;
          this.employeeDesignationName = this.fetchUserProfileData.designationName;
        } else {
          this.messageService.add({
            key: 'commonMsg', severity: 'error', summary: 'Error Message',
            detail: res['message']
          });
        }
      });
    }
  }

  isNeedToRenderPassword(val: any) {
    if (val && (val !== undefined || val !== '')) {
      this.isShowPassword = !this.isShowPassword;
    }
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  onSubmitEditUserForm() {
    this.submitted = true;
    if (this.editUserForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.userProfile = this.editUserForm.value;
      if (this.loggedInUserDataId && this.loggedInUserDataId > 0) {
        this.userProfile.employeeId = this.loggedInUserDataId;
        this.userProfile.gender = parseInt(this.editUserForm.value.gender, 10);
        this.userProfile.birthDate = this.datepipe.transform(this.editUserForm.value.tbirthDate, 'yyyy-MM-dd');
        this.userProfile.modifiedBy = this.loggedInUserDataId;
        this.userProfile.password = this.customvalidationService.set('123456$#@$^@1ERF', this.userProfile.password);
        this.userProfile.joiningDate = this.datepipe.transform(this.userJoiningDate, 'yyyy-MM-dd');
        this.userProfile.designationId = parseInt(this.fetchUserProfileData.designationId, 10);
        this.userProfile.userName = this.isUserName;
        this.userProfile.roleId = this.fetchUserProfileData.roleId;
        this.userProfile.isActive = this.fetchUserProfileData.isActive;
        delete this.userProfile.tbirthDate;

        // When password edit form here, it also update into localstorge.
        if (this.userProfile.employeeId === this.loggedInUserDataId) {
          this.localstorageData = JSON.parse(localStorage.getItem('currentUser'));
          this.localstorageData.data.password = this.userProfile.password;
          localStorage.setItem('currentUser', JSON.stringify(this.localstorageData));
        }

        this.employeeApi.addEditEmployeeDetails(this.userProfile).pipe(first()).subscribe(res => {
          if (res && (res['flag'] === 1)) {
            this.loading = false;
            this.messageService.add({
              key: 'commonMsg', severity: 'success', summary: 'Success Message',
              detail: res['message']
            });
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
  }

}
