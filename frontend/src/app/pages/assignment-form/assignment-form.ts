import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AssignmentService } from '../../core/model/services/assignment-service';
import { ProjectService } from '../../core/model/services/project-service';
import { EmployeeService } from '../../core/model/services/employee-service';

@Component({
  selector: 'app-assignment-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './assignment-form.html',
  styleUrl: './assignment-form.css',
})
export class AssignmentForm implements OnInit {
  isEditMode = false;
  editAssignmentId = '';

  employees: any[] = [];
  projects:  any[] = [];

  form = {
    employeeId : '',
    projectId  : '',
    role       : '',
    allocation : null as number | null,
    startDate  : '',
    endDate    : '',
    status     : 'Planned',
  };

  constructor(
    private assignmentSrv: AssignmentService,
    private projectSrv: ProjectService,
    private employeeSrv: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.employeeSrv.getAllEmployees(),
      this.projectSrv.getAllProjects(),
    ]).subscribe({
      next: ([empRes, projRes]) => {
        this.employees = empRes.result ? empRes.data : [];
        this.projects  = projRes.result ? projRes.data : [];

        // Pre-select project if passed via queryParams
        const preProjectId = this.route.snapshot.queryParams['projectId'];
        if (preProjectId) this.form.projectId = preProjectId;

        // Load existing assignment in edit mode
        const id = this.route.snapshot.queryParams['id'];
        if (id) {
          this.isEditMode = true;
          this.editAssignmentId = id;
          this.loadAssignment(id);
        }
      },
      error: () => alert('Failed to load form data.'),
    });
  }

  loadAssignment(id: string): void {
    this.assignmentSrv.getAssignmentById(id).subscribe({
      next: (res) => {
        if (res.result) {
          const a = res.data;
          this.form.employeeId = a.employeeId;
          this.form.projectId  = a.projectId;
          this.form.role       = a.role;
          this.form.allocation = a.allocation;
          this.form.startDate  = a.startDate ? a.startDate.substring(0, 10) : '';
          this.form.endDate    = a.endDate   ? a.endDate.substring(0, 10)   : '';
          this.form.status     = a.status;
        }
      },
      error: () => alert('Failed to load assignment data.'),
    });
  }

  onSave(ngForm: NgForm): void {
    if (ngForm.invalid) {
      ngForm.form.markAllAsTouched();
      return;
    }

    if (new Date(this.form.startDate) > new Date(this.form.endDate)) {
      alert('Start date must be on or before end date.');
      return;
    }

    if (this.isEditMode) {
      this.assignmentSrv.updateAssignment(this.editAssignmentId, this.form).subscribe({
        next: (res) => {
          if (res.result) {
            alert('Assignment updated successfully!');
            this.router.navigate(['/admin/project-assignment']);
          } else {
            alert(res.message);
          }
        },
        error: (err) => alert(err?.error?.message || 'Error updating assignment.'),
      });
    } else {
      this.assignmentSrv.createAssignment(this.form).subscribe({
        next: (res) => {
          if (res.result) {
            alert('Assignment created successfully!');
            this.router.navigate(['/admin/project-assignment']);
          } else {
            alert(res.message);
          }
        },
        error: (err) => alert(err?.error?.message || 'Error creating assignment.'),
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/project-assignment']);
  }
}
