import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  userName: string;
  userRole: string;
  isAdmin:  boolean;

  constructor(private auth: AuthService, private router: Router) {
    this.userName = this.auth.getUserName() || 'Guest';
    this.userRole = this.auth.getUserRole() || '';
    this.isAdmin  = this.auth.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.auth.logout();
  }
}