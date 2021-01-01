export class EmployeeDesignationRequest {
    id: number;
    employeeId: number;
    designationId: number;
    designation?: string;
    fromDate: any;
    toDate: any;
    isActive: string;
    range: any;
    modifiedBy: number;
    createdBy: number;
}
