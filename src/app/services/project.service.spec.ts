import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ProjectService } from './project.service';
import { PROJECTS_DATA } from '../data/projects.data';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ProjectService
      ]
    });
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all projects', () => {
    const projects = service.getProjects();
    expect(projects.length).toBe(PROJECTS_DATA.length);
  });

  it('should return featured projects only', () => {
    const featuredProjects = service.getFeaturedProjects();
    const expectedFeatured = PROJECTS_DATA.filter(p => p.featured);
    expect(featuredProjects.length).toBe(expectedFeatured.length);
    featuredProjects.forEach(project => {
      expect(project.featured).toBe(true);
    });
  });

  it('should return project by ID', () => {
    const project = service.getProjectById('ecommerce-platform');
    expect(project).toBeDefined();
    expect(project?.title).toBe('E-Commerce Platform');
  });

  it('should return undefined for non-existent project ID', () => {
    const project = service.getProjectById('non-existent-id');
    expect(project).toBeUndefined();
  });

  it('should return projects by category', () => {
    const webApps = service.getProjectsByCategory('Web Application');
    webApps.forEach(project => {
      expect(project.category).toBe('Web Application');
    });
  });

  it('should return all unique categories', () => {
    const categories = service.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    // Check for no duplicates
    const uniqueCategories = [...new Set(categories)];
    expect(categories.length).toBe(uniqueCategories.length);
  });
});
