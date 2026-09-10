import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IUser } from '../../core/model/interfaces/User.Model';
import { GlobalConstant } from '../../core/globalConstant/global.constant';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  isSidebarCollapsed = false;
  loggedUserData!: IUser;
  router = inject(Router)

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor() 
  {
    const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);
    if(localData!=null)
    {
      this.loggedUserData=JSON.parse(localData);
    }
  }
  onLogOff(): void {
    localStorage.removeItem(GlobalConstant.LOGIN_LOCAL_KEY);
    this.router.navigateByUrl('/login');
  }
}