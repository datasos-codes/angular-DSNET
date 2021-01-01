
export class TimeSheetRequest {
    id: number;
    tDate: any;
    date?: any;
    projectId: number;
    moduleId: number;
    employeeId: number;
    task: string;
    description: string;
    billableHours: number;
    nonBillableHours: number;
    approvedHours: number;
    invoiceId: number;
    remark: string;
    startTime: any;
    TstartTime: any;
    finishTime: any;
    TfinishTime: any;
    isActive: string;
    createdBy: number;
    modifiedBy: number;
}
