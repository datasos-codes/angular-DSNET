import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthenticationService, OrganizationService, CustomvalidationService } from '../../../services';
import { PermissionsRequest } from '../../../models';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Table } from 'primeng/table/table';
import { OrganizationApi } from '../../../shared/api/organizationapi';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-editpermisstion',
  templateUrl: './editpermisstion.component.html',
  styleUrls: ['./editpermisstion.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class EditpermisstionComponent implements OnInit {
  @ViewChild('testTable') testTable: Table;
  @Input() permissionListObj: any;
  @Output() closePermissionUIModalEvent: EventEmitter<any> = new EventEmitter();

  editPermisstionFrm: FormGroup;
  UserId: any;
  permissionsRequestObj: PermissionsRequest;
  cols: any[];
  rolepermissions: any = [];
  submitted = false;
  loading = false;
  expandedRowIndex: any;
  rolepermissionsFeatures: any;
  roleId: number;
  localstorageData: any;
  finalArr: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private organizationApi: OrganizationApi,
    private organizationService: OrganizationService,
    private customvalidationService: CustomvalidationService,
  ) {
    this.permissionsRequestObj = new PermissionsRequest();
  }
  ngOnInit(): void {
    this.UserId = this.authenticationService.IsUserId();
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.permissionControls();
    this.cols = [
      { field: 'featureId', header: 'Id' },
      { field: 'featureName', header: 'Screen' },
      { field: 'featureTitle', header: 'Title' },
      { field: 'featureDescription', header: 'Description' }
    ];
    if (this.permissionListObj !== undefined && this.permissionListObj.id > 0) {
      this.fetchPermissionDetails(this.permissionListObj.id);
    }
  }

  permissionControls() {
    this.editPermisstionFrm = this.formBuilder.group({
      roleName: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      roleDescription: ['', [Validators.required, this.customvalidationService.cannotContainSpace]],
      permissions: this.formBuilder.array([])
    });
  }

  private fetchPermissionDetails(permissionId: number) {
    this.organizationApi.getRolePermission(permissionId).pipe(first()).subscribe(rolePermissionRes => {
      if (rolePermissionRes && rolePermissionRes['flag'] === 1) {
        this.permissionsRequestObj = rolePermissionRes['data'];
        this.setPermissionsArrayValue();
      }
    }, error => {
      console.log(error);
    });
  }

  get f() { return this.editPermisstionFrm.controls; }

  setPermissionsArrayValue() {
    const control = <FormArray>this.editPermisstionFrm.controls.permissions;
    this.permissionsRequestObj['permissions'].forEach(permissionsData => {
      control.push(
        this.formBuilder.group({
          featureId: [permissionsData.featureId],
          allowed: [permissionsData.allowed],
          featureName: [permissionsData.featureName],
          featureTitle: [permissionsData.featureTitle],
          featureDescription: [permissionsData.featureDescription],
          features: this.setFeaturesValue(permissionsData)
        })
      );
    });
  }

  setFeaturesValue(permissionsData) {
    const featuresArr = new FormArray([]);
    permissionsData.features.forEach(featuresData => {
      featuresArr.push(this.formBuilder.group({
        isLableValue: featuresData.isLableValue,
        isLableDisplay: featuresData.isLableDisplay
      }));
    });
    return featuresArr;
  }

  onChange(featureObj: any, featureid: number, isChecked: boolean) {
    this.permissionsRequestObj['permissions'].filter(data => data.featureId === featureid)[0].features
      .filter(f => f['isLableDisplay'] === featureObj.isLableDisplay)[0]['isLableValue'] = isChecked;
    this.finalArr = this.permissionsRequestObj['permissions'];
  }

  onSubmitUpdatePermissions() {
    this.submitted = true;
    const formPermissions = this.editPermisstionFrm.value['permissions'];
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < formPermissions.length; index++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.finalArr.length; j++) {
        if (formPermissions[index]['featureId'] === this.finalArr[j]['featureId']) {
          formPermissions[index]['features'] = this.finalArr[j]['features'];
        }
      }
    }
    if (this.editPermisstionFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.permissionsRequestObj = this.editPermisstionFrm.value;
      this.permissionsRequestObj.roleId = this.permissionListObj.id;
      this.permissionsRequestObj.isActive = this.permissionListObj.isActive;
      this.permissionsRequestObj.modifiedBy = this.UserId;
      // When permission data edit form here, it also update into localstorge.
      if (this.permissionsRequestObj.roleId === this.roleId) {
        this.localstorageData = JSON.parse(localStorage.getItem('currentUser'));
        this.localstorageData.permissions = this.permissionsRequestObj.permissions;
        localStorage.setItem('currentUser', JSON.stringify(this.localstorageData));
        this.organizationService.refreshnavItemsForAllRoles.next(true);
      }
      this.UpdatePermissions(this.permissionsRequestObj);
    }
  }

  private UpdatePermissions(permissionsData: any) {
    this.organizationApi.updateRoleWisePermissions(permissionsData).subscribe(updatePermissionRes => {
      if (updatePermissionRes && (updatePermissionRes['flag'] === 1)) {
        this.loading = false;
        this.closePermissionUIModalEvent.emit();
        this.messageService.add({
          key: 'commonMsg', severity: 'success', summary: 'Success Message',
          detail: updatePermissionRes['message']
        });
        this.organizationService.refreshnavItemsForAllRoles.next(true);
      } else {
        this.loading = false;
        this.messageService.add({
          key: 'commonMsg', severity: 'error', summary: 'Error Message',
          detail: updatePermissionRes['message']
        });
      }
    }, error => {
      console.log(error);
    });
  }
}
