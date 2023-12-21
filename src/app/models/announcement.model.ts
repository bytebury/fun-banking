import { User } from './user.model';

export interface Announcement {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  user: User;
}
