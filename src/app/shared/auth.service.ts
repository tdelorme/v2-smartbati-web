import { Injectable } from '@angular/core';
import { LocalService } from './local.storage.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ApiResponse } from './model/api.response.model';
import { User } from './user/user.model';
import { Router } from '@angular/router';
import { LoginRequest } from './login/login.request';
import { LoginResponse } from './login/login.response';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'token';

  constructor(private localStorageService: LocalService,
              private http: HttpClient,
              private router: Router
  ) {

  }

  public registerUser(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>('/api/auth/register', user);
  }

  public login(loginRequest: LoginRequest): void {
    this.http.post<LoginResponse>('/api/auth/login', loginRequest)
    .subscribe({
      next: (value) => {
        this.localStorageService.clearData();
        this.localStorageService.saveData(this.tokenKey, value.jwt);
        this.router.navigate(['/dashboard']);
      }
    })
  }

  public isLoggedIn(): boolean {
    return this.localStorageService.hasData(this.tokenKey);
  }

  public logout() {
    this.localStorageService.removeData(this.tokenKey);
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? this.localStorageService.getData(this.tokenKey) : null;
  }

}
