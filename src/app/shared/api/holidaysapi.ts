import { HolidaysRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class HolidaysApi {
    abstract getAllHolidayListByYear(year: any): Observable<HolidaysRequest[]>;
    abstract addEditholidaysObjDetails(holidayObj: any): Observable<HolidaysRequest[]>;
    abstract deleteHolidayById(holidayId: number, userId: number): Observable<any>;
    abstract exportToExcelHoliday(holidayIds: any): Observable<any>;
    abstract deletedSelectedIds(deleteMultipleParams: any): Observable<any>;
}
