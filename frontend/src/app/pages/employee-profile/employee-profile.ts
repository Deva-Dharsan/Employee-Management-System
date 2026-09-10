import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstant } from '../../core/globalConstant/global.constant';
import { EmployeeService } from '../../core/model/services/employee-service';
import { MasterSrv } from '../../core/model/services/master-srv';
import { AssignmentService } from '../../core/model/services/assignment-service';
import { IChildDept, IparentDept } from '../../core/model/interfaces/User.Model';

@Component({
  selector: 'app-employee-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.css',
})
export class EmployeeProfile implements OnInit {
  employee: any = null;
  loaded = false;
  error = '';
  departmentName = '';
  parentDepartmentName = '';
  totalAssignedProjects = 0;
  activeAssignmentsCount = 0;

  private employeeSrv = inject(EmployeeService);
  private masterSrv = inject(MasterSrv);
  private assignmentSrv = inject(AssignmentService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);
    if (!localData) {
      this.error = 'No user session found. Please log in again.';
      this.loaded = true;
      this.cdr.detectChanges();
      return;
    }

    try {
      const user = JSON.parse(localData);
      // Immediately populate with cached user data so profile displays without blank delay
      this.employee = user;
      const empId = user._id || user.employeeId || user.id;

      if (!empId) {
        this.loaded = true;
        this.cdr.detectChanges();
        return;
      }

      this.loadFullProfile(empId, user.deptId);
    } catch (e) {
      this.error = 'Failed to parse user session.';
      this.loaded = true;
      this.cdr.detectChanges();
    }
  }

  loadFullProfile(empId: string, cachedDeptId?: string): void {
    forkJoin([
      this.employeeSrv.getEmployeeById(empId).pipe(catchError(() => of(null))),
      this.assignmentSrv.getAssignmentsByEmployee(empId).pipe(catchError(() => of(null))),
      this.masterSrv.getAllParentDept().pipe(catchError(() => of(null))),
    ]).subscribe({
      next: ([empRes, assignRes, parentDeptRes]) => {
        if (empRes?.result && empRes.data) {
          this.employee = empRes.data;
        }

        // Project assignments summary
        if (assignRes?.result && Array.isArray(assignRes.data)) {
          this.totalAssignedProjects = assignRes.data.length;
          this.activeAssignmentsCount = assignRes.data.filter(
            (a: any) => a.status === 'Active' || a.status === 'Planned'
          ).length;
        }

        // Resolve Department Name
        const currentDeptId = this.employee?.deptId || cachedDeptId;
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
                    this.parentDepartmentName = parentDepts[i].departmentName;
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
}

