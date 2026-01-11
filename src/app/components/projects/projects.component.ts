import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { ProjectCardComponent } from './project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  
  projects: Project[] = [];

  ngOnInit(): void {
    this.projects = this.projectService.getProjects();
  }
}
