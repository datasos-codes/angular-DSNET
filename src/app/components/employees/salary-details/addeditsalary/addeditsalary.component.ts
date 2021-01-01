import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmployeeSalaryRequest } from '../../../../models/employeesalaryrequest';
import { AuthenticationService, CustomvalidationService } from '../../../../services';
import { DatePipe } from '@angular/common';
import { EmployeeApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditsalary',
  templateUrl: './addeditsalary.component.html',
  styleUrls: ['./addeditsalary.component.css']
})
export class AddeditsalaryComponent implements OnInit {
  @Input() employeeId: any;
  @Input() salaryListObj: any;
  @Output() closeSalaryUIModalEvent: EventEmitter<any> = new EventEmitter();

  empAddEditSalaryFrm: FormGroup;
  submitted = false;
  employeeSalary: EmployeeSalaryRequest;
  loading = false;
  UserId: any;
  monthArr: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.employeeSalary = new EmployeeSalaryRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.employeeSalary.retentionPaymentSalaryMonth = 'January';
    this.employeeSalary.nextAppraisalSalaryMonth = 'January';
    this.getDropDownNamesByTypes();
    this.empSalaryControls();
    this.addEditSalaryDetails();
    this.staticDropdown();
  }

  staticDropdown() {
    this.monthArr = [
      {
        label: 'January',
        value: 'January'
      },
      {
        label: 'February',
        value: 'February'
      },
      {
        label: 'March',
        value: 'March'
      },
      {
        label: 'April',
        value: 'April'
      },
      {
        label: 'May',
        value: 'May'
      },
      {
        label: 'June',
        value: 'June'
      },
      {
        label: 'July',
        value: 'July'
      },
      {
        label: 'August',
        value: 'August'
      },
      {
        label: 'September',
        value: 'September'
      },
      {
        label: 'October',
        value: 'October'
      },
      {
        label: 'November',
        value: 'November'
      },
      {
        label: 'December',
        value: 'December'
      },
    ];
  }

  addEditSalaryDetails() {
    if (this.salaryListObj !== undefined && this.salaryListObj.id > 0) {
      this.employeeSalary = this.salaryListObj;
      const salaryDateArr = [];
      salaryDateArr.push(new Date(this.employeeSalary.salaryStart));
      salaryDateArr.push(new Date(this.employeeSalary.salaryEnd));
      this.employeeSalary.range = salaryDateArr;
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

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  private empSalaryControls() {
    this.empAddEditSalaryFrm = this.formBuilder.group({
      salaryAmount: ['', Validators.required],
      retentionBonusPerMonth: ['', Validators.required],
      retentionBonusPayment: ['', Validators.required],
      retentionPaymentSalaryMonth: ['', Validators.required],
      nextAppraisalSalaryMonth: ['', Validators.required],
      isActive: ['', Validators.required],
      range: [null, Validators.required],
    });
  }

  get f() { return this.empAddEditSalaryFrm.controls; }

  onSubmitEmpAddEditSalaryFrm() {
    this.submitted = true;
    if (this.empAddEditSalaryFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.employeeSalary = this.empAddEditSalaryFrm.value;
      if (this.salaryListObj !== undefined && this.salaryListObj.id > 0) {
        this.employeeSalary.id = this.salaryListObj.id;
        this.employeeSalary.employeeId = parseInt(this.employeeId, 10);
        this.employeeSalary.salaryAmount = parseInt(this.empAddEditSalaryFrm.value.salaryAmount, 10);
        this.employeeSalary.retentionBonusPayment = parseInt(this.empAddEditSalaryFrm.value.retentionBonusPayment, 10);
        this.employeeSalary.retentionBonusPerMonth = parseInt(this.empAddEditSalaryFrm.value.retentionBonusPerMonth, 10);
        this.employeeSalary.salaryStart = this.datepipe.transform(this.employeeSalary.range[0], 'yyyy-MM-dd');
        this.employeeSalary.salaryEnd = this.datepipe.transform(this.employeeSalary.range[1], 'yyyy-MM-dd');
        this.employeeSalary.modifiedBy = this.UserId;
        this.addeditEmployeeSalary(this.employeeSalary);
      } else {
        this.employeeSalary.employeeId = parseInt(this.employeeId, 10);
        this.employeeSalary.salaryAmount = parseInt(this.empAddEditSalaryFrm.value.salaryAmount, 10);
        this.employeeSalary.retentionBonusPayment = parseInt(this.empAddEditSalaryFrm.value.retentionBonusPayment, 10);
        this.employeeSalary.retentionBonusPerMonth = parseInt(this.empAddEditSalaryFrm.value.retentionBonusPerMonth, 10);
        this.employeeSalary.salaryStart = this.datepipe.transform(this.employeeSalary.range[0], 'yyyy-MM-dd');
        this.employeeSalary.salaryEnd = this.datepipe.transform(this.employeeSalary.range[1], 'yyyy-MM-dd');
        this.employeeSalary.createdBy = this.UserId;
        this.addeditEmployeeSalary(this.employeeSalary);
      }
    }
  }

  private addeditEmployeeSalary(employeeSalaryDetails: any): void {
    if ((employeeSalaryDetails.salaryAmount) === 0) {
      this.loading = false;
      this.messageService.add({
        key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
        detail: 'Salary amount must be greater than 0.'
      });
      window.scroll(0, 0);
      return;
    }
    this.employeeApi.addEditEmployeeSalaryDetails(employeeSalaryDetails).subscribe(SalaryRes => {
      if (SalaryRes && (SalaryRes['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: SalaryRes['message']
        });
        this.closeSalaryUIModalEvent.emit(SalaryRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: SalaryRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

  resetForm() {
    this.submitted = false;
    this.empAddEditSalaryFrm.reset();
  }
}
