
import { Observable } from 'rxjs';
import {
    EmployeeRequest, EmployeeAddressRequest, EmployeeMobileRequest, EmployeeEmailRequest,
    EmployeeDesignationRequest, EmployeeSalaryRequest, EmployeeDocumentRequest,
    EmployeeBankAccountRequest, EmployeePriorExperienceRequest, NamesApiRequest, UernamesApiRequest, PhoneNumbersRequest, EmailIdsRequest
} from '../../models';

export abstract class EmployeeApi {
    // Start Employee section
    abstract getAllEmployees(): Observable<EmployeeRequest[]>;
    abstract addEditEmployeeDetails(employeeFormData: any): Observable<EmployeeRequest[]>;
    abstract deleteEmployeeById(employeeId: number, userId: number): Observable<any>;
    abstract exportToExcelEmployees(employeeIds: any): Observable<any>;
    abstract deletedSelectedEmployeeIds(deleteMultipleParams: any): Observable<any>;
    abstract getAllUsersByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]>;
    abstract getAllUsersByUserNames(isNeedToRefresh?: boolean): Observable<UernamesApiRequest[]>;
    // End Employee section

    abstract getEmployeeDetailsById(employeeId: number, isNeedToRefresh?: boolean): Observable<any>;

    // Start Address section
    abstract addEditEmployeeAddressDetails(employeeFormAddressData: any): Observable<EmployeeAddressRequest[]>;
    abstract deleteAddressById(addressId: number, userId: number): Observable<any>;
    abstract deletedSelectedAddressIds(deleteMultipleParams: any): Observable<any>;
    // End Address section

    // Start mobile section
    abstract addEditEmployeePhoneDetails(employeeFormPhoneData: any): Observable<EmployeeMobileRequest[]>;
    abstract deleteMobileById(mobileId: number, userId: number): Observable<any>;
    abstract allEmployeePhoneNumbers(isNeedToRefresh?: boolean): Observable<PhoneNumbersRequest[]>;
    abstract deletedSelectedMobileIds(deleteMultipleParams: any): Observable<any>;
    // End mobile section

    // Start Email section
    abstract addEditEmployeeEmailDetails(employeeFormEmailData: any): Observable<EmployeeEmailRequest[]>;
    abstract deleteEmployeeEmailById(empEmailId: number, userId: number): Observable<any>;
    abstract allEmployeeEmailIds(isNeedToRefresh?: boolean): Observable<EmailIdsRequest[]>;
    abstract deletedSelectedEmailIds(deleteMultipleParams: any): Observable<any>;
    // End Email section

    // Start Designation section
    abstract addEditEmployeeDesignation(employeeFormDesignationData: any): Observable<EmployeeDesignationRequest[]>;
    abstract deleteDesignationById(designationId: number, userId: number): Observable<any>;
    abstract deletedSelectedDesignationIds(deleteMultipleParams: any): Observable<any>;
    // End Designation section

    // Start Salary Section
    abstract addEditEmployeeSalaryDetails(employeeFormSalaryData: any): Observable<EmployeeSalaryRequest[]>;
    abstract deleteSalaryById(salaryId: number, userId: number): Observable<any>;
    abstract deletedSelectedSalaryIds(deleteMultipleParams: any): Observable<any>;
    // End Salary Section

    // Start Document Section
    abstract addEditDocumentDetails(employeeFormDocumentData: any): Observable<EmployeeDocumentRequest[]>;
    abstract getFile(documentId: number): Observable<any>;
    abstract deleteDocumentById(documentId: number, userId: number): Observable<any>;
    abstract deletedSelectedDocumentIds(deleteMultipleParams: any): Observable<any>;
    // End Document Section

    // Start Bank Section
    abstract addEditEmployeeBankAccDetails(employeeFormBankData: any): Observable<EmployeeBankAccountRequest[]>;
    abstract deleteBankAccountById(bankId: number, userId: number): Observable<any>;
    abstract deletedSelectedBankAccountIds(deleteMultipleParams: any): Observable<any>;
    // End Bank Section

    // Start Prior Exp Section
    abstract addEditEmployeePriorExperienceDetails(employeeFormPriorExpData: any): Observable<EmployeePriorExperienceRequest[]>;
    abstract deletePriorExperienceById(priorExpId: number, userId: number): Observable<any>;
    abstract deletedSelectedPriorExpIds(deleteMultipleParams: any): Observable<any>;
    // End Prior Exp Section
    abstract getDropDownNamesByType(): Observable<any>; // get DropDown Names by type
}
