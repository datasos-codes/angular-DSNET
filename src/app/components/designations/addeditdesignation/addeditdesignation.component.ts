import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DesignationMasterRequest } from '../../../models/designationmasterrequest';
import { AuthenticationService, CustomvalidationService } from '../../../services';
import { DesignationMasterApi, EmployeeApi } from '../../../shared/api';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { DropDownTypes } from '../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditdesignation',
  templateUrl: './addeditdesignation.component.html',
  styleUrls: ['./addeditdesignation.component.css']
})
export class AddeditdesignationComponent implements OnInit {
  @Input() designationListObj: any;
  @Output() closeDesignationUIModalEvent: EventEmitter<any> = new EventEmitter();

  addEditDesignationFrm: FormGroup;
  submitted = false;
  designationObj: DesignationMasterRequest;
  loading = false;
  designationTitle: string;
  UserId: any;
  designationData: any;
  allDesignationNames: any;
  IsActiveTypes: any;
  selectedIsActiveType: any;

  constructor(
    private formBuilder: FormBuilder,
    private designationMasterApi: DesignationMasterApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private employeeApi: EmployeeApi,
    private customvalidationService: CustomvalidationService,
  ) {
    this.designationObj = new DesignationMasterRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empAddressControls();
    this.getAllDesignationsList();
    this.editDesignationModuleData();
  }

  get f() { return this.addEditDesignationFrm.controls; }

  private empAddressControls() {
    this.addEditDesignationFrm = this.formBuilder.group({
      designation: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      description: ['', this.customvalidationService.cannotContainSpace],
      isActive: ['', Validators.required]
    });
  }

  private editDesignationModuleData() {
    if (this.designationListObj !== undefined && this.designationListObj.id > 0) {
      this.designationObj = this.designationListObj;
      this.designationTitle = this.designationObj.designation;
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

  getAllDesignationsList() {
    this.designationMasterApi.getAllEmployeeDesignation().pipe(first()).subscribe(designationRes => {
      if (designationRes && designationRes['flag'] === 1) {
        this.designationData = designationRes['data'];
        this.allDesignationNames = this.designationData.map(d => d.designation);
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmitaddEditDesignationFrm() {
    this.submitted = true;
    if (this.addEditDesignationFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.designationObj = this.addEditDesignationFrm.value;
      if (this.designationListObj !== undefined && this.designationListObj.id > 0) {
        if (this.designationTitle !== this.designationObj.designation) {
          const titleExist = this.allDesignationNames.filter(t => t === this.addEditDesignationFrm.value.designation);
          if (titleExist && titleExist.length !== 0) {
            this.messageService.add({
              key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
              detail: 'Designation already exist.'
            });
            this.loading = false;
            return;
          }
        }
        this.designationObj.id = this.designationListObj.id;
        this.designationObj.modifiedBy = this.UserId;
        this.addeditDesignationData(this.designationObj);
      } else {
        const titleExist = this.allDesignationNames.filter(t => t === this.addEditDesignationFrm.value.designation);
        if (titleExist && titleExist.length !== 0) {
          this.messageService.add({
            key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
            detail: 'Designation already exist.'
          });
          this.loading = false;
          return;
        }
        this.designationObj.createdBy = this.UserId;
        this.addeditDesignationData(this.designationObj);
      }
    }
  }

  private addeditDesignationData(designationRequestData: any) {
    this.designationMasterApi.addEditDesignationDetails(designationRequestData).subscribe(addDesignationRes => {
      if (addDesignationRes && (addDesignationRes['flag'] === 1)) {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: addDesignationRes['message']
        });
        this.closeDesignationUIModalEvent.emit(addDesignationRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: addDesignationRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }
}
