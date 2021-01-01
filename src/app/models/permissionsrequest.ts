import { ScreenPermisstionRequest } from './screenpermisstionrequest';

export class PermissionsRequest {
    roleId: number;
    roleName: string;
    roleDescription: string;
    isActive: string;
    modifiedBy: number;
    createdBy: number;
    permissions: ScreenPermisstionRequest[];
}
