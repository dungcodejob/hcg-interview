export type Repository = {
  id: number;
  name: string;
  full_name: string;
  avatar_url: string;
  description: string;
  language: string;
  watchers_count: number;
  updated_at: Date;
  owner: {
    avatar_url: string;
  };
};
