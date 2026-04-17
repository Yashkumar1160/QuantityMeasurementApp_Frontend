import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuantityInputRequest, ConvertRequest, ArithmeticRequest, QuantityResponse,
} from '../models/quantity.models';

import { environment } from '../../environments/environment';

const GATEWAY = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class QuantityService {

  constructor(private http: HttpClient) {}

  compare(body: QuantityInputRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${GATEWAY}/quantities/compare`, body);
  }

  convert(body: ConvertRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${GATEWAY}/quantities/convert`, body);
  }

  add(body: ArithmeticRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${GATEWAY}/quantities/add`, body);
  }

  subtract(body: ArithmeticRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${GATEWAY}/quantities/subtract`, body);
  }

  divide(body: QuantityInputRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${GATEWAY}/quantities/divide`, body);
  }

  // These now go to HistoryService via the gateway (route: /api/v1/history/...)
  getCount(operation: string): Observable<number> {
    return this.http.get<number>(`${GATEWAY}/history/count/${operation}`);
  }

  getByOperation(operation: string): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${GATEWAY}/history/operation/${operation}`);
  }

  getByType(type: string): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${GATEWAY}/history/type/${type}`);
  }

  getErrored(): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${GATEWAY}/history/errored`);
  }

  getAll(): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${GATEWAY}/history/all`);
  }
}