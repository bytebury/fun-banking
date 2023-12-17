import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  getAnnouncements(): Observable<Announcement[]> {
    return of([
      {
        id: '123',
        title: 'New Fun Banking',
        description: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '123',
        title: 'New Fun Banking this one is going to be longer than most',
        description: '',
        created_at: new Date('2023-10-16'),
        updated_at: new Date(),
      },
    ]);
  }
}
