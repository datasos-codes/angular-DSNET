import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeMobileRequest } from '../../../../models/employeemobilerequest';
import { AuthenticationService, CustomvalidationService } from '../../../../services';
import { EmployeeApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditmobile',
  templateUrl: './addeditmobile.component.html',
  styleUrls: ['./addeditmobile.component.css']
})
export class AddeditmobileComponent implements OnInit {
  @Input() employeeId: any;
  @Input() mobileListObj: any;
  @Output() closeMobileUIModalEvent: EventEmitter<any> = new EventEmitter();

  empAddEditMobileFrm: FormGroup;
  submitted = false;
  employeeMobile: EmployeeMobileRequest;
  isNeedToRenderIsActiveLable = false;
  loading = false;
  phoneNumber: any;
  UserId: any;
  empPhoneListArr: any;
  PhoneNumberTypes: any;
  selectedPhoneNumberType: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.employeeMobile = new EmployeeMobileRequest();
  }

  ngOnInit() {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empAddressControls();
    this.employeePhoneNumbers();
    this.addEditAddressDetails();
  }

  addEditAddressDetails() {
    if (this.mobileListObj !== undefined && this.mobileListObj.id > 0) {
      this.employeeMobile = this.mobileListObj;
      this.phoneNumber = this.mobileListObj.phoneNo;
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
          this.PhoneNumberTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.PHONENUMBERTYPE);
          this.selectedPhoneNumberType = this.PhoneNumberTypes[0].value;
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  get f() { return this.empAddEditMobileFrm.controls; }

  private empAddressControls() {
    this.empAddEditMobileFrm = this.formBuilder.group({
      phoneNo: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        this.customvalidationService.cannotContainSpace]
      ],
      typeId: ['', Validators.required],
      isActive: ['', Validators.required],
    });
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  employeePhoneNumbers() {
    this.employeeApi.allEmployeePhoneNumbers().subscribe(allPhonesRes => {
      if (allPhonesRes && (allPhonesRes['flag'] === 1)) {
        this.empPhoneListArr = allPhonesRes['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmitEmpAddEditMobileFrm() {
    this.submitted = true;
    if (this.empAddEditMobileFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.employeeMobile = this.empAddEditMobileFrm.value;
      if (this.mobileListObj !== undefined && this.mobileListObj.id > 0) {
        if (this.phoneNumber !== this.empAddEditMobileFrm.value.phoneNo) {
          const NumberExist = this.empPhoneListArr.map(pNo => pNo.phoneNumber).filter(n => n === this.empAddEditMobileFrm.value.phoneNo);
          if (NumberExist && NumberExist.length !== 0) {
            this.loading = false;
            this.messageService.add({
              key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
              detail: 'Phone number already exist.'
            });
            return;
          }
        }
        this.employeeMobile.id = this.mobileListObj.id;
        this.employeeMobile.employeeId = parseInt(this.employeeId, 10);
        this.employeeMobile.modifiedBy = this.UserId;
        this.addeditEmployeePhone(this.employeeMobile);
      } else {
        const NumberExist = this.empPhoneListArr.map(pNo => pNo.phoneNumber).filter(n => n === this.empAddEditMobileFrm.value.phoneNo);
        if (NumberExist && NumberExist.length !== 0) {
          this.loading = false;
          this.messageService.add({
            key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
            detail: 'Phone number already exist.'
          });
          return;
        }
        this.employeeMobile.employeeId = parseInt(this.employeeId, 10);
        this.employeeMobile.createdBy = this.UserId;
        this.addeditEmployeePhone(this.employeeMobile);
      }
    }
  }

  private addeditEmployeePhone(employeeMobileObj: any): void {
    this.employeeApi.addEditEmployeePhoneDetails(employeeMobileObj).subscribe(mobileRes => {
      if (mobileRes && (mobileRes['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: mobileRes['message']
        });
        this.closeMobileUIModalEvent.emit(mobileRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: mobileRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }
}
