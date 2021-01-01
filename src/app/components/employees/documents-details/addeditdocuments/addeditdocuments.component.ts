import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeDocumentRequest } from '../../../../models/employeedocumentrequest';
import { EmployeeService, AuthenticationService, CustomvalidationService } from '../../../../services';
import { EmployeeApi } from '../../../../shared/api';
import { MessageService } from 'primeng/api';
import { DropDownTypes } from '../../../../shared/constances/dropdowntypes';

@Component({
  selector: 'app-addeditdocuments',
  templateUrl: './addeditdocuments.component.html',
  styleUrls: ['./addeditdocuments.component.css']
})
export class AddeditdocumentsComponent implements OnInit {
  @Input() employeeId: any;
  @Input() documentListObj: any;
  @Output() closeDocumentUIModalEvent: EventEmitter<any> = new EventEmitter();

  empAddEditDocumentFrm: FormGroup;
  submitted = false;
  employeeDocument: EmployeeDocumentRequest;
  fileObj: any;
  isNeedToRenderIsActiveLable: boolean = false;
  loading = false;
  UserId: any;
  localstorageData: any;
  selectedIsActiveType: any;
  IsActiveTypes: any;
  DocumentTypes: any;
  selectedDocumentType: any;
  selectedInactive: any;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private employeeApi: EmployeeApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.employeeDocument = new EmployeeDocumentRequest();
  }

  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.getDropDownNamesByTypes();
    this.empDocumentControls();
    this.addEditDocumentDetails();
  }

  addEditDocumentDetails() {
    if (this.documentListObj !== undefined && this.documentListObj.id > 0) {
      this.isNeedToRenderIsActiveLable = true;
      this.employeeDocument = this.documentListObj;
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
          this.DocumentTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.DOCUMENTTYPE);
          this.selectedDocumentType = this.DocumentTypes[0].value;
          this.IsActiveTypes = dropdownNameRes['data'].filter(data => data.type === DropDownTypes.ISACTIVETYPE);
          this.selectedIsActiveType = this.IsActiveTypes[0].value;
          this.selectedInactive = this.IsActiveTypes[1].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  private empDocumentControls() {
    this.empAddEditDocumentFrm = this.formBuilder.group({
      title: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      fileName: ['', Validators.required],
      typeId: ['', Validators.required],
      isActive: ['', Validators.required],
    });
  }

  get f() { return this.empAddEditDocumentFrm.controls; }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.fileObj = event.target.files[0];
    }
  }

  onSubmitempAddEditDocumentFrm() {
    this.submitted = true;
    if (this.documentListObj !== undefined && this.documentListObj.id > 0) {
      this.empAddEditDocumentFrm.controls.fileName.clearValidators();
      this.empAddEditDocumentFrm.controls.fileName.updateValueAndValidity();
    } else {
      this.empAddEditDocumentFrm.controls.fileName.setValidators(Validators.required);
      this.empAddEditDocumentFrm.controls.fileName.updateValueAndValidity();
    }
    if (this.empAddEditDocumentFrm.invalid) {
      return;
    } else {
      this.loading = true;
      if (this.documentListObj !== undefined && this.documentListObj.id > 0 && this.fileObj === undefined) {
        const formData: FormData = new FormData();
        formData.append('file', this.fileObj);
        formData.append('id', this.documentListObj.id);
        formData.append('employeeId', this.employeeId);
        formData.append('typeId', this.empAddEditDocumentFrm.value.typeId);
        formData.append('title', this.empAddEditDocumentFrm.value.title);
        this.employeeDocument.isActive = this.empAddEditDocumentFrm.value.isActive === this.selectedIsActiveType
          ? this.selectedIsActiveType : this.selectedInactive;
        formData.append('isActive', this.employeeDocument.isActive);
        formData.append('modifiedBy', this.UserId);
        const notMatchExtension = this.checProfileImage();
        if (notMatchExtension === true) {
          this.loading = false;
          return;
        }
        this.addeditEmployeeDocument(formData);
      } else if (this.documentListObj !== undefined && this.documentListObj.id > 0 && this.fileObj !== undefined) {
        const formData = new FormData();
        formData.append('file', this.fileObj);
        formData.append('id', this.documentListObj.id);
        formData.append('employeeId', this.employeeId);
        formData.append('typeId', this.empAddEditDocumentFrm.value.typeId);
        formData.append('title', this.empAddEditDocumentFrm.value.title);
        this.employeeDocument.isActive = this.empAddEditDocumentFrm.value.isActive === this.selectedIsActiveType
          ? this.selectedIsActiveType : this.selectedInactive;
        formData.append('isActive', this.employeeDocument.isActive);
        formData.append('modifiedBy', this.UserId);
        const notMatchExtension = this.checProfileImage();
        if (notMatchExtension === true) {
          this.loading = false;
          return;
        }
        this.addeditEmployeeDocument(formData);
      } else {
        const formData = new FormData();
        formData.append('file', this.fileObj);
        formData.append('employeeId', this.employeeId);
        formData.append('typeId', this.empAddEditDocumentFrm.value.typeId);
        formData.append('title', this.empAddEditDocumentFrm.value.title);
        formData.append('isActive', this.selectedIsActiveType);
        formData.append('createdBy', this.UserId);
        const notMatchExtension = this.checProfileImage();
        if (notMatchExtension === true) {
          this.loading = false;
          return;
        }
        this.addeditEmployeeDocument(formData);
      }
    }
  }

  private checProfileImage() {
    if (this.empAddEditDocumentFrm.value.typeId === 'Profile photo') {
      const fileName = this.fileObj !== undefined ? this.fileObj.name : this.documentListObj.fileName;
      const idxDot = fileName.lastIndexOf('.') + 1;
      const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
      } else {
        this.messageService.add({
          key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
          detail: 'Only jpg/jpeg and png files are allowed in profile photo!'
        });
        return true;
      }
    }
  }

  private addeditEmployeeDocument(employeeDocumentDetail: any): void {
    this.employeeApi.addEditDocumentDetails(employeeDocumentDetail).subscribe(empDocumentRes => {
      if (empDocumentRes && (empDocumentRes['flag'] === 1)) {
        this.loading = false;
        if ((this.UserId === empDocumentRes['data'].userId) && empDocumentRes['data'].typeId === 'Profile photo') {
          this.localstorageData = JSON.parse(localStorage.getItem('currentUser'));
          this.localstorageData.data.path = empDocumentRes['data'].url;
          localStorage.setItem('currentUser', JSON.stringify(this.localstorageData));
          this.employeeService.refreshProfileImage.next(true);
        }
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: empDocumentRes['message']
        });
        this.closeDocumentUIModalEvent.emit(empDocumentRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: empDocumentRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }
}


