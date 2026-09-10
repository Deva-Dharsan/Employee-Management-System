import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IApiResponseModel } from '../interfaces/User.Model';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private http = inject(HttpClient);

  getAllAssignments(): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(environment.API_URL + 'GetAllAssignments');
  }

  getAssignmentById(id: string): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(environment.API_URL + 'GetAssignmentById', { params: { id } });
  }

  createAssignment(data: any): Observable<IApiResponseModel> {
    return this.http.post<IApiResponseModel>(environment.API_URL + 'CreateAssignment', data);
  }

  updateAssignment(id: string, data: any): Observable<IApiResponseModel> {
    return this.http.put<IApiResponseModel>(environment.API_URL + 'UpdateAssignment', data, { params: { id } });
  }

  deleteAssignment(id: string): Observable<IApiResponseModel> {
    return this.http.delete<IApiResponseModel>(environment.API_URL + 'DeleteAssignment', { params: { id } });
  }

  getAssignmentsByProject(projectId: string): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(environment.API_URL + 'GetAssignmentsByProject', { params: { projectId } });
  }

  getAssignmentsByEmployee(employeeId: string): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(environment.API_URL + 'GetAssignmentsByEmployee', { params: { employeeId } });
  }
}
