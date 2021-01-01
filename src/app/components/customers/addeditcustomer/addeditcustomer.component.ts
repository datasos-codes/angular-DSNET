import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, CustomvalidationService } from '../../../services';
import { DatePipe } from '@angular/common';
import { CustomersRequest } from '../../../models/customersrequest';
import { CustomersApi, EmployeeApi } from '../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditcustomer',
  templateUrl: './addeditcustomer.component.html',
  styleUrls: ['./addeditcustomer.component.css']
})
export class AddeditCustomerComponent implements OnInit {
  @Input() customerListObj: any;
  @Output() closeCustomerUIModalEvent: EventEmitter<any> = new EventEmitter();

  addEditCustomerFrm: FormGroup;
  submitted = false;
  customersObj: CustomersRequest;
  loading = false;
  UserId: any;
  customersPhoneListArr: any;
  phoneNumber: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private customersApi: CustomersApi,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private employeeApi: EmployeeApi,
    private customvalidationService: CustomvalidationService,
  ) {
    this.customersObj = new CustomersRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.customerFrmControls();
    this.customerPhoneNumbers();
    this.editCustomerData();
  }

  private customerFrmControls() {
    this.addEditCustomerFrm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z]+(?: [a-z|A-Z]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      email: ['', [Validators.required,
      Validators.email,
      this.customvalidationService.cannotContainSpace]],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        this.customvalidationService.cannotContainSpace]
      ],
      address: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      isActive: ['', Validators.required]
    });
  }

  get f() { return this.addEditCustomerFrm.controls; }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  customerPhoneNumbers() {
    this.customersApi.getAllCustomersList().subscribe(customersPhonesRes => {
      if (customersPhonesRes && (customersPhonesRes['flag'] === 1)) {
        this.customersPhoneListArr = customersPhonesRes['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  private editCustomerData() {
    if (this.customerListObj !== undefined && this.customerListObj.id > 0) {
      this.customersObj = this.customerListObj;
      this.phoneNumber = this.customersObj.phone;
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

  onSubmitaddEditCustomerFrm() {
    this.submitted = true;
    if (this.addEditCustomerFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.customersObj = this.addEditCustomerFrm.value;
      if (this.customerListObj !== undefined && this.customerListObj.id > 0) {
        if (this.phoneNumber !== this.addEditCustomerFrm.value.phone) {
          const NumberExist = this.customersPhoneListArr.map(pNo => pNo.phone).filter(n => n === this.addEditCustomerFrm.value.phone);
          if (NumberExist && NumberExist.length !== 0) {
            this.loading = false;
            this.messageService.add({
              key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
              detail: 'Phone number already exist.'
            });
            return;
          }
        }
        this.customersObj.id = this.customerListObj.id;
        this.customersObj.modifiedBy = this.UserId;
        this.addeditCustomer(this.customersObj);
      } else {
        const NumberExist = this.customersPhoneListArr.map(pNo => pNo.phone).filter(n => n === this.addEditCustomerFrm.value.phone);
        if (NumberExist && NumberExist.length !== 0) {
          this.loading = false;
          this.messageService.add({
            key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
            detail: 'Phone number already exist.'
          });
          return;
        }
        this.customersObj.createdBy = this.UserId;
        this.addeditCustomer(this.customersObj);
      }
    }
  }

  private addeditCustomer(customersData: any) {
    this.customersApi.addEditCustomerDetails(customersData).subscribe(res => {
      if (res && (res['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.closeCustomerUIModalEvent.emit(res['flag']);
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
