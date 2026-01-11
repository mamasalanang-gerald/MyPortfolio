import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile, Skill } from '../../models/profile.model';
import { PROFILE_DATA } from '../../data/profile.data';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  @Input() profile: Profile = PROFILE_DATA;

  get frontendSkills(): Skill[] {
    return this.profile.skills.filter(skill => skill.category === 'frontend');
  }

  get backendSkills(): Skill[] {
    return this.profile.skills.filter(skill => skill.category === 'backend');
  }

  get toolsSkills(): Skill[] {
    return this.profile.skills.filter(skill => skill.category === 'tools');
  }

  get otherSkills(): Skill[] {
    return this.profile.skills.filter(skill => skill.category === 'other');
  }

  get hasPhoto(): boolean {
    return !!this.profile.photoUrl && this.profile.photoUrl.trim().length > 0;
  }
}
