import { Component, OnInit, Input } from '@angular/core';
import { AttendanceRequest } from '../../../../models/attendancerequest';

@Component({
  selector: 'app-viewemployee-attendance',
  templateUrl: './viewemployee-attendance.component.html',
  styleUrls: ['./viewemployee-attendance.component.css']
})
export class ViewEmployeeAttendanceComponent implements OnInit {
  @Input() viewAttendanceDetails: any;
  attendanceObj: AttendanceRequest;

  constructor() {
    this.attendanceObj = new AttendanceRequest();
  }

  ngOnInit(): void {
    this.viewAttendanceData();
  }

  private viewAttendanceData() {
    if (this.viewAttendanceDetails !== undefined && this.viewAttendanceDetails.id > 0) {
      this.attendanceObj = this.viewAttendanceDetails;
    }
  }
}
