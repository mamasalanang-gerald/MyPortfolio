import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;

  get hasLiveUrl(): boolean {
    return !!this.project.liveUrl;
  }

  get hasSourceUrl(): boolean {
    return !!this.project.sourceUrl;
  }

  get hasAnyLink(): boolean {
    return this.hasLiveUrl || this.hasSourceUrl;
  }

  get isOngoing(): boolean {
    return this.project.status === 'ongoing';
  }
}
