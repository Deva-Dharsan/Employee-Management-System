import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProjectService } from '../../core/model/services/project-service';
import { AssignmentService } from '../../core/model/services/assignment-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalEmployees = 0;
  totalProjects  = 0;
  activeProjects = 0;
  totalAssignments = 0;
  projectOverview: any[] = [];
  loaded = false;

  errorMessage = '';

  constructor(
    private http: HttpClient,
    private projectSrv: ProjectService,
    private assignmentSrv: AssignmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.http.get<any>(environment.API_URL + 'GetAllEmployees'),
      this.projectSrv.getAllProjects(),
      this.assignmentSrv.getAllAssignments(),
    ]).subscribe({
      next: ([empRes, projRes, assignRes]) => {
        const employees:    any[] = empRes.result    ? empRes.data    : [];
        const projects:     any[] = projRes.result   ? projRes.data   : [];
        const assignments:  any[] = assignRes.result ? assignRes.data : [];

        this.totalEmployees   = employees.length;
        this.totalProjects    = projects.length;
        this.activeProjects   = projects.filter((p) => p.status === 'Active').length;
        this.totalAssignments = assignments.length;

        // Build project overview with team size
        this.projectOverview = projects.slice(0, 8).map((p) => ({
          ...p,
          teamSize: assignments.filter((a) => a.projectId === p._id && ['Planned','Active'].includes(a.status)).length,
        }));

        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard load error:', err);
        this.errorMessage = 'Failed to load dashboard data. Please refresh.';
        this.loaded = true;
        this.cdr.detectChanges();
      },
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
}
