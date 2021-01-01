import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appTwoDigitDecimaNumber]'
})
export class TwoDigitDecimaNumberDirective {
    // Allow decimal numbers and negative values
    // private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g); // Old rejex
    private regex: RegExp = new RegExp(/^([-]?\d*\.?\d{0,2})$/); // New rejex
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = [
        'Backspace',
        'Tab',
        'End',
        'Home',
        'ArrowLeft',
        'ArrowRight',
        'Del',
        'Delete'
    ];

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1 ||
            // Allow: Ctrl+A
            (event.keyCode === 65 && event.ctrlKey === true) ||
            // Allow: Ctrl+C
            (event.keyCode === 67 && event.ctrlKey === true) ||
            // Allow: Ctrl+V
            (event.keyCode === 86 && event.ctrlKey === true) ||
            // Allow: Ctrl+X
            (event.keyCode === 88 && event.ctrlKey === true)) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;
        const next: string = [
            current.slice(0, position),
            event.key === 'Decimal' ? '.' : event.key,
            current.slice(position)
        ].join('');
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}
