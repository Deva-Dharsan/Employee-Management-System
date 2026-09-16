import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AssignmentService } from '../../core/model/services/assignment-service';
import { ProjectService } from '../../core/model/services/project-service';
import { EmployeeService } from '../../core/model/services/employee-service';
import { IAssignment } from '../../core/model/interfaces/User.Model';
import { ToastService } from '../../core/services/toast.service';

interface AssignmentRow extends IAssignment {
  employeeName: string;
  projectName : string;
  projectCode : string;
}

@Component({
  selector: 'app-project-assignment',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-assignment.html',
  styleUrl: './project-assignment.css',
})
export class ProjectAssignment implements OnInit {
  assignments: AssignmentRow[] = [];
  loaded = false;
  errorMessage = '';

  private toast = inject(ToastService);

  constructor(
    private assignmentSrv: AssignmentService,
    private projectSrv: ProjectService,
    private employeeSrv: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.loaded = false;
    this.errorMessage = '';

    forkJoin([
      this.assignmentSrv.getAllAssignments(),
      this.projectSrv.getAllProjects(),
      this.employeeSrv.getAllEmployees(),
    ]).subscribe({
      next: ([assignRes, projRes, empRes]) => {
        const rawAssignments: IAssignment[] = assignRes.result ? assignRes.data : [];
        const projects: any[] = projRes.result ? projRes.data : [];
        const employees: any[] = empRes.result ? empRes.data : [];

        this.assignments = rawAssignments.map((a) => {
          const emp = employees.find((e) => e._id === a.employeeId);
          const proj = projects.find((p) => p._id === a.projectId);
          return {
            ...a,
            employeeName: emp?.employeeName || '—',
            projectName : proj?.projectName || '—',
            projectCode : proj?.projectCode || '—',
          };
        });

        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load assignments.';
        this.loaded = true;
        this.cdr.detectChanges();
      },
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/admin/assignment-form'], { queryParams: { id } });
  }

  async onDelete(id: string): Promise<void> {
    const confirmed = await this.toast.confirm('Remove this assignment? This action cannot be undone.');
    if (!confirmed) return;

    this.assignmentSrv.deleteAssignment(id).subscribe({
      next: (res) => {
        if (res.result) {
          this.assignments = this.assignments.filter((a) => a._id !== id);
          this.toast.success('Assignment removed successfully.');
        } else {
          this.toast.error('Delete failed: ' + res.message);
        }
      },
      error: () => this.toast.error('Error deleting assignment.'),
    });
  }

  statusClass(s: string): string {
    const map: Record<string, string> = { Planned: 'badge-planning', Active: 'badge-active', Completed: 'badge-completed', Cancelled: 'badge-cancelled' };
    return map[s] || '';
  }
}
