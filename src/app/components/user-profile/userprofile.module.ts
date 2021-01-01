import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './userprofile.component';
import { UserProfileRoutingModule } from './userprofile-routing.module';
import { SpinnerModule } from './../../shared/components/spinner/spinner.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, ButtonsModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    UserProfileRoutingModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    SpinnerModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    MessageModule,
    ToastModule,
    TooltipModule
  ],
  providers: [
    MessageService
  ]
})
export class UserProfileModule { }
