import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ProjectsComponent } from './projects.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let mockProjectService: jasmine.SpyObj<ProjectService>;

  const mockProjects: Project[] = [
    {
      id: 'project-1',
      title: 'Test Project 1',
      description: 'Full description 1',
      shortDescription: 'Short desc 1',
      thumbnailUrl: 'https://example.com/img1.jpg',
      technologies: ['Angular', 'TypeScript'],
      featured: true,
      liveUrl: 'https://live1.example.com',
      sourceUrl: 'https://github.com/test/project1'
    },
    {
      id: 'project-2',
      title: 'Test Project 2',
      description: 'Full description 2',
      shortDescription: 'Short desc 2',
      thumbnailUrl: 'https://example.com/img2.jpg',
      technologies: ['React', 'Node.js'],
      featured: false
    }
  ];

  beforeEach(async () => {
    mockProjectService = jasmine.createSpyObj('ProjectService', ['getProjects', 'getFeaturedProjects', 'getProjectById']);
    mockProjectService.getProjects.and.returnValue(mockProjects);

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ProjectService, useValue: mockProjectService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    expect(mockProjectService.getProjects).toHaveBeenCalled();
    expect(component.projects.length).toBe(2);
  });

  it('should render project cards for each project', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const projectCards = compiled.querySelectorAll('app-project-card');
    expect(projectCards.length).toBe(2);
  });

  it('should display section heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('.projects__heading');
    expect(heading?.textContent).toContain('My Projects');
  });

  it('should have proper section id for navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('#projects');
    expect(section).toBeTruthy();
  });

  it('should display empty message when no projects', () => {
    mockProjectService.getProjects.and.returnValue([]);
    const emptyFixture = TestBed.createComponent(ProjectsComponent);
    emptyFixture.detectChanges();
    
    const compiled = emptyFixture.nativeElement as HTMLElement;
    const emptyMessage = compiled.querySelector('.projects__empty');
    expect(emptyMessage?.textContent).toContain('No projects available');
    
    emptyFixture.destroy();
  });
});
