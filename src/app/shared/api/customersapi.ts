import { CustomersRequest, NamesApiRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class CustomersApi {
    abstract getAllCustomersList(): Observable<CustomersRequest[]>;
    abstract getAllCustomersByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]>;
    abstract addEditCustomerDetails(customerObj: any): Observable<CustomersRequest[]>;
    abstract exportToExcelCustomer(customerIds: any): Observable<any>;
    abstract deleteCustomerById(customerId: number, userId: number): Observable<any>;
    abstract deletedSelectedIds(deleteMultipleParams: any): Observable<any>;
}
