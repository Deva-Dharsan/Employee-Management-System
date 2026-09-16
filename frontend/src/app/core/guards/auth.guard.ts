import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalConstant } from '../globalConstant/global.constant';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);
  const token     = localStorage.getItem(GlobalConstant.TOKEN_KEY);

  if (!localData || !token) {
    router.navigateByUrl('/login');
    return false;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem(GlobalConstant.LOGIN_LOCAL_KEY);
      localStorage.removeItem(GlobalConstant.TOKEN_KEY);
      alert('Your session has expired. Please log in again.');
      router.navigateByUrl('/login');
      return false;
    }

    return true;

  } catch {
    localStorage.removeItem(GlobalConstant.LOGIN_LOCAL_KEY);
    localStorage.removeItem(GlobalConstant.TOKEN_KEY);
    router.navigateByUrl('/login');
    return false;
  }
};