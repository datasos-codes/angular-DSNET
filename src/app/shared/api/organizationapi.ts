import { PermissionsRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class OrganizationApi {
    abstract getUserRoles(): Observable<PermissionsRequest[]>;
    abstract getRolePermission(permissionId: number): Observable<PermissionsRequest[]>;
    abstract updateRoleWisePermissions(permissionsObj: any): Observable<any[]>;
}
