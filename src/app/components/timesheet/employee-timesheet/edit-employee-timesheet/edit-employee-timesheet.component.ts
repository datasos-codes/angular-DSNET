import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TimeSheetRequest } from '../../../../models/timesheetrequest';
import { AuthenticationService, CustomvalidationService } from '../../../../services';
import { forkJoin } from 'rxjs';
import { ProjectsApi, TimeSheetApi, EmployeeApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-edit-employee-timesheet',
  templateUrl: './edit-employee-timesheet.component.html',
  styleUrls: ['./edit-employee-timesheet.component.css']
})
export class EditEmployeeTimeSheetComponent implements OnInit {
  @Input() editTimesheetDetails: any;
  @Output() closeEmployeeTimeSheetUIModalEvent: EventEmitter<any> = new EventEmitter();

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
  selectedModule: any;
  timeSheetDetails: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private timeSheetApi: TimeSheetApi,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private projectsApi: ProjectsApi,
    private authenticationService: AuthenticationService,
    private employeeApi: EmployeeApi,
    private customvalidationService: CustomvalidationService,
  ) {
    this.timeSheetObj = new TimeSheetRequest();
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.timeSheetObj.isActive = 'Active';
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empAddressControls();
    this.getAllDropdownLists();
    this.getAllModules();
    this.editTimeSheetDetails();
  }

  private empAddressControls() {
    this.addEditTimeSheetFrm = this.formBuilder.group({
      tDate: ['', Validators.required],
      projectId: ['', Validators.required],
      moduleId: ['', Validators.required],
      task: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      description: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      remark: [''],
      billableHours: ['', Validators.compose([
        Validators.required,
        Validators.pattern('\\d{1,3}\\.?\\d{0,3}')]
      )],
      nonBillableHours: ['', Validators.compose([
        Validators.required,
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

  editTimeSheetDetails() {
    // this.editTimesheetDetails = this.config.data.empTimesheetObj;

    if (this.editTimesheetDetails !== undefined && this.editTimesheetDetails.id > 0) {
      this.timeSheetObj = this.editTimesheetDetails;
      this.timeSheetObj.tDate = this.datepipe.transform(this.editTimesheetDetails.date, 'yyyy-MM-dd');
      // start Time
      if (this.editTimesheetDetails.startTime) {
        const startdt = new Date(this.editTimesheetDetails.startTime);
        startdt.setHours(startdt.getHours() - 5);
        startdt.setMinutes(startdt.getMinutes() - 30);
        this.timeSheetObj.TstartTime = new Date(startdt);
      } else {
        this.timeSheetObj.TstartTime = null;
      }
      // finish Time
      if (this.editTimesheetDetails.finishTime) {
        const finishDt = new Date(this.editTimesheetDetails.finishTime);
        finishDt.setHours(finishDt.getHours() - 5);
        finishDt.setMinutes(finishDt.getMinutes() - 30);
        this.timeSheetObj.TfinishTime = new Date(finishDt);
      } else {
        this.timeSheetObj.TfinishTime = null;
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


  getAllDropdownLists() {
    const projects = this.projectsApi.getAllProjectsByNames(true);
    forkJoin([projects]).subscribe(results => {
      this.projectsData = results[0]['data'].filter(s => s.isActive === this.selectedIsActiveType);
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
        this.testData = res['data'].filter(id => id.projectId === this.timeSheetObj.projectId);
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
      this.selectedModule = this.testData[0];
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
      if (this.editTimesheetDetails && this.editTimesheetDetails.id > 0) {
        this.timeSheetObj.id = this.editTimesheetDetails.id;
        this.timeSheetObj.modifiedBy = this.UserId;
        this.timeSheetObj.date = this.datepipe.transform(this.timeSheetObj.tDate, 'yyyy-MM-dd');
        this.timeSheetObj.employeeId = this.authenticationService.IsUserId();
        this.timeSheetObj.projectId = parseInt(this.addEditTimeSheetFrm.value.projectId, 10);
        this.timeSheetObj.moduleId = parseInt(this.addEditTimeSheetFrm.value.moduleId, 10);
        this.timeSheetObj.invoiceId = parseInt(this.addEditTimeSheetFrm.value.invoiceId, 10);
        this.timeSheetObj.startTime = this.addEditTimeSheetFrm.value.TstartTime;
        this.timeSheetObj.finishTime = this.addEditTimeSheetFrm.value.TfinishTime;
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
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: 'Timesheets ID not found.'
        });
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
        this.closeEmployeeTimeSheetUIModalEvent.emit(res['flag']);
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
