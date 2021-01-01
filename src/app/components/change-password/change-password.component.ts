import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ChangePassword } from '../../models/changepassword';
import { AuthenticationService, CustomvalidationService, AlertMessageService } from '../../services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @Input() loggedInUserDataId: any;
  @Output() closeChangePasswordUIModalEvent: EventEmitter<any> = new EventEmitter();

  changePswdFrm: FormGroup;
  submitted = false;
  changePswdObj = new ChangePassword();
  loading: boolean = false;
  options = {
    autoClose: true,
    keepAfterRouteChange: false,
  };
  loginUserId: any;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private customvalidationService: CustomvalidationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.changePaswdFrmControls();
    this.loginUserId = this.loggedInUserDataId;
  }

  private changePaswdFrmControls() {
    this.changePswdFrm = this.formBuilder.group({
      userOldPassword: ['', Validators.required],
      userPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      userConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
    }, {
      validator: this.customvalidationService.MatchPassword
    });
  }

  get f() { return this.changePswdFrm.controls; }

  onSubmitChangePswd() {
    this.submitted = true;
    if (this.changePswdFrm.invalid) {
      return;
    } else {
      this.loading = true;
      this.changePswdObj = new ChangePassword();
      this.changePswdObj.oldPassword = this.customvalidationService.set('123456$#@$^@1ERF', this.changePswdFrm.value.userOldPassword);
      this.changePswdObj.password = this.customvalidationService.set('123456$#@$^@1ERF', this.changePswdFrm.value.userPassword);
      this.changePswdObj.confirmPassword = this.customvalidationService.
        set('123456$#@$^@1ERF', this.changePswdFrm.value.userConfirmPassword);
      this.changePswdObj.userId = this.loginUserId;

      delete this.changePswdObj.userOldPassword;
      delete this.changePswdObj.userPassword;
      delete this.changePswdObj.userConfirmPassword;

      this.authenticationService.changePassword(this.changePswdObj).subscribe(res => {
        this.loading = false;
        if (res && res['flag'] === 1 && res['data'] !== '') {
          this.closeChangePasswordUIModalEvent.emit(res);
        } else {
          this.messageService.add({
            key: 'commonMsg', severity: 'error', summary: 'Error Message',
            detail: res['message']
          });
        }
      });
    }
  }
}
