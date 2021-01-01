import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeDesignationRequest } from '../../../../models/employeedesignationrequest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../../../../services';
import { EmployeeApi, DesignationMasterApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditdesignation',
  templateUrl: './addeditdesignation.component.html',
  styleUrls: ['./addeditdesignation.component.css']
})
export class AddeditdesignationComponent implements OnInit {
  @Input() employeeId: any;
  @Input() designationListObj: any;
  @Output() closeDesignationUIModalEvent: EventEmitter<any> = new EventEmitter();

  empAddEditDesignationFrm: FormGroup;
  submitted = false;
  employeeDesignation: EmployeeDesignationRequest;
  isNeedToRenderIsActiveLable: boolean = false;
  employeeDesignationList: any;
  loading = false;
  UserId: any;
  error: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private designationMasterApi: DesignationMasterApi,
    private messageService: MessageService,
  ) {
    this.employeeDesignation = new EmployeeDesignationRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empDesignationControls();
    this.getAllDesignations();
    this.addEditDesignationDetails();
  }

  addEditDesignationDetails() {
    if (this.designationListObj !== undefined && this.designationListObj.id > 0) {
      this.employeeDesignation = this.designationListObj;
      const designationDateArr = [];
      designationDateArr.push(new Date(this.employeeDesignation.fromDate));
      designationDateArr.push(new Date(this.employeeDesignation.toDate));
      this.employeeDesignation.range = designationDateArr;
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

  get f() { return this.empAddEditDesignationFrm.controls; }

  private empDesignationControls() {
    this.empAddEditDesignationFrm = this.formBuilder.group({
      designationId: ['', Validators.required],
      range: [null, Validators.required],
      isActive: ['', Validators.required],
    });
  }

  getAllDesignations() {
    this.designationMasterApi.getAllDesignationsByNames(true).pipe(first()).subscribe(employeeDesignationListResponse => {
      if (employeeDesignationListResponse && (employeeDesignationListResponse['flag'] === 1)) {
        if (employeeDesignationListResponse['data'] && employeeDesignationListResponse['data'].length > 0) {
          this.employeeDesignationList = employeeDesignationListResponse['data'].filter(s => s.isActive === this.selectedIsActiveType);
          if (this.employeeDesignationList && this.employeeDesignationList.length > 0) {
            this.employeeDesignationList.map((designationsDropdownRes) => {
              designationsDropdownRes.value = designationsDropdownRes.id; delete designationsDropdownRes.id;
              designationsDropdownRes.label = designationsDropdownRes.name; delete designationsDropdownRes.name;
            });
            this.employeeDesignationList = this.employeeDesignationList;
          }
        }
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmitEmpAddEditDesignationFrm() {
    this.submitted = true;
    if (this.empAddEditDesignationFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.employeeDesignation = this.empAddEditDesignationFrm.value;
      this.employeeDesignation.employeeId = parseInt(this.employeeId, 10);
      this.employeeDesignation.designationId = parseInt(this.empAddEditDesignationFrm.value.designationId, 10);
      this.employeeDesignation.fromDate = this.datepipe.transform(this.employeeDesignation.range[0], 'yyyy-MM-dd');
      this.employeeDesignation.toDate = this.datepipe.transform(this.employeeDesignation.range[1], 'yyyy-MM-dd');
      if (this.designationListObj !== undefined && this.designationListObj.id > 0) {
        this.employeeDesignation.id = this.designationListObj.id;
        this.employeeDesignation.employeeId = parseInt(this.employeeId, 10);
        this.employeeDesignation.modifiedBy = this.UserId;
        this.addeditEmployeeDesignation(this.employeeDesignation);
      } else {
        this.employeeDesignation.createdBy = this.UserId;
        this.addeditEmployeeDesignation(this.employeeDesignation);
      }
    }
  }

  private addeditEmployeeDesignation(employeeDesignationObj: any) {
    this.employeeApi.addEditEmployeeDesignation(employeeDesignationObj).pipe(first())
      .subscribe(addEditEmployeeDesignationResponse => {
        if (addEditEmployeeDesignationResponse && (addEditEmployeeDesignationResponse['flag'] === 1)) {
          this.loading = false;
          this.messageService.add({
            key: 'commonMsg', severity: 'success', summary: 'Success Message',
            detail: addEditEmployeeDesignationResponse['message']
          });
          this.closeDesignationUIModalEvent.emit(addEditEmployeeDesignationResponse['flag']);
        } else {
          this.loading = false;
          this.messageService.add({
            key: 'commonMsg', severity: 'error', summary: 'Error Message',
            detail: addEditEmployeeDesignationResponse['message']
          });
        }
      }, error => {
        this.loading = false;
        console.log(error);
      });
  }

}
