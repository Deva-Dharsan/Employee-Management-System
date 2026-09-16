import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmployeeModel } from '../classes/Employee.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    http = inject(HttpClient);

    constructor() { }

    onCreateEmployee(obj: EmployeeModel): Observable<EmployeeModel> {
        return this.http.post<EmployeeModel>(environment.API_URL + 'CreateEmployee', obj);
    }

    getAllEmployees(): Observable<any> {
        return this.http.get(environment.API_URL + 'GetAllEmployees');
    }

    getEmployeeById(id: string): Observable<any> {
        return this.http.get(environment.API_URL + 'GetEmployeeById', { params: { id } });
    }

    updateEmployee(id: string, obj: EmployeeModel): Observable<any> {
        return this.http.put(environment.API_URL + 'UpdateEmployee', obj, { params: { id } });
    }

    deleteEmployee(id: string): Observable<any> {
        return this.http.delete(environment.API_URL + 'DeleteEmployee', { params: { id } });
    }
}