import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input()  activeSection: string = 'home';
  @Output() sectionChange = new EventEmitter<string>();

  constructor(private auth: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  select(section: string): void {
    if (['history', 'admin'].includes(section) && !this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.sectionChange.emit(section);
  }

  goHistory(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/history']);
    }
  }

  goAdmin(): void {
    if (!this.isAdmin) return;
    this.router.navigate(['/admin']);
  }
}