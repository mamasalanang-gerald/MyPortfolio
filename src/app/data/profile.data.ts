import { Profile } from '../models/profile.model';

export const PROFILE_DATA: Profile = {
  name: 'Gerald Mamasalanang',
  title: 'Aspiring DevOps & Cybersecurity Engineer',
  tagline: 'Securing infrastructure and automating deployments with precision',
  bio: `I'm a 3rd year Diploma in Information Technology student at Polytechnic University of the Philippines Taguig Campus. I'm passionate about DevOps and Cybersecurity, with a focus on building secure, scalable infrastructure and mastering cloud technologies, containerization, and security best practices.

I'm committed to continuous learning and hands-on experience in infrastructure automation, system security, and cloud platforms to become a skilled DevOps and Cybersecurity professional.`,
  photoUrl: 'assets/images/profile.jpg',
  email: 'geraldkasan163@gmail.com',
  skills: [
    { name: 'Angular', category: 'frontend', icon: 'angular' },
    { name: 'React', category: 'frontend', icon: 'react' },
    { name: 'TypeScript', category: 'frontend', icon: 'typescript' },
    { name: 'HTML/CSS', category: 'frontend', icon: 'html5' },
    { name: 'SCSS', category: 'frontend', icon: 'sass' },
    { name: 'Node.js', category: 'backend', icon: 'nodejs' },
    { name: 'Java', category: 'backend', icon: 'java' },
    { name: 'Spring Boot', category: 'backend', icon: 'spring' },
    { name: 'PHP', category: 'backend', icon: 'php' },
    { name: 'Laravel', category: 'backend', icon: 'laravel' },
    { name: 'Python', category: 'backend', icon: 'python' },
    { name: 'PostgreSQL', category: 'backend', icon: 'postgresql' },
    { name: 'Git', category: 'tools', icon: 'git' },
    { name: 'Docker', category: 'tools', icon: 'docker' },
    { name: 'AWS', category: 'tools', icon: 'aws' },
    { name: 'Linux', category: 'tools', icon: 'linux' },
    { name: 'Figma', category: 'other', icon: 'figma' },
    { name: 'Agile/Scrum', category: 'other', icon: 'agile' }
  ],
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/mamasalanang-gerald', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/gerald-kasan-mamasalanang-95a306386/', icon: 'linkedin' }
  ]
};
