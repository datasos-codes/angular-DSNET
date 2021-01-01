import { ProjectsRequest, NamesApiRequest, ProjectModuleRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class ProjectsApi {
    abstract getAllProjects(projectId: number): Observable<ProjectsRequest[]>;
    abstract getAllProjectsByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]>;
    abstract addEditProjectsObjDetails(projectObj: any): Observable<ProjectsRequest[]>;
    abstract deleteProjectById(projectId: number, userId: number): Observable<any>;
    abstract exportToExcelProjects(projectIds: any): Observable<any>;
    abstract deletedSelectedIds(deleteMultipleParams: any): Observable<any>;
    abstract getAllModuleNames(): Observable<any[]>;

    abstract getAllModulesDetails(projectId?: number): Observable<ProjectModuleRequest[]>;
    abstract addEditProjectModuleDetails(projectModuleObj: any): Observable<ProjectModuleRequest[]>;
    abstract deleteSelectedModuleIds(deleteMultipleParams: any): Observable<any>;
}
