import { Profile } from '../models/profile.model';

export const PROFILE_DATA: Profile = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  tagline: 'Building modern web experiences with passion and precision',
  bio: `I'm a passionate full-stack developer with over 5 years of experience 
creating elegant, efficient, and user-friendly web applications. I specialize 
in Angular, React, and Node.js, with a strong foundation in TypeScript and 
modern development practices.

When I'm not coding, you can find me exploring new technologies, contributing 
to open-source projects, or sharing knowledge through technical writing and 
mentoring.`,
  photoUrl: 'assets/images/profile.jpg',
  email: 'john.doe@example.com',
  skills: [
    { name: 'Angular', category: 'frontend', icon: 'angular' },
    { name: 'React', category: 'frontend', icon: 'react' },
    { name: 'TypeScript', category: 'frontend', icon: 'typescript' },
    { name: 'HTML/CSS', category: 'frontend', icon: 'html5' },
    { name: 'SCSS', category: 'frontend', icon: 'sass' },
    { name: 'Node.js', category: 'backend', icon: 'nodejs' },
    { name: 'Express', category: 'backend', icon: 'express' },
    { name: 'PostgreSQL', category: 'backend', icon: 'postgresql' },
    { name: 'MongoDB', category: 'backend', icon: 'mongodb' },
    { name: 'Git', category: 'tools', icon: 'git' },
    { name: 'Docker', category: 'tools', icon: 'docker' },
    { name: 'AWS', category: 'tools', icon: 'aws' },
    { name: 'Figma', category: 'other', icon: 'figma' },
    { name: 'Agile/Scrum', category: 'other', icon: 'agile' }
  ],
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/johndoe', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe', icon: 'linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com/johndoe', icon: 'twitter' }
  ]
};
