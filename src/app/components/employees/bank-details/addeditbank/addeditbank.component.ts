import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeBankAccountRequest } from '../../../../models/employeebankaccountrequest';
import { CustomvalidationService, AuthenticationService } from '../../../../services';
import { EmployeeApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditbank',
  templateUrl: './addeditbank.component.html',
  styleUrls: ['./addeditbank.component.css']
})
export class AddeditbankComponent implements OnInit {
  @Input() employeeId: any;
  @Input() bankListObj: any;
  @Output() closeBankUIModalEvent: EventEmitter<any> = new EventEmitter();

  empAddEditBankAccFrm: FormGroup;
  submitted = false;
  employeeBankAcc: EmployeeBankAccountRequest;
  loading = false;
  UserId: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    private customValidator: CustomvalidationService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.employeeBankAcc = new EmployeeBankAccountRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empBankControls();
    this.addEditBankDetails();
  }

  addEditBankDetails() {
    if (this.bankListObj !== undefined && this.bankListObj.id > 0) {
      this.employeeBankAcc = this.bankListObj;
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

  private empBankControls() {
    this.empAddEditBankAccFrm = this.formBuilder.group({
      bankName: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z]+(?: [a-z|A-Z]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      branchName: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z,-]+(?: [a-z|A-Z,-]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      accountNumber: ['', Validators.compose([
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(15),
        this.customvalidationService.cannotContainSpace
      ])],
      nameAsInAccount: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z]+(?: [a-z|A-Z]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      ifsc: ['', Validators.compose([Validators.required,
      this.customValidator.IFSCPatternValidator(),
      this.customvalidationService.cannotContainSpace])],
      isActive: ['', Validators.required],
    });
  }

  get f() { return this.empAddEditBankAccFrm.controls; }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  onSubmitEmpAddEditBankAccFrm() {
    this.submitted = true;
    if (this.empAddEditBankAccFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.employeeBankAcc = this.empAddEditBankAccFrm.value;
      if (this.bankListObj !== undefined && this.bankListObj.id > 0) {
        this.employeeBankAcc.id = this.bankListObj.id;
        this.employeeBankAcc.employeeId = parseInt(this.employeeId, 10);
        this.employeeBankAcc.modifiedBy = this.UserId;
        this.addeditBankAccountData(this.employeeBankAcc);
      } else {
        this.employeeBankAcc.employeeId = parseInt(this.employeeId, 10);
        this.employeeBankAcc.createdBy = this.UserId;
        this.addeditBankAccountData(this.employeeBankAcc);
      }
    }
  }

  private addeditBankAccountData(employeeBankAccDetails: any): void {
    this.employeeApi.addEditEmployeeBankAccDetails(employeeBankAccDetails).subscribe(bankRes => {
      if (bankRes && (bankRes['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: bankRes['message']
        });
        this.closeBankUIModalEvent.emit(bankRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: bankRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

}
