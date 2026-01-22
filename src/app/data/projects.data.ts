import { Project } from '../models/project.model';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'pomodify',
    title: 'Pomodify',
    description: `A custom Pomodoro timer application with advanced features for productivity enhancement. 
Built with Angular frontend, Spring Boot backend, and PostgreSQL database. Features include customizable 
work/break intervals, task tracking, progress analytics, real-time notifications, and cloud synchronization. 
Deployed on AWS with Docker containerization and automated CI/CD pipelines via GitHub Actions.`,
    shortDescription: 'Advanced Pomodoro timer with full-stack architecture',
    thumbnailUrl: 'assets/images/pomodify.jpg',
    technologies: ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker', 'AWS', 'GitHub Actions'],
    liveUrl: 'https://pomodify.site',
    featured: true,
    category: 'Web Application',
    completedDate: new Date('2025-01-20')
  },
  {
    id: 'stackovercash',
    title: 'StackOvercash',
    description: `A comprehensive banking system built with vanilla PHP backend and HTML/CSS/JavaScript frontend. 
Features include user account management, fund transfers, transaction history, balance inquiries, and secure 
authentication. The application demonstrates full-stack development with clean separation of concerns. 
Deployed on AWS with GitHub Actions for continuous integration and deployment.`,
    shortDescription: 'Full-featured banking system with PHP and vanilla JavaScript',
    thumbnailUrl: 'assets/images/stackovercash.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Git', 'GitHub Actions', 'AWS'],
    liveUrl: 'https://www.youtube.com/watch?v=YT7I0XK5CX4',
    featured: true,
    category: 'Web Application',
    completedDate: new Date('2025-01-10')
  },
  {
    id: 'intelliquiz',
    title: 'IntelliQuiz',
    description: `A real-time intranet-based quiz bee system designed for competitive learning environments. 
Built with React TypeScript and Vite frontend, Spring Boot Java backend, featuring real-time question delivery, 
live scoring, and instant result analytics. Includes Python automation scripts for quiz management and data processing. 
Containerized with Docker and deployed with GitHub Actions CI/CD pipelines for seamless updates and scalability.`,
    shortDescription: 'Real-time intranet quiz system with live scoring',
    thumbnailUrl: 'assets/images/intelliquiz.jpg',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Spring Boot', 'Java', 'Docker', 'GitHub Actions', 'Python'],
    featured: true,
    category: 'Web Application',
    completedDate: new Date('2025-01-25'),
    status: 'ongoing'
  },
  {
    id: 'mentors-society',
    title: 'Mentors\' Society Organization Management System',
    description: `A comprehensive organization management system designed for the Mentors' Society. 
Features include event management, inventory tracking, scheduling management, file management, and member administration. 
Built with Vue.js and Vite frontend with Tailwind CSS styling, Laravel PHP backend, and MySQL database. 
Includes Node.js/npm tooling, Docker containerization, and Composer for dependency management.`,
    shortDescription: 'Full-featured organization management system with event and inventory tracking',
    thumbnailUrl: 'assets/images/mentors.png',
    technologies: ['Vue.js', 'Vite', 'Tailwind CSS', 'Laravel', 'PHP', 'MySQL', 'Node.js', 'npm', 'Docker', 'Composer', 'Git'],
    sourceUrl: 'https://github.com/victorioso-daniel/mentors-society',
    featured: true,
    category: 'Web Application',
    completedDate: new Date('2025-01-18')
  },
  {
    id: 'focusly',
    title: 'Focusly',
    description: `A smart task management and productivity app with integrated Pomodoro timer for Android. 
Built with Kotlin and AndroidX, featuring Material Design UI with ConstraintLayout. Includes Room ORM for local data persistence, 
Google Sign-In authentication, and comprehensive testing with JUnit 4 and Espresso. Leverages Kotlin Coroutines for async operations, 
ViewModel for lifecycle management, and WorkManager for background tasks.`,
    shortDescription: 'Smart task management and productivity app with Pomodoro timer',
    thumbnailUrl: 'assets/images/focuslyv2.png',
    technologies: ['Kotlin', 'AndroidX', 'Material Design', 'Room ORM', 'SQLite', 'Kotlin Coroutines', 'ViewModel', 'WorkManager', 'Google Sign-In', 'JUnit 4', 'Espresso'],
    sourceUrl: 'https://github.com/piadozo-edriane/focusly-group-awawak',
    featured: true,
    category: 'Mobile Application',
    completedDate: new Date('2025-01-22')
  },
  {
    id: 'enrollment-management-system',
    title: 'Enrollment Management System',
    description: `A comprehensive enrollment management system designed for academic institutions. 
Built with HTML, CSS, and JavaScript frontend with PHP backend and MySQL database. Features role-based access control (RBAC), 
MVC-style architecture, secure session-based authentication with bcrypt password hashing, and CSRF protection. 
Includes PDF generation capabilities with FPDF library. Deployed on XAMPP with Apache server.`,
    shortDescription: 'Academic enrollment system with role-based access control',
    thumbnailUrl: 'assets/images/dba.png',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'FPDF', 'bcrypt', 'CSRF Protection', 'Session Auth', 'XAMPP', 'Apache'],
    liveUrl: 'https://youtu.be/TKFGGFvKQAM?si=dEaV2U8FGOjapnps',
    sourceUrl: 'https://github.com/mamasalanang-gerald/Enrollment-Management-System',
    featured: true,
    category: 'Web Application',
    completedDate: new Date('2025-01-19')
  }
];
