import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, CustomvalidationService } from '../../../services';
import { MessageService } from 'primeng/api';
import { ProjectModuleRequest } from './../../../models';
import { ProjectsApi, EmployeeApi } from '../../../shared/api';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-add-edit-module',
  templateUrl: './add-edit-module.component.html',
  styleUrls: ['./add-edit-module.component.css']
})
export class AddEditModuleComponent implements OnInit {
  @Input() projectModuleListObj: any;
  @Input() onlyProjectName: any;
  @Output() closeProjectModuleUIModalEvent: EventEmitter<any> = new EventEmitter();

  addEditModuleFrm: FormGroup;
  submitted = false;
  UserId: number;
  loading = false;
  projectName: any;
  moduleObj: ProjectModuleRequest;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private projectsApi: ProjectsApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private employeeApi: EmployeeApi,
    private customvalidationService: CustomvalidationService,
  ) {
    this.moduleObj = new ProjectModuleRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empProjectsControls();
    this.editProjectModuleData();
  }

  private editProjectModuleData() {
    if (this.projectModuleListObj !== undefined && this.projectModuleListObj.id > 0) {
      this.moduleObj = this.projectModuleListObj;
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

  get f() { return this.addEditModuleFrm.controls; }

  private empProjectsControls() {
    this.addEditModuleFrm = this.formBuilder.group({
      moduleName: ['', Validators.compose([Validators.required,
      Validators.pattern('^[a-z|A-Z]+(?: [a-z|A-Z]+)*$'),
      this.customvalidationService.cannotContainSpace])],
      projectId: ['', Validators.required],
      description: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      isActive: ['', Validators.required]
    });
  }

  onSubmitaddEditModuleFrm() {
    this.submitted = true;
    if (this.addEditModuleFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.moduleObj = this.addEditModuleFrm.value;
      if (this.projectModuleListObj !== undefined && this.projectModuleListObj.id > 0) {
        this.moduleObj.id = this.projectModuleListObj.id;
        this.moduleObj.modifiedBy = this.UserId;
        this.moduleObj.projectId = parseInt(this.addEditModuleFrm.value.projectId, 10);
        this.addeditModuleData(this.moduleObj);
      } else {
        this.moduleObj.createdBy = this.UserId;
        this.moduleObj.projectId = parseInt(this.addEditModuleFrm.value.projectId, 10);
        this.addeditModuleData(this.moduleObj);
      }
    }
  }

  private addeditModuleData(projectModuleRequestData: any) {
    this.projectsApi.addEditProjectModuleDetails(projectModuleRequestData).subscribe(res => {
      if (res && (res['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: res['message']
        });
        this.closeProjectModuleUIModalEvent.emit(res['flag']);
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
