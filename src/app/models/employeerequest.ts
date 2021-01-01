import { Role } from './role';

export class EmployeeRequest {
    employeeId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate?: any;
    tbirthDate: any;
    companyEmail: string;
    panNumber: string;
    aadharNumber: string;
    designationId: number;
    userName: string;
    password: string;
    empPassword?: string;
    securityQuestion: string;
    securityAnswer: string;
    joiningDate?: any;
    tjoiningDate: any;
    gender: number;
    roleId: Role;
    isActive: string;
    modifiedBy: number;
    createdBy: number;
}
