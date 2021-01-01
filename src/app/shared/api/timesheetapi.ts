import { TimeSheetRequest, AddEmployeeTimesheetRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class TimeSheetApi {
    abstract getTimeSheetList(filterObj: any): Observable<TimeSheetRequest[]>;
    abstract addEdittimeSheetDetails(timesheetObj: any): Observable<TimeSheetRequest[]>;
    abstract deleteTimeSheetById(timeSheetId: number, userId: number): Observable<any>;
    abstract exportToExcelTimesheet(timeSheetIds: any): Observable<any>;
    abstract deletedSelectedIds(deleteMultipleParams: any): Observable<any>;
    abstract insertMultipleEmployeeTimesheetDetails(timesheetObj: any): Observable<AddEmployeeTimesheetRequest[]>;
}
