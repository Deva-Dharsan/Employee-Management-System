import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/model/services/project-service';
import { IProject } from '../../core/model/interfaces/User.Model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  projectList: IProject[] = [];
  loaded = false;
  errorMessage = '';

  private toast = inject(ToastService);

  constructor(private projectSrv: ProjectService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loaded = false;
    this.errorMessage = '';
    this.projectSrv.getAllProjects().subscribe({
      next: (res) => {
        if (res.result) {
          this.projectList = res.data;
        } else {
          this.errorMessage = res.message;
        }
        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load projects.';
        this.loaded = true;
        this.cdr.detectChanges();
      },
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/admin/project-form'], { queryParams: { id } });
  }

  onView(id: string): void {
    this.router.navigate(['/admin/project-detail'], { queryParams: { id } });
  }

  async onDelete(id: string): Promise<void> {
    const confirmed = await this.toast.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!confirmed) return;

    this.projectSrv.deleteProject(id).subscribe({
      next: (res) => {
        if (res.result) {
          this.projectList = this.projectList.filter((p) => p._id !== id);
          this.toast.success('Project deleted successfully.');
        } else {
          this.toast.error('Delete failed: ' + res.message);
        }
      },
      error: () => this.toast.error('Error deleting project.'),
    });
  }

  priorityClass(priority: string): string {
    const map: Record<string, string> = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Critical: 'badge-critical' };
    return map[priority] || '';
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Planning: 'badge-planning', Active: 'badge-active', 'On Hold': 'badge-hold',
      Completed: 'badge-completed', Cancelled: 'badge-cancelled',
    };
    return map[status] || '';
  }
}
