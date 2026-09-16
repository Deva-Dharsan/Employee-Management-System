import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IApiResponseModel } from '../interfaces/User.Model';

@Injectable({ providedIn: 'root' })
export class MasterSrv {
  http = inject(HttpClient);

  getAllParentDept(): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(`${environment.API_URL}GetParentDepartment`);
  }

  getAllChildDeptByParentId(id: number): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(
      `${environment.API_URL}GetChildDepartmentByParentId?deptId=${id}`,
    );
  }
}
