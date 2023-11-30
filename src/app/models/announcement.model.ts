import { Severity } from './severity.enum';

export interface Announcement {
  id: string;
  severity?: Severity;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
