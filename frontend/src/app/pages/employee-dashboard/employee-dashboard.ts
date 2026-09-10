import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstant } from '../../core/globalConstant/global.constant';
import { AssignmentService } from '../../core/model/services/assignment-service';
import { ProjectService } from '../../core/model/services/project-service';
import { MasterSrv } from '../../core/model/services/master-srv';
import { IChildDept, IparentDept } from '../../core/model/interfaces/User.Model';

export interface EmployeeProjectCard {
  assignmentId: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  clientName: string;
  description: string;
  role: string;
  allocation: number;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  projectStatus: string;
}

@Component({
  selector: 'app-employee-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css',
})
export class EmployeeDashboard implements OnInit {
  loggedUserData: any = null;
  loaded = false;
  departmentName = '';

  // KPI Metrics
  totalAssignedProjects = 0;
  activeProjectsCount = 0;
  completedProjectsCount = 0;
  totalAllocation = 0;

  // Active Project Assignments list
  activeAssignments: EmployeeProjectCard[] = [];

  private assignmentSrv = inject(AssignmentService);
  private projectSrv = inject(ProjectService);
  private masterSrv = inject(MasterSrv);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);
    if (localData) {
      this.loggedUserData = JSON.parse(localData);
      const empId = this.loggedUserData._id || this.loggedUserData.employeeId || this.loggedUserData.id;
      if (empId) {
        this.loadDashboardData(empId, this.loggedUserData.deptId);
        return;
      }
    }
    this.loaded = true;
    this.cdr.detectChanges();
  }

  loadDashboardData(empId: string, cachedDeptId?: string): void {
    forkJoin([
      this.assignmentSrv.getAssignmentsByEmployee(empId).pipe(catchError(() => of({ result: false, data: [] }))),
      this.projectSrv.getAllProjects().pipe(catchError(() => of({ result: false, data: [] }))),
      this.masterSrv.getAllParentDept().pipe(catchError(() => of({ result: false, data: [] }))),
    ]).subscribe({
      next: ([assignRes, projRes, parentDeptRes]) => {
        const assignments: any[] = assignRes?.result && Array.isArray(assignRes.data) ? assignRes.data : [];
        const projects: any[] = projRes?.result && Array.isArray(projRes.data) ? projRes.data : [];

        // KPI Calculations
        this.totalAssignedProjects = assignments.length;
        
        const activeList = assignments.filter((a) => a.status === 'Active' || a.status === 'Planned');
        this.activeProjectsCount = activeList.length;
        this.completedProjectsCount = assignments.filter((a) => a.status === 'Completed').length;
        
        this.totalAllocation = activeList.reduce((sum, a) => sum + (Number(a.allocation) || 0), 0);

        // Build active assignments with project metadata
        this.activeAssignments = activeList.map((a: any) => {
          const proj = projects.find((p: any) => p._id === a.projectId);
          return {
            assignmentId: a._id,
            projectId: a.projectId,
            projectName: proj?.projectName || 'Unnamed Project',
            projectCode: proj?.projectCode || '—',
            clientName: proj?.clientName || 'Internal',
            description: proj?.description || '',
            role: a.role || 'Contributor',
            allocation: a.allocation || 0,
            startDate: a.startDate,
            endDate: a.endDate,
            status: a.status,
            priority: proj?.priority || 'Medium',
            projectStatus: proj?.status || 'Active',
          };
        });

        // Resolve Department Name
        const currentDeptId = this.loggedUserData?.deptId || cachedDeptId;
        if (currentDeptId && parentDeptRes?.result && Array.isArray(parentDeptRes.data)) {
          const parentDepts: IparentDept[] = parentDeptRes.data;
          const childRequests = parentDepts.map((p) =>
            this.masterSrv.getAllChildDeptByParentId(p.departmentId).pipe(catchError(() => of(null)))
          );

          if (childRequests.length > 0) {
            forkJoin(childRequests).subscribe((childResponses) => {
              for (let i = 0; i < childResponses.length; i++) {
                const childRes = childResponses[i];
                if (childRes?.result && Array.isArray(childRes.data)) {
                  const match = childRes.data.find(
                    (c: IChildDept) => String(c.childDeptId) === String(currentDeptId)
                  );
                  if (match) {
                    this.departmentName = match.departmentName;
                    break;
                  }
                }
              }
              this.loaded = true;
              this.cdr.detectChanges();
            });
            return;
          }
        }

        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loaded = true;
        this.cdr.detectChanges();
      },
    });
  }

  priorityClass(p: string): string {
    const map: Record<string, string> = {
      Low: 'badge-low',
      Medium: 'badge-medium',
      High: 'badge-high',
      Critical: 'badge-critical',
    };
    return map[p] || 'badge-medium';
  }

  assignStatusClass(s: string): string {
    const map: Record<string, string> = {
      Planned: 'badge-planned',
      Active: 'badge-active',
      Completed: 'badge-completed',
      Cancelled: 'badge-cancelled',
    };
    return map[s] || 'badge-active';
  }
}

