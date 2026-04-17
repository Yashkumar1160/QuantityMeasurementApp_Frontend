import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  activeTab: 'login' | 'register' = 'login';

  loginEmail:    string  = '';
  loginPassword: string  = '';
  loginEmailErr: string  = '';
  loginPassErr:  string  = '';
  loginAlert:    string  = '';
  loginLoading:  boolean = false;
  showLoginPass: boolean = false;

  regName:     string  = '';
  regEmail:    string  = '';
  regPassword:        string  = '';
  regConfirmPassword: string  = '';
  regNameErr:         string  = '';
  regEmailErr:        string  = '';
  regPassErr:         string  = '';
  regConfirmPassErr:  string  = '';
  regAlert:           string  = '';
  regLoading:         boolean = false;
  showRegPass:        boolean = false;
  showRegConfirmPass: boolean = false;

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    if (this.auth.isLoggedIn()) {
      this.redirectAfterLogin();
    }
  }

  // NEW: go to /admin if admin, else /dashboard
  redirectAfterLogin(): void {
    if (this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab  = tab;
    this.loginAlert = '';
    this.regAlert   = '';
  }

  toggleLoginPass(): void { this.showLoginPass = !this.showLoginPass; }
  toggleRegPass():         void { this.showRegPass        = !this.showRegPass; }
  toggleRegConfirmPass():  void { this.showRegConfirmPass = !this.showRegConfirmPass; }

  handleLogin(): void {
    this.loginEmailErr = '';
    this.loginPassErr  = '';
    this.loginAlert    = '';

    let valid = true;
    if (!this.loginEmail.trim()) { this.loginEmailErr = 'Email is required';    valid = false; }
    if (!this.loginPassword)     { this.loginPassErr  = 'Password is required'; valid = false; }
    if (!valid) return;

    this.loginLoading = true;
    this.cdr.detectChanges();
    this.auth.login({ email: this.loginEmail.trim(), password: this.loginPassword })
      .subscribe({
        next: () => {
          this.loginLoading = false;
          this.cdr.detectChanges();
          // role-based redirect
          this.redirectAfterLogin();    
        },
        error: (err: Error) => {
          this.loginLoading = false;
          this.loginAlert   = err.message || 'Login failed.';
          this.cdr.detectChanges();
        },
      });
  }

  handleRegister(): void {
    this.regNameErr         = '';
    this.regEmailErr        = '';
    this.regPassErr         = '';
    this.regConfirmPassErr  = '';
    this.regAlert           = '';

    let valid = true;
    if (!this.regName.trim())             { this.regNameErr         = 'Name is required';     valid = false; }
    if (!this.regEmail.trim())            { this.regEmailErr        = 'Email is required';    valid = false; }
    
    if (!this.regPassword)                { this.regPassErr         = 'Password is required'; valid = false; }
    else if (this.regPassword.length < 6) { this.regPassErr         = 'Minimum 6 characters'; valid = false; }

    if (!this.regConfirmPassword)         { this.regConfirmPassErr  = 'Confirm your password'; valid = false; }
    else if (this.regPassword !== this.regConfirmPassword) {
      this.regConfirmPassErr = 'Passwords do not match';
      valid = false;
    }

    if (!valid) return;

    this.regLoading = true;
    this.cdr.detectChanges();
    this.auth.register({ name: this.regName.trim(), email: this.regEmail.trim(), password: this.regPassword })
      .subscribe({
        next: () => {
          this.regLoading = false;
          this.cdr.detectChanges();
          // new users go to dashboard
          this.router.navigate(['/dashboard']);   
        },
        error: (err: Error) => {
          this.regLoading = false;
          this.regAlert   = err.message || 'Registration failed.';
          this.cdr.detectChanges();
        },
      });
  }
}