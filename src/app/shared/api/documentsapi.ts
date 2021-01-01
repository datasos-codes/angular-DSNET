import { DocumentsRequest } from './../../models/documentsrequest';
import { Observable } from 'rxjs';

export abstract class DocumentsApi {
    abstract getAllDocuments(documentsObjectData: any): Observable<DocumentsRequest[]>;
    abstract addEditDocumentsDetails(formData: any): Observable<DocumentsRequest[]>;
    abstract deletedDocumentIds(deleteMultipleParams: any): Observable<any>;
    abstract downloadDocument(documentId: number): Observable<any>;
    abstract inUpdateDocumentDeletePhysicalPath(documentId: number, userId: number): Observable<any>;
}
