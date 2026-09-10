import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProjectService } from '../../core/model/services/project-service';
import { AssignmentService } from '../../core/model/services/assignment-service';
import { EmployeeService } from '../../core/model/services/employee-service';
import { IProject, IAssignment } from '../../core/model/interfaces/User.Model';

interface TeamMember extends IAssignment {
  employeeName: string;
  emailId: string;
}

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {
  project: IProject | null = null;
  team: TeamMember[] = [];
  loaded = false;

  constructor(
    private projectSrv: ProjectService,
    private assignmentSrv: AssignmentService,
    private employeeSrv: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams['id'];
    if (!id) { this.router.navigate(['/admin/projects']); return; }

    forkJoin([
      this.projectSrv.getProjectById(id),
      this.assignmentSrv.getAssignmentsByProject(id),
      this.employeeSrv.getAllEmployees(),
    ]).subscribe({
      next: ([projRes, assignRes, empRes]) => {
        if (projRes.result) this.project = projRes.data;

        const assignments: IAssignment[] = assignRes.result ? assignRes.data : [];
        const employees: any[] = empRes.result ? empRes.data : [];

        this.team = assignments.map((a) => {
          const emp = employees.find((e) => e._id === a.employeeId);
          return { ...a, employeeName: emp?.employeeName || '—', emailId: emp?.emailId || '—' };
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
