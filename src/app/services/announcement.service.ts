import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, first, tap } from 'rxjs';
import { Announcement } from '../models/announcement.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private readonly announcement = new BehaviorSubject<Announcement | null>(
    null
  );
  private readonly announcements =
    new BehaviorSubject<PaginatedResponse<Announcement> | null>(null);

  constructor(private readonly http: HttpClient) {
    this.loadAnnouncements();
  }

  loadAnnouncement(announcementId: number): void {
    this.http
      .get<Announcement>(
        `${environment.apiUrl}/announcements/${announcementId}`
      )
      .pipe(
        first(),
        tap((announcement) => this.announcement.next(announcement))
      )
      .subscribe();
  }

  loadAnnouncements(limit = 5, page = 1): void {
    this.http
      .get<PaginatedResponse<Announcement>>(
        `${environment.apiUrl}/announcements`,
        {
          params: {
            limit,
            page,
          },
        }
      )
      .pipe(first())
      .subscribe((announcements) => this.announcements.next(announcements));
  }

  create(request: { title: string; description: string }): Observable<unknown> {
    return this.http
      .post(`${environment.apiUrl}/announcements`, request)
      .pipe(first());
  }

  update(request: { title: string; description: string }): Observable<void> {
    return this.http
      .put<void>(
        `${environment.apiUrl}/announcements/${this.announcement.value?.id}`,
        request
      )
      .pipe(
        first(),
        tap(() => this.loadAnnouncement(this.announcement.value?.id ?? 0))
      );
  }

  get announcements$(): Observable<PaginatedResponse<Announcement> | null> {
    return this.announcements.asObservable().pipe(filter(Boolean));
  }

  get announcement$(): Observable<Announcement> {
    return this.announcement.asObservable().pipe(filter(Boolean));
  }
}
