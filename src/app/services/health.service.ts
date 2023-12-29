import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor(private http: HttpClient) {}

  get health$(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/health`).pipe(first());
  }

  get users$(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/health/users`).pipe(first());
  }
}
