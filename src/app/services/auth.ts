import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.models';

import { environment } from '../../environments/environment';

// Microservices 
const API_BASE = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login`, body).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/register`, body).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // Save all important info from the auth response
  saveSession(data: AuthResponse): void {
    sessionStorage.setItem('token',     data.token);
    sessionStorage.setItem('userName',  data.name);
    sessionStorage.setItem('userEmail', data.email);
    sessionStorage.setItem('userId',    data.userId.toString());   
    sessionStorage.setItem('userRole',  data.role);                
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token && token !== 'null' && token !== 'undefined' && token.length > 5;
  }

  getToken(): string {
    return sessionStorage.getItem('token') ?? '';
  }

  getUserName(): string {
    return sessionStorage.getItem('userName') ?? '';
  }

  getUserRole(): string {
    return sessionStorage.getItem('userRole') ?? 'User';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }
}