import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeModel } from '../../core/model/classes/Employee.model';
import { EmployeeService } from '../../core/model/services/employee-service';
import { MasterSrv } from '../../core/model/services/master-srv';
import { IApiResponseModel, IChildDept, IparentDept } from '../../core/model/interfaces/User.Model';

@Component({
  selector: 'app-employee-form',
  imports: [FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {

  employeeobj: EmployeeModel = new EmployeeModel();

  empSrv    = inject(EmployeeService);
  masterSrv = inject(MasterSrv);
  route     = inject(ActivatedRoute);
  router    = inject(Router);

  parentDeptList: WritableSignal<IparentDept[]> = signal([]);
  childDeptList:  WritableSignal<IChildDept[]>  = signal([]);

  isEditMode = false;
  editEmployeeId = '';

  ngOnInit(): void {
    this.getParentDept().subscribe(() => {
      const id = this.route.snapshot.queryParams['id'];
      if (id) {
        this.isEditMode    = true;
        this.editEmployeeId = id;
        this.loadEmployeeData(id);
      }
    });
  }

  loadEmployeeData(id: string): void {
    this.empSrv.getEmployeeById(id).subscribe({
      next: (res: IApiResponseModel) => {
        if (res.result) {
          const emp = res.data;
          this.employeeForm.employeeName    = emp.employeeName;
          this.employeeForm.emailId         = emp.emailId;
          this.employeeForm.contactNo       = emp.contactNo;
          this.employeeForm.password        = emp.password;
          this.employeeForm.gender          = emp.gender;
          this.employeeForm.role            = emp.role;
          
          const childDeptId = emp.deptId;
          const parentDepts = this.parentDeptList();

          const requests = parentDepts.map(p => this.masterSrv.getAllChildDeptByParentId(p.departmentId));
          
          forkJoin(requests).subscribe((childDeptResults: IApiResponseModel[]) => {
            for (let i = 0; i < childDeptResults.length; i++) {
              const found = childDeptResults[i].data.find((c: IChildDept) => c.childDeptId == childDeptId);
              if (found) {
                this.employeeForm.parentDepartment = parentDepts[i].departmentId.toString();
                this.childDeptList.set(childDeptResults[i].data);
                this.employeeForm.childDepartment = childDeptId.toString();
                this.employeeForm.deptId = childDeptId;
                break;
              }
            }
          });
        }
      },
      error: (err: any) => {
        alert('Failed to load employee data: ' + err?.error?.message);
      }
    });
  }

  getParentDept() {
    const obs = this.masterSrv.getAllParentDept();
    obs.subscribe({
      next: (res: IApiResponseModel) => {
        this.parentDeptList.set(res.data);
      }
    });
    return obs;
  }

  onChangeParent(event: any): void {
    const id = event.target.value;
    this.masterSrv.getAllChildDeptByParentId(id).subscribe({
      next: (res: IApiResponseModel) => {
        this.childDeptList.set(res.data);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/employee-list']);
  }

  onSaveEmp(form: NgForm): void {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }
    this.employeeobj.employeeName = this.employeeForm.employeeName;
    this.employeeobj.emailId      = this.employeeForm.emailId;
    this.employeeobj.contactNo    = this.employeeForm.contactNo;
    this.employeeobj.password     = this.employeeForm.password;
    this.employeeobj.gender       = this.employeeForm.gender;
    this.employeeobj.role         = this.employeeForm.role;
    this.employeeobj.deptId       = this.employeeForm.childDepartment as any;

    if (this.isEditMode) {
      this.empSrv.updateEmployee(this.editEmployeeId, this.employeeobj).subscribe({
        next: (res: any) => {
          alert('Employee Updated Successfully!');
          this.router.navigate(['/admin/employee-list']);
        },
        error: (err: any) => {
          console.error('Update Error:', err);
          alert('Error: ' + (err?.error?.message || err?.message || 'Something went wrong'));
        }
      });
    } else {
      this.empSrv.onCreateEmployee(this.employeeobj).subscribe({
        next: (res: EmployeeModel) => {
          alert('Employee Created Successfully!');
          this.router.navigate(['/admin/employees']);
        },
        error: (err: any) => {
          console.error('Create Error:', err);
          alert('Error: ' + (err?.error?.message || err?.message || 'Something went wrong'));
        }
      });
    }
  }

  employeeForm = {
    employeeName:     '',
    contactNo:        '',
    emailId:          '',
    deptId:           0,
    password:         '',
    gender:           '',
    role:             '',
    parentDepartment: '',
    childDepartment:  '',
  };

  onChildDepartmentChange(): void {
    this.employeeForm.deptId = this.employeeForm.childDepartment as any;
  }
}
