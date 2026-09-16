import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IApiResponseModel } from '../interfaces/User.Model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);

  getAllProjects(): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(environment.API_URL + 'GetAllProjects');
  }

  getProjectById(id: string): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(environment.API_URL + 'GetProjectById', { params: { id } });
  }

  createProject(data: any): Observable<IApiResponseModel> {
    return this.http.post<IApiResponseModel>(environment.API_URL + 'CreateProject', data);
  }

  updateProject(id: string, data: any): Observable<IApiResponseModel> {
    return this.http.put<IApiResponseModel>(environment.API_URL + 'UpdateProject', data, { params: { id } });
  }

  deleteProject(id: string): Observable<IApiResponseModel> {
    return this.http.delete<IApiResponseModel>(environment.API_URL + 'DeleteProject', { params: { id } });
  }
}
