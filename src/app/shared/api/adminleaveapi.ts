
import { AdminLeavesRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class AdminLeaveApi {
    abstract getAllAdminSideLeaves(filterObj: any): Observable<AdminLeavesRequest[]>;
    abstract addEditAdminLeavesData(adminLeaveObj: any): Observable<AdminLeavesRequest[]>;
    abstract deleteAdminLeaveById(leaveId: number, userId: number): Observable<any>;
    abstract exportToExcelAdminLeave(adminLeaveIds: any): Observable<any>;
    abstract deletedSelectedIds(deleteMultipleParams: any): Observable<any>;
	
	// Employee
    abstract getAllEmployeeSideLeaves(filterObj: any): Observable<AdminLeavesRequest[]>;
}
