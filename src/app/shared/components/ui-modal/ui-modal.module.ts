import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModalComponent } from './ui-modal.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [UiModalComponent],
  exports: [UiModalComponent],
  imports: [
    CommonModule,
    DialogModule
  ]
})
export class UiModalModule { }
