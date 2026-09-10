import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GlobalConstant } from '../../core/globalConstant/global.constant';

@Component({
  selector: 'app-employee-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './employee-layout.html',
  styleUrl: './employee-layout.css',
})
export class EmployeeLayout {
  isSidebarCollapsed = false;
  loggedUserData: any = null;
  router = inject(Router);

  constructor() {
    const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);
    if (localData) {
      this.loggedUserData = JSON.parse(localData);
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onLogOff(): void {
    localStorage.removeItem(GlobalConstant.LOGIN_LOCAL_KEY);
    this.router.navigateByUrl('/login');
  }
}
