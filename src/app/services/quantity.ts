import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuantityInputRequest, ConvertRequest, ArithmeticRequest, QuantityResponse,
} from '../models/quantity.models';

const API_BASE = 'http://localhost:5098/api/v1';

@Injectable({ providedIn: 'root' })
export class QuantityService {

  constructor(private http: HttpClient) {}

  compare(body: QuantityInputRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${API_BASE}/quantities/compare`, body);
  }

  convert(body: ConvertRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${API_BASE}/quantities/convert`, body);
  }

  add(body: ArithmeticRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${API_BASE}/quantities/add`, body);
  }

  subtract(body: ArithmeticRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${API_BASE}/quantities/subtract`, body);
  }

  divide(body: QuantityInputRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${API_BASE}/quantities/divide`, body);
  }

  getCount(operation: string): Observable<number> {
    return this.http.get<number>(`${API_BASE}/quantities/count/${operation}`);
  }

  getByOperation(operation: string): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${API_BASE}/quantities/history/operation/${operation}`);
  }

  getByType(type: string): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${API_BASE}/quantities/history/type/${type}`);
  }

  getErrored(): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${API_BASE}/quantities/history/errored`);
  }

  // NEW: get all history without filter
  getAll(): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${API_BASE}/quantities/history/all`);
  }
}