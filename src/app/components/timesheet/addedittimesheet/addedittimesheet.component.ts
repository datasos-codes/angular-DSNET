import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TimeSheetRequest } from '../../../models/timesheetrequest';
import { AuthenticationService, CustomvalidationService } from '../../../services';
import { forkJoin } from 'rxjs';
import { ProjectsApi, TimeSheetApi, EmployeeApi } from '../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addedittimesheet',
  templateUrl: './addedittimesheet.component.html',
  styleUrls: ['./addedittimesheet.component.css']
})
export class AddeditTimeSheetComponent implements OnInit, AfterViewInit {
  @Input() timesheetListObj: any;
  @Output() closeTimesheetUIModalEvent: EventEmitter<any> = new EventEmitter();

  addEditTimeSheetFrm: FormGroup;
  submitted = false;
  timeSheetObj: TimeSheetRequest;
  projectsData: any;
  employeeData: any;
  loading = false;
  UserId: any;
  maxDate: Date;
  moduleNames: any;
  testData: any;
  timeSheetDetails: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private timeSheetApi: TimeSheetApi,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private projectsApi: ProjectsApi,
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.timeSheetObj = new TimeSheetRequest();
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.getAllModules();
    this.empAddressControls();
    this.getAllDropdownLists();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.editTimeSheetDetails();
    }, 200);
  }

  private empAddressControls() {
    this.addEditTimeSheetFrm = this.formBuilder.group({
      tDate: ['', Validators.required],
      employeeId: ['', Validators.required],
      projectId: ['', Validators.required],
      moduleId: ['', Validators.required],
      task: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      description: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      remark: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      billableHours: ['', Validators.compose([
        Validators.pattern('\\d{1,3}\\.?\\d{0,3}')]
      )],
      nonBillableHours: ['', Validators.compose([
        Validators.pattern('\\d{1,3}\\.?\\d{0,3}')]
      )],
      approvedHours: ['', Validators.compose([
        Validators.pattern('\\d{1,3}\\.?\\d{0,3}')]
      )],
      invoiceId: [''],
      TstartTime: ['', Validators.required],
      TfinishTime: ['', Validators.required],
      isActive: ['', Validators.required],
    });
  }

  get f() { return this.addEditTimeSheetFrm.controls; }

  private editTimeSheetDetails() {
    if (this.timesheetListObj !== undefined && this.timesheetListObj.id > 0) {
      this.timeSheetObj = this.timesheetListObj;
      this.timeSheetObj.moduleId = this.testData.filter(
        data => data.moduleId === this.timesheetListObj.moduleId).length !== 0 ? this.timeSheetObj.moduleId : 0;
      this.timeSheetObj.tDate = this.datepipe.transform(this.timesheetListObj.date, 'yyyy-MM-dd');
      // start Time
      if (this.timesheetListObj.startTime) {
        const startdt = new Date(this.timesheetListObj.startTime);
        startdt.setHours(startdt.getHours() - 5);
        startdt.setMinutes(startdt.getMinutes() - 30);
        this.timeSheetObj.TstartTime = new Date(startdt);
      } else {
        this.timeSheetObj.TstartTime = null;
      }
      // finish Time
      if (this.timesheetListObj.finishTime) {
        const finishDt = new Date(this.timesheetListObj.finishTime);
        finishDt.setHours(finishDt.getHours() - 5);
        finishDt.setMinutes(finishDt.getMinutes() - 30);
        this.timeSheetObj.TfinishTime = new Date(finishDt);
      } else {
        this.timeSheetObj.TfinishTime = null;
      }
    }
  }

  getAllDropdownLists() {
    const employees = this.employeeApi.getAllUsersByNames(true);
    const projects = this.projectsApi.getAllProjectsByNames(true);
    forkJoin([employees, projects]).subscribe(results => {
      this.employeeData = results[0]['data'].filter(s => s.isActive === this.selectedIsActiveType);
      if (this.employeeData && this.employeeData.length > 0) {
        this.employeeData.map((employeeDropdownRes) => {
          employeeDropdownRes.value = employeeDropdownRes.id; delete employeeDropdownRes.id;
          employeeDropdownRes.label = employeeDropdownRes.name; delete employeeDropdownRes.name;
        });
        this.employeeData = this.employeeData;
      }
      this.projectsData = results[1]['data'].filter(s => s.isActive === this.selectedIsActiveType);
      if (this.projectsData && this.projectsData.length > 0) {
        this.projectsData.map((projectDropdownRes) => {
          projectDropdownRes.value = projectDropdownRes.id; delete projectDropdownRes.id;
          projectDropdownRes.label = projectDropdownRes.name; delete projectDropdownRes.name;
        });
        this.projectsData = this.projectsData;
      }
    });
  }

  getAllModules(): void {
    this.projectsApi.getAllModuleNames().subscribe(res => {
      if (res && res['flag'] === 1) {
        this.moduleNames = res['data']
        res['data'].map((data) => {
          data.label = data.moduleName;
          data.value = data.moduleId;
        });
        this.testData = res['data'].filter(id => id.projectId === this.timesheetListObj.projectId);
      }
    }, error => {
      console.log(error);
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
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  fetchModuleBasedOnProject(pId: number) {
    if (pId !== null) {
      const moduleData = this.moduleNames.filter(id => id.projectId === pId);
      moduleData.map((data) => {
        data.label = data.moduleName;
        data.value = data.moduleId;
      });
      this.testData = moduleData;
      if (this.testData.length === 0) {
        this.timeSheetObj.moduleId = 0;
      }
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'error', summary: 'Error',
        detail: 'Project not found.'
      });
    }
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  onSubmitaddEditTimeSheetFrm() {
    this.submitted = true;
    if (this.addEditTimeSheetFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.timeSheetObj = this.addEditTimeSheetFrm.value;
      if (this.timesheetListObj !== undefined && this.timesheetListObj.id > 0) {
        this.timeSheetObj.id = this.timesheetListObj.id;
        this.timeSheetObj.modifiedBy = this.UserId;
      } else {
        this.timeSheetObj.createdBy = this.UserId;
      }
      this.timeSheetObj.date = this.datepipe.transform(this.timeSheetObj.tDate, 'yyyy-MM-dd');
      this.timeSheetObj.employeeId = parseInt(this.addEditTimeSheetFrm.value.employeeId, 10);
      this.timeSheetObj.projectId = parseInt(this.addEditTimeSheetFrm.value.projectId, 10);
      this.timeSheetObj.invoiceId = parseInt(this.addEditTimeSheetFrm.value.invoiceId, 10);
      this.timeSheetObj.startTime = this.addEditTimeSheetFrm.value.TstartTime ? this.addEditTimeSheetFrm.value.TstartTime : null;
      this.timeSheetObj.finishTime = this.addEditTimeSheetFrm.value.TfinishTime ? this.addEditTimeSheetFrm.value.TfinishTime : null;
      if (this.timeSheetObj.startTime && this.timeSheetObj.finishTime) {
        var regex = new RegExp(':', 'g'),
          timeStr1 = this.timeSheetObj.startTime.toTimeString().slice(0, 5),
          timeStr2 = this.timeSheetObj.finishTime.toTimeString().slice(0, 5);
        if (parseInt(timeStr1.replace(regex, ''), 10) === parseInt(timeStr2.replace(regex, ''), 10)) {
          delete this.timeSheetObj.TstartTime;
          delete this.timeSheetObj.TfinishTime;
          this.addeditTimesheetData(this.timeSheetObj);
        } else if (parseInt(timeStr1.replace(regex, ''), 10) > parseInt(timeStr2.replace(regex, ''), 10)) {
          this.messageService.add({
            key: 'commonMsg', severity: 'warn', summary: 'Warning',
            detail: 'Finish time must be greater than start time.'
          });
          this.loading = false;
          return;
        } else {
          delete this.timeSheetObj.TstartTime;
          delete this.timeSheetObj.TfinishTime;
          this.addeditTimesheetData(this.timeSheetObj);
        }
      }
    }
  }

  private addeditTimesheetData(timeSheetObj: any) {
    this.timeSheetApi.addEdittimeSheetDetails(timeSheetObj).subscribe(res => {
      if (res && (res['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.closeTimesheetUIModalEvent.emit(res['flag']);
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
}
