import { Severity } from './severity.enum';

export interface Alert {
  severity: Severity;
  exclamation: string;
  message: string;
}
