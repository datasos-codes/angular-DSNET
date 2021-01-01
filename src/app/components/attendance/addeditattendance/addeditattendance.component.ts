import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AttendanceRequest } from '../../../models/attendancerequest';
import { AuthenticationService } from '../../../services';
import { first } from 'rxjs/operators';
import { AttendanceApi, EmployeeApi } from '../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditattendance',
  templateUrl: './addeditattendance.component.html',
  styleUrls: ['./addeditattendance.component.css']
})
export class AddeditAttendanceComponent implements OnInit, AfterViewInit {
  @Input() AttendanceListObj: any;
  @Output() closeAttendanceUIModalEvent: EventEmitter<any> = new EventEmitter();

  addEditAttendanceFrm: FormGroup;
  submitted = false;
  attendanceObj: AttendanceRequest;
  isNeedToRenderIsActiveLable: boolean = false;
  meridian: any;
  employeeList: any;
  loading = false;
  maxDate: Date;
  UserId: any;
  editAttendaceData: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private attendanceApi: AttendanceApi,
    private messageService: MessageService,
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    public datepipe: DatePipe
  ) {
    this.attendanceObj = new AttendanceRequest();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.attendanceFrmControls();
    this.getAllEmployeesList();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.editAttendanceData();
    }, 200);
  }

  private attendanceFrmControls() {
    this.addEditAttendanceFrm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      AloginTime: [''],
      AlogoutTime: [''],
      tDate: ['', Validators.required],
      comments: [''],
      isActive: ['', Validators.required],
    });
  }

  get f() { return this.addEditAttendanceFrm.controls; }

  private editAttendanceData() {
    if (this.AttendanceListObj !== undefined && this.AttendanceListObj.id > 0) {
      this.attendanceObj = this.AttendanceListObj;
      this.attendanceObj.tDate = this.datepipe.transform(this.AttendanceListObj.date, 'yyyy-MM-dd');
      // login Time
      if (this.AttendanceListObj.loginTime) {
        const logintDt = new Date(this.AttendanceListObj.loginTime);
        logintDt.setHours(logintDt.getHours() - 5);
        logintDt.setMinutes(logintDt.getMinutes() - 30);
        this.attendanceObj.AloginTime = new Date(logintDt);
      } else {
        this.attendanceObj.AloginTime = null;
      }
      // logout Time
      if (this.AttendanceListObj.logoutTime) {
        const logoutDt = new Date(this.AttendanceListObj.logoutTime);
        logoutDt.setHours(logoutDt.getHours() - 5);
        logoutDt.setMinutes(logoutDt.getMinutes() - 30);
        this.attendanceObj.AlogoutTime = new Date(logoutDt);
      } else {
        this.attendanceObj.AlogoutTime = null;
      }
    }
  }

  getDropDownNamesByTypes() {
    this.employeeApi.getDropDownNamesByType().subscribe(dropdownNameRes => {
      if (dropdownNameRes && dropdownNameRes['flag'] === 1) {
        if (dropdownNameRes['data'] && dropdownNameRes['data'].length > 0) {
          dropdownNameRes['data'].map((data) => {
            data.label = data.displayName;
            data.value = data.displayValue;
          });
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getAllEmployeesList(): void {
    this.employeeApi.getAllUsersByNames().pipe(first()).subscribe(employeeRes => {
      if (employeeRes && employeeRes['flag'] === 1) {
        this.employeeList = employeeRes['data'].filter(s => s.isActive === this.selectedIsActiveType);
        if (this.employeeList && this.employeeList.length > 0) {
          this.employeeList.map((employeeDropdownRes) => {
            employeeDropdownRes.value = employeeDropdownRes.id;
            employeeDropdownRes.label = employeeDropdownRes.name;
          });
          this.employeeList = this.employeeList;
        }
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  onSubmitaddEditAttendanceFrm() {
    this.submitted = true;
    if (this.addEditAttendanceFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.attendanceObj = this.addEditAttendanceFrm.value;
      if (this.AttendanceListObj !== undefined && this.AttendanceListObj.id > 0) {
        this.attendanceObj.id = this.AttendanceListObj.id;
        this.attendanceObj.modifiedBy = this.UserId;
      } else {
        this.attendanceObj.createdBy = this.UserId;
      }
      this.attendanceObj.date = this.datepipe.transform(this.addEditAttendanceFrm.value.tDate, 'yyyy-MM-dd');
      this.attendanceObj.employeeId = parseInt(this.addEditAttendanceFrm.value.employeeId, 10);
      this.attendanceObj.loginTime = this.addEditAttendanceFrm.value.AloginTime ? this.addEditAttendanceFrm.value.AloginTime : null;
      this.attendanceObj.logoutTime = this.addEditAttendanceFrm.value.AlogoutTime ? this.addEditAttendanceFrm.value.AlogoutTime : null;
      delete this.attendanceObj.AloginTime;
      delete this.attendanceObj.AlogoutTime;
      this.addeditAttendanceData(this.attendanceObj);
    }
  }

  private addeditAttendanceData(attendanceRequestData: any) {
    this.attendanceApi.addEditAttendanceDetails(attendanceRequestData).subscribe(res => {
      if (res && (res['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.closeAttendanceUIModalEvent.emit(res['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: res['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

  resetForm() {
    this.submitted = false;
    this.addEditAttendanceFrm.reset();
  }

}
