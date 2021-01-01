import { Component, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DocumentsRequest } from '../../../models';
import { DocumentsApi } from '../../../shared/api';
import { AuthenticationService, CustomvalidationService } from '../../../services';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-addeditdocument',
  templateUrl: './addeditdocument.component.html',
  styleUrls: ['./addeditdocument.component.css']
})
export class AddeditdocumentComponent implements OnInit {
  @Input() documentListObj: any;
  @Input() projectNamesList: any;
  @Input() IsPublicTypes: any;
  @Input() documentsDataRes: any;
  @Input() keyWordTypes: SelectItem[];
  @Output() closeDocumentsUIModalEvent: EventEmitter<any> = new EventEmitter();
  @Output() removeSelectedFile: EventEmitter<any> = new EventEmitter();
  @ViewChild('myInput') myInputVariable: ElementRef;

  addEditDocumentFrm: FormGroup;
  submitted = false;
  loading = false;
  fileObj: any;
  documentsRequestObj: DocumentsRequest;
  UserId: any;
  selectedPublic: any;
  selectedKeywords: string[] = [];
  selectedFileName: any;
  uploadedFiles: any[] = [];
  fileToUpload: any;
  fileExist: boolean = false;
  deleteUpdateFile: boolean = false;
  isNeedToShowPhysicalPath: boolean = false;
  isNeedToDeleteSelectedFile: boolean = false;
  isDocumentName: any;
  projectNamesListRes: any;

  constructor(
    private formBuilder: FormBuilder,
    private documentsApi: DocumentsApi,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.documentsRequestObj = new DocumentsRequest();
  }

  ngOnInit(): void {
    this.documentControls();
    this.editDocumentData();
    this.UserId = this.authenticationService.IsUserId();
    if (this.projectNamesList[0].label === 'All Projects') {
      this.projectNamesList.shift({ label: 'All Projects', value: null });
    }
    if (this.IsPublicTypes[0].label === 'All') {
      this.IsPublicTypes.shift({ label: 'All', value: null });
    }
  }

  private documentControls() {
    this.addEditDocumentFrm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,
      this.customvalidationService.cannotContainSpace])],
      projectId: ['', Validators.required],
      file: [''],
      externalLink: [''],
      keywords: ['', Validators.required],
      isPublic: ['', Validators.required],
      description: ['', Validators.compose([Validators.required,
      this.customvalidationService.cannotContainSpace])],
    });
  }

  get f() { return this.addEditDocumentFrm.controls; }

  private editDocumentData() {
    if (this.documentListObj !== undefined && this.documentListObj.id > 0) {
      this.documentsRequestObj = this.documentListObj;
      this.isDocumentName = this.documentsRequestObj.name;
      this.selectedPublic = this.IsPublicTypes.filter(data => data.value === this.documentListObj.isPublic)[0];
      const convertKeywordsToArr = this.documentListObj.keywords.split(',');
      this.selectedKeywords = convertKeywordsToArr;
    }
  }

  isFileOrExternalLinkNotExistMsg() {
    this.messageService.add({
      key: 'commonMsg', severity: 'warn', summary: 'Warning',
      detail: 'Please add file or external link, both can not be blank.'
    });
    this.loading = false;
    return false;
  }

  isNameExistMsg() {
    this.messageService.add({
      key: 'commonMsg', severity: 'warn', summary: 'Warn Message',
      detail: 'Name already exist.'
    });
    this.loading = false;
    return false;
  }

  onSubmitDocumentFrm() {
    this.submitted = true;
    if (this.addEditDocumentFrm.invalid) {
      return;
    } else {
      this.loading = true;
      if (this.documentListObj === undefined) {
        if (!this.addEditDocumentFrm.value.externalLink && !this.fileObj) {
          if (this.isFileOrExternalLinkNotExistMsg() === false) {
            return;
          }
        }
      } else {
        if ((!this.addEditDocumentFrm.value.externalLink && !this.fileObj && !this.documentListObj.physicalPath) ||
          (!this.addEditDocumentFrm.value.externalLink && !this.fileObj && this.isNeedToShowPhysicalPath)) {
          if (this.isFileOrExternalLinkNotExistMsg() === false) {
            return;
          }
        }
      }
      let formData: FormData = new FormData();
      if (this.documentListObj !== undefined && this.documentListObj.id > 0 && this.fileObj === undefined) {
        if (this.isDocumentName.trim() !== this.addEditDocumentFrm.value.name.trim()) {
          if (this.documentsDataRes && this.documentsDataRes.length > 0) {
            const nameExist = this.documentsDataRes.map(e => e.name).filter(n => n.trim() === this.addEditDocumentFrm.value.name.trim());
            if (nameExist && nameExist.length !== 0) {
              if (this.isNameExistMsg() === false) {
                return;
              }
            }
          }
        }
        formData.append('id', this.documentListObj.id);
        formData.append('file', this.fileObj);
        formData.append('modifiedBy', this.UserId);
      } else if (this.documentListObj !== undefined && this.documentListObj.id > 0 && this.fileObj !== undefined) {
        if (this.isDocumentName.trim() !== this.addEditDocumentFrm.value.name.trim()) {
          if (this.documentsDataRes && this.documentsDataRes.length > 0) {
            const nameExist = this.documentsDataRes.map(e => e.name).filter(n => n.trim() === this.addEditDocumentFrm.value.name.trim());
            if (nameExist && nameExist.length !== 0) {
              if (this.isNameExistMsg() === false) {
                return;
              }
            }
          }
        }
        formData.append('id', this.documentListObj.id);
        formData.append('file', this.fileObj);
        formData.append('modifiedBy', this.UserId);
      } else {
        if (this.documentsDataRes && this.documentsDataRes.length > 0) {
          const nameExist = this.documentsDataRes.map(e => e.name).filter(n => n.trim() === this.addEditDocumentFrm.value.name.trim());
          if (nameExist && nameExist.length !== 0) {
            if (this.isNameExistMsg() === false) {
              return;
            }
          }
        }
        formData.append('file', this.fileObj);
        formData.append('createdBy', this.UserId);
      }
      formData.append('name', this.addEditDocumentFrm.value.name);
      formData.append('projectId', this.addEditDocumentFrm.value.projectId);
      formData.append('externalLink', this.addEditDocumentFrm.value.externalLink ? this.addEditDocumentFrm.value.externalLink : '');
      formData.append('keywords', this.addEditDocumentFrm.value.keywords);
      formData.append('isPublic', this.addEditDocumentFrm.value.isPublic.value);
      formData.append('description', this.addEditDocumentFrm.value.description);
      this.addeditDocumentsData(formData);
    }
  }

  private addeditDocumentsData(documentDetail: any): void {
    this.documentsApi.addEditDocumentsDetails(documentDetail).pipe(first()).subscribe(documentsRes => {
      if (documentsRes && (documentsRes['flag'] === 1)) {
        if (this.isNeedToDeleteSelectedFile === true) {
          this.documentsApi.inUpdateDocumentDeletePhysicalPath(this.documentsRequestObj.id, this.UserId).subscribe((deletePhysicalPath) => {
            if (deletePhysicalPath && (deletePhysicalPath['flag'] === 1)) {
              this.loading = false;
              this.removeSelectedFile.emit(deletePhysicalPath['flag']);
            }
          });
        }
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: documentsRes['message']
        });
        this.closeDocumentsUIModalEvent.emit(documentsRes['flag']);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: documentsRes['message']
        });
      }
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {
      this.fileExist = true;
      this.fileObj = event.target.files[0];
      this.isNeedToShowPhysicalPath = false;
      const reg = /(.*?)\.(jpg|bmp|jpeg|png|docx|doc|pdf|xml|ppt|xls|xlsx|txt|gif|csv|rtf|html|wma|mp3|mpg|flv|avi)$/;
      if (!event.target.files[0].name.match(reg)) {
        this.messageService.add({
          key: 'commonMsg', severity: 'warn', summary: 'Warning',
          detail: 'This file is not allowed, please upload valid file.'
        });
        this.loading = false;
        this.myInputVariable.nativeElement.value = '';
        this.fileExist = false;
        this.fileObj = '';
        return;
      }
    }
  }

  deleteSelectedFile(documentId?: number) {
    if (this.documentListObj && this.documentListObj.physicalPath && this.fileExist === false) {
      this.isNeedToShowPhysicalPath = true;
      this.isNeedToDeleteSelectedFile = true;
    } else if (this.fileObj && this.fileObj.name) {
      this.myInputVariable.nativeElement.value = '';
      this.fileObj = '';
      this.isNeedToShowPhysicalPath = true;
    } else {
      console.log('');
    }
  }

  ValidateExternalLink(externalLinkValue) {
    if (externalLinkValue) {
      const regExp = '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$';
      if (externalLinkValue.toLowerCase().match(regExp)) {
        this.addEditDocumentFrm.controls["externalLink"].clearValidators();
        this.addEditDocumentFrm.controls["externalLink"].updateValueAndValidity();
      } else {
        this.addEditDocumentFrm.controls["externalLink"].setValidators([
          Validators.required,
          , Validators.pattern(regExp)
        ]);
        this.addEditDocumentFrm.controls["externalLink"].updateValueAndValidity();
      }
    }
  }
}
