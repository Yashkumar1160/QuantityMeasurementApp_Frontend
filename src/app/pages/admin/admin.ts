import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AdminService, AdminUser, AdminRecord } from '../../services/admin';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, NavbarComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {

  activeTab: 'users' | 'records' = 'users';

  users:   AdminUser[]   = [];
  records: AdminRecord[] = [];

  loadingUsers:   boolean = false;
  loadingRecords: boolean = false;
  errorUsers:     string  = '';
  errorRecords:   string  = '';

  constructor(private adminSvc: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Switch tab
  showTab(tab: 'users' | 'records'): void {
    this.activeTab = tab;
    if (tab === 'users'   && this.users.length   === 0) this.loadUsers();
    if (tab === 'records' && this.records.length === 0) this.loadRecords();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.errorUsers   = '';
    this.adminSvc.getAllUsers().subscribe({
      next:  data => { this.loadingUsers = false; this.users = data; },
      error: (err: Error) => { this.loadingUsers = false; this.errorUsers = err.message; },
    });
  }

  loadRecords(): void {
    this.loadingRecords = true;
    this.errorRecords   = '';
    this.adminSvc.getAllRecords().subscribe({
      next:  data => { this.loadingRecords = false; this.records = data; },
      error: (err: Error) => { this.loadingRecords = false; this.errorRecords = err.message; },
    });
  }

  promoteUser(userId: number, userName: string): void {
    if (!confirm(`Make ${userName} an Admin?`)) return;
    this.adminSvc.promoteUser(userId).subscribe({
      next:  () => { alert(`${userName} is now Admin`); this.loadUsers(); },
      error: (err: Error) => { alert('Failed: ' + err.message); },
    });
  }
}