export class EmployeeBankAccountRequest {
    id: number;
    employeeId: number;
    bankName: string;
    branchName: string;
    accountNumber: string;
    nameAsInAccount: string;
    ifsc: string;
    isActive: string;
    modifiedBy: number;
    createdBy: number;
}
