import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Alert } from '../models/alert.model';
import { Severity } from '../models/severity.enum';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  getAlert(): Observable<Alert> {
    return of<Alert>({
      message:
        'Welcome to the new Fun Banking website. Please be sure to report any bugs via the "Send Feedback" button.',
      exclamation: '🚀',
      severity: Severity.Default,
    });
  }
}
