import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HolidaysRequest } from '../../../models/holidaysrequest';
import { CustomvalidationService, NotificationService, AuthenticationService } from '../../../services';
import { DatePipe } from '@angular/common';
import { HolidaysApi, EmployeeApi } from '../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditholiday',
  templateUrl: './addeditholiday.component.html',
  styleUrls: ['./addeditholiday.component.css']
})
export class AddeditholidayComponent implements OnInit {
  @Input() holidayListObj: any;
  @Input() holidayTitlesArr: any;
  @Output() closeHolidayUIModalEvent: EventEmitter<any> = new EventEmitter();

  addEditHolidayFrm: FormGroup;
  submitted = false;
  holidaysObj: HolidaysRequest;
  loading = false;
  holidayTitle: string;
  UserId: any;
  error: any;
  holidayData: any;
  holidayListArr: any = [];
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private holidaysApi: HolidaysApi,
    private messageService: MessageService,
    private customvalidationService: CustomvalidationService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    public datepipe: DatePipe,
    private employeeApi: EmployeeApi,
  ) {
    this.holidaysObj = new HolidaysRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.holidayControls();
    this.editHolidayData();
  }

  private holidayControls() {
    this.addEditHolidayFrm = this.formBuilder.group({
      title: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      tDate: ['', Validators.required],
      description: ['', this.customvalidationService.cannotContainSpace],
      isActive: ['', Validators.required]
    }, {
      validator: this.customvalidationService.DateValidator
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

  get f() { return this.addEditHolidayFrm.controls; }

  private editHolidayData() {
    if (this.holidayListObj !== undefined && this.holidayListObj.id > 0) {
      this.holidaysObj = this.holidayListObj;
      this.holidayTitle = this.holidaysObj.title;
      this.holidaysObj.tDate = this.datepipe.transform(this.holidaysObj.date, 'yyyy-MM-dd');
    }
  }

  onSubmitaddEditHolidayFrm() {
    this.submitted = true;
    if (this.addEditHolidayFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.holidaysObj = this.addEditHolidayFrm.value;
      if (this.holidayListObj !== undefined && this.holidayListObj.id > 0) {
        if (this.holidayTitle !== this.holidaysObj.title) {
          const titleExist = this.holidayTitlesArr.filter(t => t === this.addEditHolidayFrm.value.title);
          if (titleExist && titleExist.length !== 0) {
            this.messageService.add({
              key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
              detail: 'Title already exist.'
            });
            this.loading = false;
            return;
          }
        }
        this.holidaysObj.id = this.holidayListObj.id;
        this.holidaysObj.date = this.datepipe.transform(this.holidaysObj.tDate, 'yyyy-MM-dd');
        this.holidaysObj.modifiedBy = this.UserId;
        this.addeditHolidayData(this.holidaysObj);
      } else {
        const titleExist = this.holidayTitlesArr.filter(t => t === this.addEditHolidayFrm.value.title);
        if (titleExist && titleExist.length !== 0) {
          this.messageService.add({
            key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
            detail: 'Title already exist.'
          });
          this.loading = false;
          return;
        }
        this.holidaysObj.date = this.datepipe.transform(this.holidaysObj.tDate, 'yyyy-MM-dd');
        this.holidaysObj.createdBy = this.UserId;
        this.addeditHolidayData(this.holidaysObj);
      }
    }
  }

  private addeditHolidayData(holidayRequestData: any) {
    this.holidaysApi.addEditholidaysObjDetails(holidayRequestData).subscribe(res => {
      if (res && (res['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.closeHolidayUIModalEvent.emit(res['flag']);
        this.notificationService.refreshNotification.next(true);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: res['message']
        });
      }
    }, error => {
      this.error = error;
      console.log(this.error);
    });
  }
}
