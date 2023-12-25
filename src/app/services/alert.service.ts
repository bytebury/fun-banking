import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Alert } from '../models/alert.model';
import { Severity } from '../models/severity.enum';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  getAlert(): Observable<Alert> {
    return of<Alert>({
      message:
        'Welcome to the new Fun Banking website. Please be sure to report any bugs via the "Send Feedback" button. Don\'t see your banks? The "Add an Employee" feature is being worked on.',
      exclamation: '👋',
      severity: Severity.Default,
    });
  }
}
