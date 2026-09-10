import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalConstant } from '../globalConstant/global.constant';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);

  if (localData) {
    const user = JSON.parse(localData);

    if (user.role === 'admin') {
      return true;
    }
    
    router.navigateByUrl('/employee/dashboard');
    return false;
  }

  router.navigateByUrl('/login');
  return false;
};

export const employeeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);

  if (localData) {
    const user = JSON.parse(localData);

    if (user.role !== 'admin') {
      return true; 
    }

    router.navigateByUrl('/admin/dashboard');
    return false;
  }

  router.navigateByUrl('/login');
  return false;
};