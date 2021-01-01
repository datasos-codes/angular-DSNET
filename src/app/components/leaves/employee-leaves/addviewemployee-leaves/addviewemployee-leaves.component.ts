import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AdminLeavesRequest } from '../../../../models';
import { NotificationService, AuthenticationService, CustomvalidationService } from '../../../../services';
import { AdminLeaveApi, EmployeeApi, DropDownTypes } from '../../../../shared';

@Component({
  selector: 'app-addviewemployee-leaves',
  templateUrl: './addviewemployee-leaves.component.html',
  styleUrls: ['./addviewemployee-leaves.component.css']
})
export class AddViewEmployeeleavesComponent implements OnInit {
  @Input() addviewLeaveDetails: any;
  @Output() addEditEmployeeLeavesEvent: EventEmitter<any> = new EventEmitter();

  addEditEmployeeLeavesFrm: FormGroup;
  submitted = false;
  employeeLeavesObj: AdminLeavesRequest;
  employeeData: any;
  isNeedToRenderLeaveTotal: boolean = false;
  loading = false;
  UserId: any;
  isNeedToRenderLeaveFor: boolean = false;
  viewLeave: boolean;
  LeaveForTypes: any;
  selectedLeaveForType: any;
  LeaveTypes: any;
  selectedLeaveType: any;
  LeaveStatusTypes: any;
  selectedStatusType: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private adminLeaveApi: AdminLeaveApi,
    private employeeApi: EmployeeApi,
    private customvalidationService: CustomvalidationService,

  ) {
    this.employeeLeavesObj = new AdminLeavesRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empAddressControls();
    this.displayAllEmployeeLeaveData();
    this.getEmployeeByNames();
  }

  private displayAllEmployeeLeaveData() {
    if (this.addviewLeaveDetails !== undefined && this.addviewLeaveDetails.id > 0) {
      const leaveDateArr = [];
      leaveDateArr.push(new Date(this.addviewLeaveDetails.leaveStartDate));
      leaveDateArr.push(new Date(this.addviewLeaveDetails.leaveEndDate));
      this.addviewLeaveDetails.range = leaveDateArr;
      this.employeeLeavesObj = this.addviewLeaveDetails;
      this.viewLeave = true;
    } else {
      this.viewLeave = false;
      this.employeeLeavesObj.leaveType = 'Casual';
      this.employeeLeavesObj.leaveFor = 'Full';
    }
  }

  get f() { return this.addEditEmployeeLeavesFrm.controls; }

  private empAddressControls() {
    this.addEditEmployeeLeavesFrm = this.formBuilder.group({
      range: [null, Validators.required],
      leaveType: ['', Validators.required],
      reason: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      remark: [''],
      numberOfDays: [''],
      leaveFor: [''],
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
          this.LeaveForTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.LEAVEFORTYPE);
          this.selectedLeaveForType = this.LeaveForTypes[0].value;
          this.LeaveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.LEAVETYPE);
          this.selectedLeaveType = this.LeaveTypes[0].value;
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getEmployeeByNames(): void {
    this.employeeApi.getAllUsersByNames(true).pipe(first()).subscribe(employeeRes => {
      if (employeeRes && employeeRes['flag'] === 1) {
        this.employeeData = employeeRes['data'].filter(s => s.isActive === this.selectedIsActiveType);
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmitAddEditEmployeeLeavesFrm() {
    this.submitted = true;
    if (this.addEditEmployeeLeavesFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.employeeLeavesObj = this.addEditEmployeeLeavesFrm.value;
      this.employeeLeavesObj.employeeId = this.authenticationService.IsUserId();
      this.employeeLeavesObj.leaveStartDate = this.datepipe.transform(this.employeeLeavesObj.range[0], 'yyyy-MM-dd');
      this.employeeLeavesObj.leaveEndDate = this.datepipe.transform(this.employeeLeavesObj.range[1], 'yyyy-MM-dd');
      this.employeeLeavesObj.createdBy = this.UserId;
      this.employeeLeavesObj.status = 'Pending';
      this.addeditEmployeeLeave(this.employeeLeavesObj);
    }
  }

  private addeditEmployeeLeave(employeeLeavesData: any): void {
    this.adminLeaveApi.addEditAdminLeavesData(employeeLeavesData).subscribe(employeeLeaveRes => {
      if (employeeLeaveRes && employeeLeaveRes['flag'] === 1) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: employeeLeaveRes['message']
        });
        this.addEditEmployeeLeavesEvent.emit(employeeLeaveRes['flag']);
        this.notificationService.refreshNotification.next(true);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: employeeLeaveRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }

  resetForm() {
    this.submitted = false;
    this.isNeedToRenderLeaveTotal = false;
    this.addEditEmployeeLeavesFrm.reset();
  }

  countTotalNumberOfLeaves(arg: any) {
    if (arg && arg.length > 0) {
      const sDate = moment(arg[0]);
      const eDate = moment(arg[1]);
      this.employeeLeavesObj.numberOfDays = Math.abs(sDate.diff(eDate, 'days')) + 1;
      this.isNeedToRenderLeaveTotal = true;
      if (this.employeeLeavesObj.numberOfDays === 1) {
        this.isNeedToRenderLeaveFor = true;
      } else {
        this.isNeedToRenderLeaveFor = false;
      }
    }
  }
}
