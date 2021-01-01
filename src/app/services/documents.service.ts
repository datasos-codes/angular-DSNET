import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DocumentsApi } from '../shared';
import { AuthenticationService } from '.';
import { DocumentsRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class DocumentsService implements DocumentsApi {

    public headers: any = {
        'content-type': 'application/json',
        'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    private baseUrl: string = environment.baseUrl;
    private controllerName = '/Admin/Document/';

    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

    getAllDocuments(documentsObjectData: any): Observable<DocumentsRequest[]> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}GetDocuments`;
        return this.http.post<DocumentsRequest[]>(serviceUrl, documentsObjectData, { headers: this.headers }).pipe(map(res => res));
    }

    addEditDocumentsDetails(formData: any): Observable<DocumentsRequest[]> {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        headers.append('Token', 'Bearer ' + this.authenticationService.currentUserValue['token']);
        const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertDocument`;
        return this.http.post<DocumentsRequest[]>(serviceUrl, formData, { headers }).pipe(map(res => res));
    }

    deletedDocumentIds(deleteMultipleParams: any): Observable<any> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleDocuments`;
        return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers }).pipe(map(res => res));
    }

    downloadDocument(documentId: number): Observable<any> {
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

    inUpdateDocumentDeletePhysicalPath(documentId: number, userId: number): Observable<any> {
        const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveDocument/${documentId}/${userId}`;
        return this.http.post<any>(serviceUrl, documentId, { headers: this.headers }).pipe(map(res => res));
    }
}
