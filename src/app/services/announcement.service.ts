import { Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';
import { Announcement } from '../models/announcement.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  constructor(private readonly http: HttpClient) {}

  get announcements$(): Observable<Announcement[]> {
    return this.http
      .get<Announcement[]>(`${environment.apiUrl}/announcements`)
      .pipe(first());
  }
}
