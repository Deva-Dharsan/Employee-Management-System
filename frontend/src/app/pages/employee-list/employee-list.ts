import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  employeeList: any[] = [];
  loaded = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loaded = false;
    this.errorMessage = '';

    this.http.get<any>(environment.API_URL + 'GetAllEmployees').subscribe({
      next: (res) => {
        if (res.result) {
          this.employeeList = res.data;
        } else {
          this.errorMessage = res.message;
        }
        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load employees.';
        this.loaded = true;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/admin/new-employee'], { queryParams: { id } });
  }

  onDelete(id: string): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.http.delete<any>(environment.API_URL + 'DeleteEmployee', { params: { id } }).subscribe({
      next: (res) => {
        if (res.result) {
          this.employeeList = this.employeeList.filter(e => e._id !== id);
          this.cdr.detectChanges();
        } else {
          alert('Delete failed: ' + res.message);
        }
      },
      error: () => alert('Error deleting employee.')
    });
  }
}