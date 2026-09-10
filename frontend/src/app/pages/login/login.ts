import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalConstant } from '../../core/globalConstant/global.constant';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login implements OnInit {
  loginObj: any = {
    userName: '',
    password: '',
  };

  router = inject(Router);

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.clearLoginForm();
  }

  clearLoginForm(): void {
    this.loginObj.userName = '';
    this.loginObj.password = '';
  }

  onLogin() {
    this.http.post(environment.API_URL + 'login', this.loginObj).subscribe({
      next: (response: any) => {
        if (response.result) {
          localStorage.setItem(GlobalConstant.LOGIN_LOCAL_KEY, JSON.stringify(response.data));
          localStorage.setItem(GlobalConstant.TOKEN_KEY, response.data.token);

          if (response.data.role === 'admin') {
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.router.navigateByUrl('/employee/dashboard');
          }
        } else {
          alert(response.message);
        }
      },
      error: (err: any) => {
        debugger;
        console.log(err);
        alert('API Error: ' + (err?.error?.message || err?.message || 'Unknown error'));
      },
    });
  }
}
