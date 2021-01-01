import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { EmployeeApi } from '../shared';
import {
  EmployeeRequest, EmployeeAddressRequest, EmployeeMobileRequest,
  EmployeeEmailRequest, EmployeeDesignationRequest, NamesApiRequest, UernamesApiRequest, EmployeeSalaryRequest,
  EmployeeDocumentRequest, EmployeeBankAccountRequest, EmployeePriorExperienceRequest, PhoneNumbersRequest, EmailIdsRequest
} from '../models';
import { AuthenticationService } from '.';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements EmployeeApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  private baseUrl = environment.baseUrl;
  private controllerName = '/Admin/Employee/';
  employeeObjectData: any;
  employeeByids: any;
  getUsersNames: NamesApiRequest[];
  getUserByUserNamesData: UernamesApiRequest[];
  phoneNumbers: PhoneNumbersRequest[];
  emailIds: EmailIdsRequest[]

  refreshProfileImage = new BehaviorSubject<any>(false);
  employeeUpdatedSourceForEmployee = new BehaviorSubject<any>(false);

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  // Start Employee section

  getAllEmployees(): Observable<EmployeeRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}EmployeeDetails`;
    return this.http.get<EmployeeRequest[]>(serviceUrl, { headers: this.headers }).pipe(
      map(empResponse => {
        return empResponse;
      })
    );
  }

  addEditEmployeeDetails(employeeFormData: any): Observable<EmployeeRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertEmployee`;
    return this.http.post<EmployeeRequest[]>(serviceUrl, employeeFormData, { headers: this.headers })
      .pipe(map(employeeFormDataResponse => {
        return employeeFormDataResponse;
      }));
  }

  deleteEmployeeById(employeeId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveEmployee/${employeeId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteEmployee => {
        return deleteEmployee;
      }));
  }

  exportToExcelEmployees(employeeIds: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
    const httpOption = {
      responseType: 'blob' as 'json',
      'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    return this.http.post<any>(serviceUrl, employeeIds, httpOption)
      .pipe(map(excelFileRes => {
        return excelFileRes;
      }));
  }

  deletedSelectedEmployeeIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleEmployees`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }

  getEmployeeDetailsById(employeeId: number, isNeedToRefresh?: boolean): Observable<any> {
    // if (this.employeeByids && !isNeedToRefresh) {
    //   return of(this.employeeByids);
    // } else {
    //   const serviceUrl = `${this.baseUrl}${this.controllerName}Employee/${employeeId}`;
    //   return this.http.get<any>(serviceUrl, { headers: this.headers })
    //     .pipe(
    //       map(EmployeeDetailsResponse => {
    //         this.employeeByids = EmployeeDetailsResponse;
    //         return this.employeeByids;
    //       }), publishReplay(1), refCount(),
    //     );
    // }
    const serviceUrl = `${this.baseUrl}${this.controllerName}Employee/${employeeId}`;
    return this.http.get<any>(serviceUrl, { headers: this.headers })
      .pipe(
        map(EmployeeDetailsResponse => {
          this.employeeByids = EmployeeDetailsResponse;
          return this.employeeByids;
        }), publishReplay(1), refCount(),
      );
  }

  getAllUsersByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]> {
    // if (this.getUsersNames && !isNeedToRefresh) {
    //   return of(this.getUsersNames);
    // } else {
    //   const serviceUrl = `${this.baseUrl}${this.controllerName}GetEmployeeByNames`;
    //   return this.http.get<NamesApiRequest[]>(serviceUrl, { headers: this.headers }).pipe(
    //     map((usersNamesRes) => {
    //       this.getUsersNames = usersNamesRes;
    //       return this.getUsersNames;
    //     }), publishReplay(1), refCount(),
    //   );
    // }
    const serviceUrl = `${this.baseUrl}${this.controllerName}GetEmployeeByNames`;
    return this.http.get<NamesApiRequest[]>(serviceUrl, { headers: this.headers }).pipe(
      map((usersNamesRes) => {
        this.getUsersNames = usersNamesRes;
        return this.getUsersNames;
      }), publishReplay(1), refCount(),
    );
  }

  getAllUsersByUserNames(isNeedToRefresh?: boolean): Observable<UernamesApiRequest[]> {
    // if (this.getUserByUserNamesData && !isNeedToRefresh) {
    //   return of(this.getUserByUserNamesData);
    // } else {
    //   const serviceUrl = `${this.baseUrl}${this.controllerName}GetEmployeeByUserNames`;
    //   return this.http.get<UernamesApiRequest[]>(serviceUrl, { headers: this.headers }).pipe(
    //     map((usersNamesRes) => {
    //       this.getUserByUserNamesData = usersNamesRes;
    //       return this.getUserByUserNamesData;
    //     }), publishReplay(1), refCount(),
    //   );
    // }
    const serviceUrl = `${this.baseUrl}${this.controllerName}GetEmployeeByUserNames`;
    return this.http.get<UernamesApiRequest[]>(serviceUrl, { headers: this.headers }).pipe(
      map((usersNamesRes) => {
        this.getUserByUserNamesData = usersNamesRes;
        return this.getUserByUserNamesData;
      }), publishReplay(1), refCount(),
    );
  }

  // End Employee section

  // Start Address section
  addEditEmployeeAddressDetails(employeeFormAddressData: any): Observable<EmployeeAddressRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertAddress`;
    return this.http.post<EmployeeAddressRequest[]>(serviceUrl, employeeFormAddressData, { headers: this.headers }).pipe(
      map(addEditEmployeeAddressResponse => {
        return addEditEmployeeAddressResponse;
      })
    );
  }

  deleteAddressById(addressId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveAddress/${addressId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers }).pipe(
      map(deleteAddressRes => {
        return deleteAddressRes;
      })
    );
  }

  deletedSelectedAddressIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleAddresses`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
  // End Address section

  // Start mobile section
  addEditEmployeePhoneDetails(employeeFormPhoneData: any): Observable<EmployeeMobileRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertPhone`;
    return this.http.post<EmployeeMobileRequest[]>(serviceUrl, employeeFormPhoneData, { headers: this.headers })
      .pipe(
        map(addEditEmployeePhoneResponse => {
          return addEditEmployeePhoneResponse;
        }));
  }

  deleteMobileById(mobileId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemovePhone/${mobileId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteMobileRes => {
        return deleteMobileRes;
      }));
  }

  allEmployeePhoneNumbers(isNeedToRefresh?: boolean): Observable<PhoneNumbersRequest[]> {
    // if (this.phoneNumbers && !isNeedToRefresh) {
    //   return of(this.phoneNumbers);
    // } else {
    //   const serviceUrl = `${this.baseUrl}${this.controllerName}GetEmployeePhoneNumbers`;
    //   return this.http.get<PhoneNumbersRequest[]>(serviceUrl, { headers: this.headers }).pipe(
    //     map((phoneNumbersRes) => {
    //       this.phoneNumbers = phoneNumbersRes;
    //       return this.phoneNumbers;
    //     }), publishReplay(1), refCount(),
    //   );
    // }
    const serviceUrl = `${this.baseUrl}${this.controllerName}GetEmployeePhoneNumbers`;
    return this.http.get<PhoneNumbersRequest[]>(serviceUrl, { headers: this.headers }).pipe(
      map((phoneNumbersRes) => {
        this.phoneNumbers = phoneNumbersRes;
        return this.phoneNumbers;
      }), publishReplay(1), refCount(),
    );
  }

  deletedSelectedMobileIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultiplePhones`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
  // End mobile section

  // Start Email section
  addEditEmployeeEmailDetails(employeeFormEmailData: any): Observable<EmployeeEmailRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertEmail`;
    return this.http.post<EmployeeEmailRequest[]>(serviceUrl, employeeFormEmailData, { headers: this.headers })
      .pipe(
        map(addEditEmployeeEmailResponse => {
          return addEditEmployeeEmailResponse;
        })
      );
  }

  deleteEmployeeEmailById(empEmailId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveEmail/${empEmailId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(
        map(deleteEmployeeEmailRes => {
          return deleteEmployeeEmailRes;
        })
      );
  }

  allEmployeeEmailIds(isNeedToRefresh?: boolean): Observable<EmailIdsRequest[]> {
    // if (this.emailIds && !isNeedToRefresh) {
    //   return of(this.emailIds);
    // } else {
    //   const serviceUrl = `${this.baseUrl}${this.controllerName}GetEmployeeEmailIds`;
    //   return this.http.get<EmailIdsRequest[]>(serviceUrl, { headers: this.headers }).pipe(
    //     map((emailIdsRes) => {
    //       this.emailIds = emailIdsRes;
    //       return this.emailIds;
    //     }), publishReplay(1), refCount(),
    //   );
    // }
    const serviceUrl = `${this.baseUrl}${this.controllerName}GetEmployeeEmailIds`;
    return this.http.get<EmailIdsRequest[]>(serviceUrl, { headers: this.headers }).pipe(
      map((emailIdsRes) => {
        this.emailIds = emailIdsRes;
        return this.emailIds;
      }), publishReplay(1), refCount(),
    );
  }

  deletedSelectedEmailIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleEmails`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
  // End Email section

  // Start Designation section
  addEditEmployeeDesignation(employeeFormDesignationData: any): Observable<EmployeeDesignationRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertDesignations`;
    return this.http.post<EmployeeDesignationRequest[]>(serviceUrl, employeeFormDesignationData, { headers: this.headers })
      .pipe(
        map(employeeFormDesignationDataResponse => {
          return employeeFormDesignationDataResponse;
        })
      );
  }

  deleteDesignationById(designationId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveDesignation/${designationId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(
        map(deleteDesignation => {
          return deleteDesignation;
        })
      );
  }

  deletedSelectedDesignationIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleDesignations`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
  // End Designation section

  // Start Salary Section
  addEditEmployeeSalaryDetails(employeeFormSalaryData: any): Observable<EmployeeSalaryRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertSalary`;
    return this.http.post<EmployeeSalaryRequest[]>(serviceUrl, employeeFormSalaryData, { headers: this.headers })
      .pipe(map(employeeSalaryDataResponse => {
        return employeeSalaryDataResponse;
      }));
  }

  deleteSalaryById(salaryId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveSalary/${salaryId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteSalary => {
        return deleteSalary;
      }));
  }

  deletedSelectedSalaryIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleSalaries`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
  // End Salary Section

  //  Start Document Section
  addEditDocumentDetails(formData): Observable<EmployeeDocumentRequest[]> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    headers.append('Token', 'Bearer ' + this.authenticationService.currentUserValue['token']);
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertDocument`;
    return this.http.post<EmployeeDocumentRequest[]>(serviceUrl, formData, { headers })
      .pipe(map(docRes => {
        return docRes;
      }));
  }

  getFile(documentId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}Download/${documentId}`;
    const httpOptions = {
      responseType: 'blob' as 'json',
      'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    return this.http.post<any>(serviceUrl, { headers: this.headers }, httpOptions)
      .pipe(map(downloadFileRes => {
        return downloadFileRes;
      }));
  }

  deleteDocumentById(deleteDocId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveDocuments/${deleteDocId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteDocument => {
        return deleteDocument;
      }));
  }

  deletedSelectedDocumentIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleDocuments`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
  // End Document section

  // Start Bank Section
  addEditEmployeeBankAccDetails(employeeFormBankAccData: any): Observable<EmployeeBankAccountRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertBankAccount`;
    return this.http.post<EmployeeBankAccountRequest[]>(serviceUrl, employeeFormBankAccData, { headers: this.headers })
      .pipe(map(addEditEmployeeBankAccResponse => {
        return addEditEmployeeBankAccResponse;
      }));
  }

  deleteBankAccountById(bankId: number, userid: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveBankAccount/${bankId}/${userid}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deleteBankAccRes => {
        return deleteBankAccRes;
      }));
  }

  deletedSelectedBankAccountIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleBankAccounts`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
  // End Bank Section

  // Start Prior Exp Section
  addEditEmployeePriorExperienceDetails(employeeFormPrioeExpData: any): Observable<EmployeePriorExperienceRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertEmployeeHistory`;
    return this.http.post<EmployeePriorExperienceRequest[]>(serviceUrl, employeeFormPrioeExpData, { headers: this.headers })
      .pipe(map(addedirEmployeePriorExpRes => {
        return addedirEmployeePriorExpRes;
      }));
  }

  deletePriorExperienceById(priorExpId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveEmployeeHistory/${priorExpId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers })
      .pipe(map(deletePriorExpRes => {
        return deletePriorExpRes;
      }));
  }

  deletedSelectedPriorExpIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleEmploymentHistories`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }
  // End Prior Exp Section

  getDropDownNamesByType(): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}GetDropDownTypes`;
    return this.http.get<any>(serviceUrl, { headers: this.headers })
      .pipe(
        map(dropdownNameRes => {
          return dropdownNameRes;
        }), publishReplay(1), refCount(),
      );
  }
}
