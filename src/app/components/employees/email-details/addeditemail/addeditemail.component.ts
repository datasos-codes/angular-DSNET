import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { EmployeeEmailRequest } from '../../../../models/employeeemailrequest';
import { AuthenticationService, EmployeeService, CustomvalidationService } from '../../../../services';
import { EmployeeApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditemail',
  templateUrl: './addeditemail.component.html',
  styleUrls: ['./addeditemail.component.css']
})
export class AddeditemailComponent implements OnInit {
  @Input() employeeId: any;
  @Input() emailListObj: any;
  @Output() closeEmailUIModalEvent: EventEmitter<any> = new EventEmitter();

  empAddEditEmailFrm: FormGroup;
  submitted = false;
  employeeEmail: EmployeeEmailRequest;
  isNeedToRenderIsActiveLable = false;
  isEmail: any;
  loading = false;
  UserId: any;
  emailListArr: any;
  IsActiveTypes: any;
  selectedEmailType: any;
  selectedIsActiveType: any;
  EmailTypes: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    public employeeService: EmployeeService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.employeeEmail = new EmployeeEmailRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empEmailControls();
    this.employeeEmailIds();
    this.addEditEmailDetails();
  }

  addEditEmailDetails() {
    if (this.emailListObj !== undefined && this.emailListObj.id > 0) {
      this.employeeEmail = this.emailListObj;
      this.isEmail = this.emailListObj.email;
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
          this.EmailTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.EMAILTYPE);
          this.selectedEmailType = this.EmailTypes[0].value;
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  get f() { return this.empAddEditEmailFrm.controls; }

  private empEmailControls() {
    this.empAddEditEmailFrm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, this.customvalidationService.cannotContainSpace])],
      typeId: ['', Validators.required],
      isActive: ['', Validators.required],
    });
  }

  employeeEmailIds() {
    this.employeeApi.allEmployeeEmailIds().subscribe(allEmailIdsRes => {
      if (allEmailIdsRes && (allEmailIdsRes['flag'] === 1)) {
        this.emailListArr = allEmailIdsRes['data'];
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmitEmpAddEditEmailFrm() {
    this.submitted = true;
    if (this.empAddEditEmailFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.employeeEmail = this.empAddEditEmailFrm.value;
      if (this.emailListObj !== undefined && this.emailListObj.id > 0) {
        if (this.isEmail !== this.employeeEmail.email) {
          if (this.emailListArr && this.emailListArr.length > 0) {
            const EmailExist = this.emailListArr.map(e => e.emailId).filter(n => n === this.empAddEditEmailFrm.value.email);
            if (EmailExist && EmailExist.length !== 0) {
              this.messageService.add({
                key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
                detail: 'Email already exist.'
              });
              this.loading = false;
              return;
            }
          }
        }
        this.employeeEmail.id = this.emailListObj.id;
        this.employeeEmail.employeeId = parseInt(this.employeeId, 10);
        this.employeeEmail.modifiedBy = this.UserId;
        this.addeditEmployeeEmail(this.employeeEmail);
      } else {
        if (this.emailListArr && this.emailListArr.length > 0) {
          const EmailExist = this.emailListArr.map(e => e.emailId).filter(n => n === this.empAddEditEmailFrm.value.email);
          if (EmailExist && EmailExist.length !== 0) {
            this.messageService.add({
              key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
              detail: 'Email already exist.'
            });
            this.loading = false;
            window.scroll(0, 0);
            return;
          }
        }
        this.employeeEmail.employeeId = parseInt(this.employeeId, 10);
        this.employeeEmail.createdBy = this.UserId;
        this.addeditEmployeeEmail(this.employeeEmail);
      }
    }
  }

  private addeditEmployeeEmail(employeeEmailObj: any) {
    this.employeeApi.addEditEmployeeEmailDetails(employeeEmailObj).subscribe(emailRes => {
      if (emailRes && (emailRes['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: emailRes['message']
        });
        this.closeEmailUIModalEvent.emit(emailRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: emailRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }
}
