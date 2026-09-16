import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AssignmentService } from '../../core/model/services/assignment-service';
import { GlobalConstant } from '../../core/globalConstant/global.constant';

interface MyProject {
  projectName   : string;
  projectCode   : string;
  description   : string;
  clientName    : string;
  projectStatus : string;
  priority      : string;
  projectStart  : string;
  projectEnd    : string;
  myRole        : string;
  allocation    : number;
  assignStart   : string;
  assignEnd     : string;
  assignStatus  : string;
}

@Component({
  selector: 'app-my-projects',
  imports: [CommonModule],
  templateUrl: './my-projects.html',
  styleUrl: './my-projects.css',
})
export class MyProjects implements OnInit {
  myProjects: MyProject[] = [];
  loaded = false;
  loggedUser: any = null;

  constructor(
    private http: HttpClient,
    private assignmentSrv: AssignmentService,
    private cdr: ChangeDetectorRef
  ) {
    const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);
    if (localData) this.loggedUser = JSON.parse(localData);
  }

  ngOnInit(): void {
    if (!this.loggedUser?._id) { this.loaded = true; return; }

    forkJoin([
      this.assignmentSrv.getAssignmentsByEmployee(this.loggedUser._id),
      this.http.get<any>(environment.API_URL + 'GetAllProjects'),
    ]).subscribe({
      next: ([assignRes, projRes]) => {
        const assignments = assignRes.result ? assignRes.data : [];
        const projects    = projRes.result   ? projRes.data   : [];

        this.myProjects = assignments.map((a: any) => {
          const proj = projects.find((p: any) => p._id === a.projectId);
          return {
            projectName  : proj?.projectName  || '—',
            projectCode  : proj?.projectCode  || '—',
            description  : proj?.description  || '',
            clientName   : proj?.clientName   || '—',
            projectStatus: proj?.status       || '—',
            priority     : proj?.priority     || '—',
            projectStart : proj?.startDate    || '',
            projectEnd   : proj?.endDate      || '',
            myRole       : a.role,
            allocation   : a.allocation,
            assignStart  : a.startDate,
            assignEnd    : a.endDate,
            assignStatus : a.status,
          };
        });

        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: () => { this.loaded = true; this.cdr.detectChanges(); },
    });
  }

  priorityClass(p: string): string {
    const map: Record<string, string> = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Critical: 'badge-critical' };
    return map[p] || '';
  }

  statusClass(s: string): string {
    const map: Record<string, string> = { Planning: 'badge-planning', Active: 'badge-active', 'On Hold': 'badge-hold', Completed: 'badge-completed', Cancelled: 'badge-cancelled' };
    return map[s] || '';
  }

  assignStatusClass(s: string): string {
    const map: Record<string, string> = { Planned: 'badge-planning', Active: 'badge-active', Completed: 'badge-completed', Cancelled: 'badge-cancelled' };
    return map[s] || '';
  }
}
