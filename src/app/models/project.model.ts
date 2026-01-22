export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  images?: string[];
  technologies: string[];
  liveUrl?: string;
  sourceUrl?: string;
  featured: boolean;
  category?: string;
  completedDate?: Date;
  status?: 'ongoing' | 'completed';
}
