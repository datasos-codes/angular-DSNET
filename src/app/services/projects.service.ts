import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ProjectsRequest, NamesApiRequest, ProjectModuleRequest } from '../models';
import { Observable, of } from 'rxjs';
import { ProjectsApi } from '../shared/api';
import { AuthenticationService } from '.';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService implements ProjectsApi {
  public headers: any = {
    'content-type': 'application/json',
    'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
  };
  private baseUrl: string = environment.baseUrl;
  private controllerName = '/Admin/Projects/';
  projectNamesList: NamesApiRequest[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllProjects(projectId: number): Observable<ProjectsRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}Projects/${projectId}`;
    return this.http.get<ProjectsRequest[]>(serviceUrl, { headers: this.headers }).pipe(map(projectRes => {
      return projectRes;
    }));
  }

  getAllProjectsByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]> {
    if (this.projectNamesList && !isNeedToRefresh) {
      if (this.projectNamesList['data'][0].label === 'All Projects') {
        this.projectNamesList['data'].shift({ label: 'All Projects', value: null });
      }
      return of(this.projectNamesList);
    } else {
      const serviceUrl = `${this.baseUrl}${this.controllerName}GetProjectByNames`;
      return this.http.get<NamesApiRequest[]>(serviceUrl, { headers: this.headers }).pipe(
        map((projectNames) => {
          this.projectNamesList = projectNames;
          return this.projectNamesList;
        }), publishReplay(1), refCount(),
      );
    }
  }

  addEditProjectsObjDetails(projectObj: any): Observable<ProjectsRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertProjects`;
    return this.http.post<ProjectsRequest[]>(serviceUrl, projectObj, { headers: this.headers }).pipe(
      map(addEditprojectRes => {
        return addEditprojectRes;
      })
    );
  }

  deleteProjectById(projectId: number, userId: number): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveProjects/${projectId}/${userId}`;
    return this.http.post<any>(serviceUrl, { headers: this.headers }).pipe(
      map(deleteProjectRes => {
        return deleteProjectRes;
      })
    );
  }

  exportToExcelProjects(projectIds: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}ExportToExcel`;
    const httpOption = {
      responseType: 'blob' as 'json',
      'Token': 'Bearer ' + this.authenticationService.currentUserValue['token']
    };
    return this.http.post<any>(serviceUrl, projectIds, httpOption).pipe(
      map(excelFileRes => {
        return excelFileRes;
      })
    );
  }

  deletedSelectedIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleProjects`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers }).pipe(
      map(res => {
        return res;
      })
    );
  }

  getAllModuleNames(): Observable<any[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}GetModules`;
    return this.http.get<any[]>(serviceUrl, { headers: this.headers })
      .pipe(map(res => {
        return res;
      }));
  }


  // Project module APIs start

  getAllModulesDetails(projectId?: number): Observable<ProjectModuleRequest[]> {
    let serviceUrl: string;
    if (projectId && projectId > 0) {
      serviceUrl = `${this.baseUrl}${this.controllerName}Modules/${projectId}`;
    } else {
      serviceUrl = `${this.baseUrl}${this.controllerName}Modules`;
    }
    return this.http.get<ProjectModuleRequest[]>(serviceUrl, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }

  addEditProjectModuleDetails(projectModuleObj: any): Observable<ProjectModuleRequest[]> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}UpsertModule`;
    return this.http.post<ProjectModuleRequest[]>(serviceUrl, projectModuleObj, { headers: this.headers }).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteSelectedModuleIds(deleteMultipleParams: any): Observable<any> {
    const serviceUrl = `${this.baseUrl}${this.controllerName}RemoveMultipleModules`;
    return this.http.post<any>(serviceUrl, deleteMultipleParams, { headers: this.headers }).pipe(
      map(res => {
        return res;
      })
    );
  }

  // Project module APIs end
}
