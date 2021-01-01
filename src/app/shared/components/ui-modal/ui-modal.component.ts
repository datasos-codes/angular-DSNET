import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ui-modal',
  templateUrl: './ui-modal.component.html',
  styleUrls: ['./ui-modal.component.css']
})
export class UiModalComponent implements OnInit {
  @Input() isNeedToRenderUIModal: boolean;
  @Input() displayHeader: string;
  @Input() UIModalStyle: string;
  @Output() closeUIModalEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  closeDialog(): void {
    this.closeUIModalEvent.emit();
  }
}
