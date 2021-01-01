import { NgModule } from '@angular/core';
import { TwoDigitDecimaNumberDirective } from './twodigitdecimalnumber.directive';

@NgModule({
    declarations: [
        TwoDigitDecimaNumberDirective
    ],
    exports: [
        TwoDigitDecimaNumberDirective
    ],
    imports: []
})
export class DirectivesModule { }
