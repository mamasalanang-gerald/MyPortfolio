import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { PROJECTS_DATA } from '../data/projects.data';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = PROJECTS_DATA;

  /**
   * Returns all projects
   */
  getProjects(): Project[] {
    return [...this.projects];
  }

  /**
   * Returns only featured projects
   */
  getFeaturedProjects(): Project[] {
    return this.projects.filter(project => project.featured);
  }

  /**
   * Returns a project by its ID
   * @param id The project ID to search for
   * @returns The project if found, undefined otherwise
   */
  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }

  /**
   * Returns projects filtered by category
   * @param category The category to filter by
   */
  getProjectsByCategory(category: string): Project[] {
    return this.projects.filter(project => project.category === category);
  }

  /**
   * Returns all unique categories from projects
   */
  getCategories(): string[] {
    const categories = this.projects
      .map(project => project.category)
      .filter((category): category is string => category !== undefined);
    return [...new Set(categories)];
  }
}
