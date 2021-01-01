
export class AdminLeavesRequest {
    id: number;
    employeeId: number;
    fullName: string;
    range: any;
    leaveStartDate: any;
    leaveEndDate: any;
    notice: boolean = false;
    leaveType: string;
    reason: string;
    status: string;
    remark: string;
    numberOfDays: number;
    modifiedBy: number;
    createdBy: number;
    leaveFor: string;
}
