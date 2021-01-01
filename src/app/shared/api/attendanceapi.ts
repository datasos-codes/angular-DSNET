import { AttendanceRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class AttendanceApi {
    abstract geAllAttendanceList(filterObj: any): Observable<AttendanceRequest[]>;
    abstract addEditAttendanceDetails(attendanceObj: any): Observable<AttendanceRequest[]>;
    abstract deleteAttendanceById(attendanceId: number, userId: number): Observable<any>;
    abstract exportToExcelAttendance(attendanceIds: any): Observable<any>;
    abstract deletedSelectedIds(deleteMultipleParams: any): Observable<any>;
}
