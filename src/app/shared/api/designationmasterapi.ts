import { DesignationMasterRequest, NamesApiRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class DesignationMasterApi {
    abstract getAllEmployeeDesignation(): Observable<DesignationMasterRequest[]>;
    abstract getAllDesignationsByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]>;
    abstract addEditDesignationDetails(designationObj: any): Observable<DesignationMasterRequest[]>;
    abstract deleteDesignationById(designationId: number, userId: number): Observable<any>;
    abstract exportToExcelDesignation(designationIds: any): Observable<any>;
    abstract deletedSelectedIds(deleteMultipleParams: any): Observable<any>;
}
