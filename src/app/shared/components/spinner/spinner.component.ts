import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  bdColor: string;
  size: string;
  color: string;
  type: string;
  loading: boolean;

  constructor(
    private loaderService: LoaderService,
    private spinner: NgxSpinnerService
  ) {
    this.loaderService.isLoading.subscribe((res) => {
      this.loading = res;
      if (this.loading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }

  ngOnInit(): void {
    this.spinnerConfig();
  }

  spinnerConfig(): void {
    this.bdColor = 'rgba(0, 0, 0, 0.6)';
    this.size = 'medium';
    this.color = '#fff';
    this.type = 'ball-spin';
  }

}
