import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AdminService, AdminUser, AdminRecord } from '../../services/admin';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, NavbarComponent, SidebarComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {

  activeTab: 'users' | 'records' = 'users';
  activeSection = 'admin';

  users:   AdminUser[]   = [];
  records: AdminRecord[] = [];

  loadingUsers:   boolean = false;
  loadingRecords: boolean = false;
  errorUsers:     string  = '';
  errorRecords:   string  = '';

  constructor(
    private adminSvc: AdminService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onSectionChange(section: string): void {
    if (section === 'home') {
      this.router.navigate(['/dashboard']);
    } else if (section === 'history') {
      this.router.navigate(['/history']);
    } else if (['compare', 'convert', 'add', 'subtract', 'divide'].includes(section)) {
      this.router.navigate(['/dashboard'], { queryParams: { section: section } });
    } else {
      this.activeSection = section;
    }
  }

  showTab(tab: 'users' | 'records'): void {
    this.activeTab = tab;
    if (tab === 'users'   && this.users.length   === 0) this.loadUsers();
    if (tab === 'records' && this.records.length === 0) this.loadRecords();
    this.cdr.detectChanges();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.errorUsers   = '';
    this.cdr.detectChanges();
    
    this.adminSvc.getAllUsers().subscribe({
      next:  data => { this.loadingUsers = false; this.users = data; this.cdr.detectChanges(); },
      error: (err: Error) => { this.loadingUsers = false; this.errorUsers = err.message; this.cdr.detectChanges(); },
    });
  }

  loadRecords(): void {
    this.loadingRecords = true;
    this.errorRecords   = '';
    this.cdr.detectChanges();

    this.adminSvc.getAllRecords().subscribe({
      next:  data => { this.loadingRecords = false; this.records = data; this.cdr.detectChanges(); },
      error: (err: Error) => { this.loadingRecords = false; this.errorRecords = err.message; this.cdr.detectChanges(); },
    });
  }

  promoteUser(userId: number, userName: string): void {
    if (!confirm(`Make ${userName} an Admin?`)) return;
    this.adminSvc.promoteUser(userId).subscribe({
      next:  () => { alert(`${userName} is now Admin`); this.loadUsers(); },
      error: (err: Error) => { alert('Failed: ' + err.message); this.cdr.detectChanges(); },
    });
  }
}