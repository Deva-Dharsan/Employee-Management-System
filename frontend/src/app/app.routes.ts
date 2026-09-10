import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { EmployeeList } from './pages/employee-list/employee-list';
import { EmployeeForm } from './pages/employee-form/employee-form';
import { EmployeeLayout } from './pages/employee-layout/employee-layout';
import { EmployeeDashboard } from './pages/employee-dashboard/employee-dashboard';
import { EmployeeProfile } from './pages/employee-profile/employee-profile';
import { Projects } from './pages/projects/projects';
import { ProjectForm } from './pages/project-form/project-form';
import { ProjectDetail } from './pages/project-detail/project-detail';
import { ProjectAssignment } from './pages/project-assignment/project-assignment';
import { AssignmentForm } from './pages/assignment-form/assignment-form';
import { MyProjects } from './pages/my-projects/my-projects';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/role.guard';
import { employeeGuard } from './core/guards/role.guard';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: Login
    },

    {
        path: 'admin',
        component: Layout,
        canActivate: [authGuard, adminGuard],
        children: [
            { path: 'dashboard',           component: Dashboard },
            { path: 'employee-list',       component: EmployeeList },
            { path: 'new-employee',        component: EmployeeForm },
            { path: 'projects',            component: Projects },
            { path: 'project-form',        component: ProjectForm },
            { path: 'project-detail',      component: ProjectDetail },
            { path: 'project-assignment',  component: ProjectAssignment },
            { path: 'assignment-form',     component: AssignmentForm },
        ]
    },

    {
        path: 'employee',
        component: EmployeeLayout,
        canActivate: [authGuard, employeeGuard],
        children: [
            { path: 'dashboard',    component: EmployeeDashboard },
            { path: 'profile',      component: EmployeeProfile },
            { path: 'my-projects',  component: MyProjects },
        ]
    },

    {
        path: '**',
        redirectTo: 'login'
    }
];
