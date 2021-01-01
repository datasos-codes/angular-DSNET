
import { Observable } from 'rxjs';

export abstract class InvoiceAPi {
    abstract getAllInvoices(invoiceObjectData: any): Observable<any>;
    abstract exportToExcelInvoicesData(invoiceExeclData: any): Observable<any>;
}
