// types.d.ts
export interface Group {
  id: number;
  name: string;
  permissions: string[];
}
interface User {
  id: string;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio?: string;
  profile_picture?: string;
  is_newsletter_subscribed: boolean;
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
  profile_completion_percentage: number;
  is_profile_complete: boolean;
  is_active: boolean;
  groups: Group[];
  permissions: string[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

export interface RegisterResponse {
  username: string;
  user_id: string;
  message: string;
}
