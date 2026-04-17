import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// All requests go through the ApiGateway (port 5000), which proxies to AdminService (port 5004)
import { environment } from '../../environments/environment';

// All requests go through the ApiGateway (port 5000), which proxies to AdminService (port 5004)
const API_BASE = environment.apiUrl;

// Shape of a user returned by admin endpoints
export interface AdminUser {
  id:          number;
  name:        string;
  email:       string;
  role:        string;
  createdAt:   string;
  lastLoginAt: string;
}

// Shape of a record returned by admin endpoints
export interface AdminRecord {
  thisValue?:           number;
  thisUnit?:            string;
  thisMeasurementType?: string;
  operation?:           string;
  resultValue?:         number;
  resultUnit?:          string;
  isError:              boolean;
  errorMessage?:        string;
  createdAt?:           string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {

  constructor(private http: HttpClient) {}

  // Get list of all users
  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${API_BASE}/admin/users`);
  }

  // Get all operation records from all users
  getAllRecords(): Observable<AdminRecord[]> {
    return this.http.get<AdminRecord[]>(`${API_BASE}/admin/records`);
  }

  // Promote a user to Admin
  promoteUser(userId: number): Observable<any> {
    return this.http.post(`${API_BASE}/admin/promote/${userId}`, {});
  }
}