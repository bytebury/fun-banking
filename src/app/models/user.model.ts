export enum UserRole {
  Default = 0,
  Professional = 1,
  Admin = 10,
}
export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  role: UserRole;
  about?: string;
  created_at?: Date;
  updated_at?: Date;
}
