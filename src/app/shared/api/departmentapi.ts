
import { NamesApiRequest } from '../../models';
import { Observable } from 'rxjs';

export abstract class DepartmentApi {
    abstract getAllDepartmentsByNames(isNeedToRefresh?: boolean): Observable<NamesApiRequest[]>;
}
