import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectsRequest } from '../../../models';
import { AuthenticationService, CustomvalidationService } from '../../../services';
import { first } from 'rxjs/operators';
import { ProjectsApi, CustomersApi, EmployeeApi } from '../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditproject',
  templateUrl: './addeditproject.component.html',
  styleUrls: ['./addeditproject.component.css']
})
export class AddeditProjectComponent implements OnInit {
  @Input() projectListObj: any;
  @Output() closeProjectUIModalEvent: EventEmitter<any> = new EventEmitter();

  addEditProjectFrm: FormGroup;
  submitted = false;
  projectObj: ProjectsRequest;
  customersList: any;
  UserId: number;
  loading = false;
  ProjectTypes: any;
  selectedProjectType: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private projectsApi: ProjectsApi,
    private customersApi: CustomersApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private employeeApi: EmployeeApi,
    private customvalidationService: CustomvalidationService,
  ) {
    this.projectObj = new ProjectsRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.getAllCustomersList();
    this.empProjectsControls();
    this.editProjectData();
  }

  private editProjectData() {
    if (this.projectListObj !== undefined && this.projectListObj.id > 0) {
      this.projectObj = this.projectListObj;
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
          this.ProjectTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.PROJECTTYPE);
          this.selectedProjectType = this.ProjectTypes[0].value;
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  get f() { return this.addEditProjectFrm.controls; }

  private empProjectsControls() {
    this.addEditProjectFrm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z]+(?: [a-z|A-Z]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      customerId: ['', Validators.required],
      description: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      isActive: ['', Validators.required],
      typeId: ['', Validators.required]
    });
  }

  getAllCustomersList() {
    this.customersApi.getAllCustomersByNames(true).pipe(first()).subscribe(customersRes => {
      if (customersRes && customersRes['flag'] === 1) {
        if (customersRes['data'] && customersRes['data'].length > 0) {
          customersRes['data'].map((customerDropdownRes) => {
            customerDropdownRes.value = customerDropdownRes.id; delete customerDropdownRes.id;
            customerDropdownRes.label = customerDropdownRes.name; delete customerDropdownRes.name;
          });
          this.customersList = customersRes['data'];
        }
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmitaddEditProjectFrm() {
    this.submitted = true;
    if (this.addEditProjectFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.projectObj = this.addEditProjectFrm.value;
      if (this.projectListObj !== undefined && this.projectListObj.id > 0) {
        this.projectObj.id = this.projectListObj.id;
        this.projectObj.modifiedBy = this.UserId;
        this.projectObj.customerId = parseInt(this.addEditProjectFrm.value.customerId, 10);
        this.addeditProjectData(this.projectObj);
      } else {
        this.projectObj.createdBy = this.UserId;
        this.projectObj.customerId = parseInt(this.addEditProjectFrm.value.customerId, 10);
        this.addeditProjectData(this.projectObj);
      }
    }
  }

  private addeditProjectData(projectRequestData: any) {
    this.projectsApi.addEditProjectsObjDetails(projectRequestData).subscribe(res => {
      if (res && (res['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.closeProjectUIModalEvent.emit(res['flag']);
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
