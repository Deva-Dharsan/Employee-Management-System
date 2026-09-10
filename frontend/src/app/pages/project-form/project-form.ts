import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/model/services/project-service';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
})
export class ProjectForm implements OnInit {
  isEditMode = false;
  editProjectId = '';

  form = {
    projectName : '',
    projectCode : '',
    description : '',
    clientName  : '',
    startDate   : '',
    endDate     : '',
    priority    : '',
    status      : 'Planning',
  };

  constructor(
    private projectSrv: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.isEditMode = true;
      this.editProjectId = id;
      this.loadProject(id);
    }
  }

  loadProject(id: string): void {
    this.projectSrv.getProjectById(id).subscribe({
      next: (res) => {
        if (res.result) {
          const p = res.data;
          this.form.projectName = p.projectName;
          this.form.projectCode = p.projectCode;
          this.form.description = p.description;
          this.form.clientName  = p.clientName;
          this.form.startDate   = p.startDate ? p.startDate.substring(0, 10) : '';
          this.form.endDate     = p.endDate   ? p.endDate.substring(0, 10)   : '';
          this.form.priority    = p.priority;
          this.form.status      = p.status;
        }
      },
      error: () => alert('Failed to load project data.'),
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
      this.projectSrv.updateProject(this.editProjectId, this.form).subscribe({
        next: (res) => {
          if (res.result) {
            alert('Project updated successfully!');
            this.router.navigate(['/admin/projects']);
          } else {
            alert(res.message);
          }
        },
        error: (err) => alert(err?.error?.message || 'Error updating project.'),
      });
    } else {
      this.projectSrv.createProject(this.form).subscribe({
        next: (res) => {
          if (res.result) {
            alert('Project created successfully!');
            this.router.navigate(['/admin/projects']);
          } else {
            alert(res.message);
          }
        },
        error: (err) => alert(err?.error?.message || 'Error creating project.'),
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/projects']);
  }
}
