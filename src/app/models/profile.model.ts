export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  photoUrl?: string;
  email: string;
  skills: Skill[];
  socialLinks: SocialLink[];
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  icon?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
