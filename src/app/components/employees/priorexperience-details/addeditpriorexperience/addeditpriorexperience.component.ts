import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeePriorExperienceRequest } from '../../../../models/emppriorexperiencerequest';
import { DatePipe } from '@angular/common';
import { AuthenticationService, CustomvalidationService } from '../../../../services';
import { DesignationMasterApi, DepartmentApi, EmployeeApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditpriorexperience',
  templateUrl: './addeditpriorexperience.component.html',
  styleUrls: ['./addeditpriorexperience.component.css']
})
export class AddeditPriorExperienceComponent implements OnInit {
  @Input() employeeId: any;
  @Input() priorExpListObj: any;
  @Output() closePriorExperienceUIModalEvent: EventEmitter<any> = new EventEmitter();

  empAddEditPriorExpFrm: FormGroup;
  submitted = false;
  employeePriorExperience: EmployeePriorExperienceRequest;
  employeeDepertmentList: any;
  employeeDesignationList: any;
  loading = false;
  UserId: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeApi: EmployeeApi,
    private designationMasterApi: DesignationMasterApi,
    public datepipe: DatePipe,
    private authenticationService: AuthenticationService,
    private departmentApi: DepartmentApi,
    private messageService: MessageService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.employeePriorExperience = new EmployeePriorExperienceRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empAddressControls();
    this.departmentData();
    this.designationData();
    this.addEditPriorExpDetails();
  }

  departmentData() {
    this.departmentApi.getAllDepartmentsByNames(true).subscribe(res => {
      this.employeeDepertmentList = res['data'].filter(s => s.isActive === this.selectedIsActiveType);
      if (this.employeeDepertmentList && this.employeeDepertmentList.length > 0) {
        this.employeeDepertmentList.map((departmentsDropdownRes) => {
          departmentsDropdownRes.value = departmentsDropdownRes.id;
          departmentsDropdownRes.label = departmentsDropdownRes.name;
        });
        this.employeeDepertmentList = this.employeeDepertmentList;
      }
    });
  }

  designationData() {
    this.designationMasterApi.getAllDesignationsByNames(true).subscribe(results => {
      this.employeeDesignationList = results['data'].filter(s => s.isActive === this.selectedIsActiveType);
      if (this.employeeDesignationList && this.employeeDesignationList.length > 0) {
        this.employeeDesignationList.map((designationsDropdownRes) => {
          designationsDropdownRes.value = designationsDropdownRes.id;
          designationsDropdownRes.label = designationsDropdownRes.name;
        });
        this.employeeDesignationList = this.employeeDesignationList;
      }
    });
  }

  addEditPriorExpDetails() {
    if (this.priorExpListObj !== undefined && this.priorExpListObj.id > 0) {
      this.employeePriorExperience = this.priorExpListObj;
      const leaveDateArr = [];
      leaveDateArr.push(new Date(this.employeePriorExperience.dateOfJoining));
      leaveDateArr.push(new Date(this.employeePriorExperience.dateOfLeaving));
      this.employeePriorExperience.range = leaveDateArr;
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

  private empAddressControls() {
    this.empAddEditPriorExpFrm = this.formBuilder.group({
      office: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      departmentId: ['', Validators.required],
      designationId: ['', Validators.required],
      range: [null, Validators.required],
      experience: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      isActive: [''],
    });
  }

  get f() { return this.empAddEditPriorExpFrm.controls; }

  onSubmitEmpAddEditPriorExpFrm() {
    this.submitted = true;
    if (this.empAddEditPriorExpFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.employeePriorExperience = this.empAddEditPriorExpFrm.value;
      if (this.priorExpListObj !== undefined && this.priorExpListObj.id > 0) {
        this.employeePriorExperience.id = this.priorExpListObj.id;
        this.employeePriorExperience.employeeId = parseInt(this.employeeId, 10);
        this.employeePriorExperience.experience = this.empAddEditPriorExpFrm.value.experience;
        this.employeePriorExperience.departmentId = parseInt(this.empAddEditPriorExpFrm.value.departmentId, 10);
        this.employeePriorExperience.designationId = parseInt(this.empAddEditPriorExpFrm.value.designationId, 10);
        this.employeePriorExperience.dateOfJoining = this.datepipe.transform(this.employeePriorExperience.range[0], 'yyyy-MM-dd');
        this.employeePriorExperience.dateOfLeaving = this.datepipe.transform(this.employeePriorExperience.range[1], 'yyyy-MM-dd');
        this.employeePriorExperience.modifiedBy = this.UserId;
        this.addeditEmployeePriorExperience(this.employeePriorExperience);
      } else {
        this.employeePriorExperience.employeeId = parseInt(this.employeeId, 10);
        this.employeePriorExperience.experience = this.empAddEditPriorExpFrm.value.experience;
        this.employeePriorExperience.departmentId = parseInt(this.empAddEditPriorExpFrm.value.departmentId, 10);
        this.employeePriorExperience.designationId = parseInt(this.empAddEditPriorExpFrm.value.designationId, 10);
        this.employeePriorExperience.dateOfJoining = this.datepipe.transform(this.employeePriorExperience.range[0], 'yyyy-MM-dd');
        this.employeePriorExperience.dateOfLeaving = this.datepipe.transform(this.employeePriorExperience.range[1], 'yyyy-MM-dd');
        this.employeePriorExperience.createdBy = this.UserId;
        this.addeditEmployeePriorExperience(this.employeePriorExperience);
      }
    }
  }

  private addeditEmployeePriorExperience(employeePriorExpDetails: any): void {
    this.employeeApi.addEditEmployeePriorExperienceDetails(employeePriorExpDetails).subscribe(empPriorExpRes => {
      if (empPriorExpRes && (empPriorExpRes['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: empPriorExpRes['message']
        });
        this.closePriorExperienceUIModalEvent.emit(empPriorExpRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: empPriorExpRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

}
