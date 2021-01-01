import { Component, OnInit } from '@angular/core';
import { ProjectsApi, TimeSheetApi } from '../../../../shared/api';
import { SpinnerService, AuthenticationService, CustomvalidationService } from './../../../../services';
import { NamesApiRequest, AddEmployeeTimesheetRequest } from './../../../../models';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee-timesheet',
  templateUrl: './add-employee-timesheet.component.html',
  styleUrls: ['./add-employee-timesheet.component.css']
})
export class AddEmployeeTimesheetComponent implements OnInit {
  projects: NamesApiRequest[];
  addEmployeeTimesheetRequest: AddEmployeeTimesheetRequest;
  modules: any;
  addForm: FormGroup;
  selectDateform: FormGroup;
  addMoreRowsFrm: FormGroup;
  rows: FormArray;
  submitted = false;
  loading = false;
  valuesInRowIndex: any = [];
  moduleNames: any;
  testData: any;
  checkBrowser: boolean;
  isTimeGreater = false;
  selectedIndex: any;
  timeIsEqual = false;
  isValidTime = false;
  getDiff: any;

  constructor(
    private projectsApi: ProjectsApi,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    public router: Router,
    private timeSheetApi: TimeSheetApi,
    private customvalidationService: CustomvalidationService,
  ) {
    this.addEmployeeTimesheetRequest = new AddEmployeeTimesheetRequest();
  }

  ngOnInit(): void {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      this.checkBrowser = false; // if Firefox
    } else {
      this.checkBrowser = true; // if Chrome
    }
    this.addForm = this.fb.group({
      addTimeSheetArr: this.fb.array([this.createItemFormGroup()])
    });
    this.selectDateform = this.fb.group({
      date: new FormControl(new Date())
    });
    this.addMoreRowsFrm = this.fb.group({
      rowNumber: [null]
    });
    this.getAllProjects();
    this.getAllModules();
  }

  get f() { return this.addForm.controls; }
  get t() { return this.f.addTimeSheetArr as FormArray; }

  getAllProjects(): void {
    this.projectsApi.getAllProjectsByNames(true).subscribe(res => {
      if (res && res['flag'] === 1) {
        if (res['data'] && res['data'].length > 0) {
          res['data'].map((data) => {
            data.value = data.id;
            data.label = data.name;
          });
          this.projects = res['data'];
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getAllModules(): void {
    this.projectsApi.getAllModuleNames().subscribe(res => {
      if (res && res['flag'] === 1) {
        this.moduleNames = res['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  fetchModuleBasedOnProject(projectId: number, i: number) {
    if (projectId !== null) {
      this.testData = this.moduleNames.filter(id => id.projectId === projectId);
      this.testData.map((data) => {
        data.label = data.moduleName;
        data.value = data.moduleId;
      });
      const setModuleDetails = this.addForm.controls.addTimeSheetArr as FormArray;
      setModuleDetails.controls[i]['controls'].moduleNameOptions.setValue(this.testData);
    } else {
      this.messageService.add({
        key: 'commonMsg', severity: 'error', summary: 'Error',
        detail: 'Project not found.'
      });
    }
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      projectId: ['', Validators.required],
      moduleNameOptions: [''],
      moduleId: ['', Validators.required],
      task: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      billableHours: ['', Validators.compose([
        Validators.required,
        Validators.pattern('\\d{1,3}\\.?\\d{0,3}')]
      )],
      nonBillableHours: ['', Validators.compose([
        Validators.required,
        Validators.pattern('\\d{1,3}\\.?\\d{0,3}')]
      )],
      startTime: ['', Validators.required],
      finishTime: ['', Validators.required],
      description: [''],
      timedifference: ['']
    });
  }

  addMoreRows() {
    this.rows = this.addForm.get('addTimeSheetArr') as FormArray;
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  validateTime(index) {
    const addTimeSheetArrValue = this.addForm.controls.addTimeSheetArr as FormArray;
    const startTimeValue = addTimeSheetArrValue['controls'][index]['controls']['startTime'].value;
    const finishTimeValue = addTimeSheetArrValue['controls'][index]['controls']['finishTime'].value;
    if (startTimeValue && finishTimeValue) {
      const regex = new RegExp(':', 'g');
      const timeStr1 = startTimeValue.toTimeString().slice(0, 5);
      const timeStr2 = finishTimeValue.toTimeString().slice(0, 5);

      const splitTimeString1 = timeStr1.split(':');
      const splitTimeString2 = timeStr2.split(':');

      const minsdiff = parseInt(splitTimeString2[0], 10) * 60 + parseInt(splitTimeString2[1], 10) - parseInt(splitTimeString1[0], 10) * 60 - parseInt(splitTimeString1[1], 10);
      const getHoursAndMinutes = String(100 + Math.floor(minsdiff / 60)).substr(1) + ':' + String(100 + minsdiff % 60).substr(1);

      if (parseInt(timeStr1.replace(regex, ''), 10) === parseInt(timeStr2.replace(regex, ''), 10)) {
        this.isTimeGreater = false;
        this.timeIsEqual = true;
        addTimeSheetArrValue['controls'][index]['controls']['finishTime'].setErrors(null);
        addTimeSheetArrValue['controls'][index]['controls']['timedifference'].setValue(getHoursAndMinutes);
      } else if (parseInt(timeStr1.replace(regex, ''), 10) > parseInt(timeStr2.replace(regex, ''), 10)) {
        this.isTimeGreater = true;
        this.selectedIndex = index;
        addTimeSheetArrValue['controls'][index]['controls']['finishTime'].setErrors({ 'incorrect': true });
        addTimeSheetArrValue['controls'][index]['controls']['timedifference'].setValue('');
      } else {
        this.isValidTime = true;
        this.isTimeGreater = false;
        addTimeSheetArrValue['controls'][index]['controls']['finishTime'].setErrors(null);
        addTimeSheetArrValue['controls'][index]['controls']['timedifference'].setValue(getHoursAndMinutes);
      }
    }
  }

  onSubmitaddTimeSheetFrm() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    } else {
      this.loading = true;
      const timesheetData = this.addForm.controls.addTimeSheetArr.value;
      if (timesheetData && timesheetData.length > 0) {
        for (let index = 0; index < timesheetData.length; index++) {
          const convertBillableHours = parseFloat(timesheetData[index].billableHours);
          const convertNonBillableHours = parseFloat(timesheetData[index].nonBillableHours);
          if (convertBillableHours === 0 && convertNonBillableHours === 0) {
            this.loading = false;
            this.messageService.add({
              key: 'commonMsg', severity: 'warn', summary: 'Warning',
              detail: 'Please add billable hours or non billable hours, both can not be zero.'
            });
            return;
          }
        }
        this.insertMultipleRows(timesheetData);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'warn', summary: 'Warning',
          detail: 'Please fill up atleast one row.'
        });
      }
    }
  }

  private insertMultipleRows(timesheetData: any) {
    timesheetData.forEach((elements: any) => {
      elements.date = this.datepipe.transform(this.selectDateform.controls.date.value, 'yyyy-MM-dd');
      elements.employeeId = this.authenticationService.IsUserId();
      elements.createdBy = this.authenticationService.IsUserId();
      delete elements.moduleNameOptions;
      delete elements.timedifference;
    });
    this.addEmployeeTimesheetRequest = timesheetData;
    this.timeSheetApi.insertMultipleEmployeeTimesheetDetails(this.addEmployeeTimesheetRequest).subscribe(res => {
      if (res && (res['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success',
          detail: res['message']
        });
        this.resetForm();
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error',
          detail: res['message']
        });
      }
    });
  }

  resetForm() {
    this.submitted = false;
    this.t.clear();
    this.addMoreRows();
  }

  addNewRows(valueFromInput, event) {
    this.spinnerService.showSpinner();
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
    promise.then((value) => {
      // Promise returns after 1.5 second!
      const numbers = /^[0-9]+$/;
      if (valueFromInput) {
        if (valueFromInput.match(numbers)) {
          if (valueFromInput === '0' || valueFromInput === '00') {
            this.messageService.add({
              key: 'commonMsg', severity: 'warn', summary: 'Warning',
              detail: 'Please enter number greater than 0.'
            });
          } else {
            for (let i = 0; i < valueFromInput; i++) {
              this.addMoreRows();
            }
            this.messageService.add({
              key: 'commonMsg', severity: 'success', summary: 'Success',
              detail: valueFromInput + ' ' + 'row(s) added successfully.'
            });
          }
        } else if (valueFromInput.includes('-')) {
          this.messageService.add({
            key: 'commonMsg', severity: 'warn', summary: 'Warning',
            detail: 'Please enter number greater than 0.'
          });
          this.addMoreRowsFrm.reset();
          this.spinnerService.hideSpinner();
        } else {
          this.messageService.add({
            key: 'commonMsg', severity: 'warn', summary: 'Warning',
            detail: 'Please input numeric characters only.'
          });
        }
        this.addMoreRowsFrm.reset();
        this.spinnerService.hideSpinner();
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'warn', summary: 'Warning',
          detail: 'Please input numeric characters only.'
        });
        this.addMoreRowsFrm.reset();
        this.spinnerService.hideSpinner();
      }
    });
    event.preventDefault();
  }
}
