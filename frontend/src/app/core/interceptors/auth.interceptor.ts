import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, from } from 'rxjs';
import { GlobalConstant } from '../globalConstant/global.constant';
import { environment } from '../../../environments/environment.development';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

// Helper to add token to request
const addTokenHeader = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  
  // Get current user data from local storage
  const getLocalData = () => {
    const localData = localStorage.getItem(GlobalConstant.LOGIN_LOCAL_KEY);
    return localData ? JSON.parse(localData) : null;
  };

  const localData = getLocalData();
  const token = localData?.token;
  
  // Attach access token to outgoing requests
  let authReq = req;
  if (token && !req.url.includes('/login') && !req.url.includes('/refresh-token')) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we get a 401 Unauthorized and we aren't already trying to login/refresh
      if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh-token')) {
        return handle401Error(authReq, next, router, getLocalData);
      }
      return throwError(() => error);
    })
  );
};

const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn, router: Router, getLocalData: () => any) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const localData = getLocalData();
    const refreshToken = localData?.refreshToken;

    if (refreshToken) {
      // Use native fetch to avoid interceptor loop
      return from(
        fetch(environment.API_URL + 'refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        }).then(res => res.json())
      ).pipe(
        switchMap((res: any) => {
          isRefreshing = false;
          
          if (res.result && res.data) {
            // Update local storage with new access token
            localData.token = res.data.token;
            localStorage.setItem(GlobalConstant.LOGIN_LOCAL_KEY, JSON.stringify(localData));
            
            refreshTokenSubject.next(res.data.token);
            return next(addTokenHeader(request, res.data.token));
          } else {
            // Refresh failed (e.g. token expired/invalid)
            forceLogout(router);
            return throwError(() => new Error('Session Expired'));
          }
        }),
        catchError((err) => {
          isRefreshing = false;
          forceLogout(router);
          return throwError(() => err);
        })
      );
    } else {
      isRefreshing = false;
      forceLogout(router);
      return throwError(() => new Error('No refresh token available'));
    }
  } else {
    // If already refreshing, wait until we have a new token in the subject
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(addTokenHeader(request, token as string));
      })
    );
  }
};

const forceLogout = (router: Router) => {
  localStorage.removeItem(GlobalConstant.LOGIN_LOCAL_KEY);
  router.navigateByUrl('/login');
};
