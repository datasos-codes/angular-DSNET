import { CustomvalidationService } from './../../../services/customvalidation.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { first } from 'rxjs/operators';
import { AlertMessageService } from '../../../services/alert-message.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error: any;
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  returnUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertMessageService: AlertMessageService,
    private route: ActivatedRoute,
    private customvalidationService: CustomvalidationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    } else {
      this.loading = true;
      const loginDetails = {
        UserName: this.f.username.value,
        Password: this.customvalidationService.set('123456$#@$^@1ERF', this.f.password.value)
      };
      this.authenticationService.login(loginDetails).pipe(first()).subscribe(user => {
        if (user && user['flag'] === 1 && user['data'] !== '') {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        } else if (user && user['flag'] === 0) {
          this.loading = false;
          this.alertMessageService.error(user['message'], this.options);
        }
      }, error => {
        this.loading = false;
        this.error = error;
        console.log(this.error);
      });
    }
  }

}
