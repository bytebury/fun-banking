export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  created_at?: Date;
  updated_at?: Date;
}
