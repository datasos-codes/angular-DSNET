import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeAddressRequest } from '../../../../models/employeeaddressrequest';
import { AuthenticationService, CustomvalidationService } from '../../../../services';
import { EmployeeApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditaddress',
  templateUrl: './addeditaddress.component.html',
  styleUrls: ['./addeditaddress.component.css'],
})
export class AddeditaddressComponent implements OnInit {
  @Input() employeeId: any;
  @Input() addressListObj: any;
  @Output() closeAddressUIModalEvent: EventEmitter<any> = new EventEmitter();

  empAddEditAddressFrm: FormGroup;
  submitted = false;
  employeeAddress: EmployeeAddressRequest;
  isNeedToRenderIsActiveLable = false;
  loading = false;
  UserId: any;
  addressDialogHeader: string;
  AddressTypes: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;
  selectedAddressType: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.employeeAddress = new EmployeeAddressRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empAddressControls();
    this.addEditAddressDetails();
  }

  addEditAddressDetails() {
    if (this.addressListObj !== undefined && this.addressListObj.id > 0) {
      this.employeeAddress = this.addressListObj;
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
          this.AddressTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ADDRESSTYPE);
          this.selectedAddressType = this.AddressTypes[0].value;
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  private empAddressControls() {
    this.empAddEditAddressFrm = this.formBuilder.group({
      address1: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      state: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      city: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      pincode: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(8),
        this.customvalidationService.cannotContainSpace
      ])],
      typeId: ['', Validators.required],
      isActive: ['', Validators.required],
    });
  }

  get f() { return this.empAddEditAddressFrm.controls; }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  onSubmitEmpAddEditAddressFrm() {
    this.submitted = true;
    if (this.empAddEditAddressFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.isNeedToAddorEditEmployeeAddress(this.empAddEditAddressFrm.value);
    }
  }

  private isNeedToAddorEditEmployeeAddress(isEmpAddresData: any): void {
    this.employeeAddress = isEmpAddresData;
    if (this.addressListObj !== undefined && this.addressListObj.id > 0) {
      this.employeeAddress.id = this.addressListObj.id;
      this.employeeAddress.employeeId = parseInt(this.employeeId, 10);
      this.employeeAddress.modifiedBy = this.UserId;
      this.addeditEmployeeAddress(this.employeeAddress);
    } else {
      this.employeeAddress.employeeId = parseInt(this.employeeId, 10);
      this.employeeAddress.createdBy = this.UserId;
      this.addeditEmployeeAddress(this.employeeAddress);
    }
  }

  private addeditEmployeeAddress(employeeAddressDetails: any): void {
    this.employeeApi.addEditEmployeeAddressDetails(employeeAddressDetails).subscribe(addRes => {
      if (addRes && (addRes['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: addRes['message']
        });
        this.closeAddressUIModalEvent.emit(addRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: addRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }
}
