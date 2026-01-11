import { Project } from '../models/project.model';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: `A full-featured e-commerce platform built with Angular and Node.js. 
Features include user authentication, product catalog, shopping cart, payment 
integration with Stripe, order management, and an admin dashboard for inventory 
and sales tracking.`,
    shortDescription: 'Full-stack e-commerce solution with Angular and Node.js',
    thumbnailUrl: 'assets/images/projects/ecommerce-thumb.jpg',
    images: [
      'assets/images/projects/ecommerce-1.jpg',
      'assets/images/projects/ecommerce-2.jpg'
    ],
    technologies: ['Angular', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
    liveUrl: 'https://ecommerce-demo.example.com',
    sourceUrl: 'https://github.com/johndoe/ecommerce-platform',
    featured: true,
    category: 'Web Application',
    completedDate: new Date('2025-01-15')
  },
  {
    id: 'task-management',
    title: 'Task Management App',
    description: `A collaborative task management application with real-time updates. 
Built with React and Firebase, featuring drag-and-drop task organization, team 
collaboration, deadline tracking, and notification system.`,
    shortDescription: 'Real-time collaborative task manager with React',
    thumbnailUrl: 'assets/images/projects/taskmanager-thumb.jpg',
    technologies: ['React', 'Firebase', 'TypeScript', 'Material-UI'],
    liveUrl: 'https://taskmanager-demo.example.com',
    sourceUrl: 'https://github.com/johndoe/task-manager',
    featured: true,
    category: 'Web Application',
    completedDate: new Date('2024-11-20')
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    description: `A responsive weather dashboard that displays current conditions 
and forecasts for multiple locations. Integrates with OpenWeatherMap API and 
features interactive charts, location search, and weather alerts.`,
    shortDescription: 'Interactive weather dashboard with forecasts',
    thumbnailUrl: 'assets/images/projects/weather-thumb.jpg',
    technologies: ['Angular', 'Chart.js', 'OpenWeatherMap API', 'SCSS'],
    liveUrl: 'https://weather-demo.example.com',
    featured: false,
    category: 'Web Application',
    completedDate: new Date('2024-09-10')
  },
  {
    id: 'portfolio-template',
    title: 'Portfolio Template',
    description: `A customizable portfolio template for developers and designers. 
Features smooth animations, responsive design, dark mode support, and easy 
configuration through JSON files.`,
    shortDescription: 'Customizable developer portfolio template',
    thumbnailUrl: 'assets/images/projects/portfolio-thumb.jpg',
    technologies: ['Angular', 'SCSS', 'TypeScript'],
    sourceUrl: 'https://github.com/johndoe/portfolio-template',
    featured: true,
    category: 'Template',
    completedDate: new Date('2024-07-05')
  },
  {
    id: 'api-documentation',
    title: 'API Documentation Generator',
    description: `A tool that automatically generates beautiful API documentation 
from OpenAPI/Swagger specifications. Features include interactive API explorer, 
code samples in multiple languages, and customizable themes.`,
    shortDescription: 'Auto-generate API docs from OpenAPI specs',
    thumbnailUrl: 'assets/images/projects/apidocs-thumb.jpg',
    technologies: ['Node.js', 'Express', 'Handlebars', 'OpenAPI'],
    sourceUrl: 'https://github.com/johndoe/api-doc-generator',
    featured: false,
    category: 'Developer Tool',
    completedDate: new Date('2024-05-18')
  },
  {
    id: 'chat-application',
    title: 'Real-Time Chat App',
    description: `A real-time chat application with support for private messages, 
group chats, file sharing, and emoji reactions. Built with Socket.io for 
real-time communication and MongoDB for message persistence.`,
    shortDescription: 'Real-time chat with Socket.io and MongoDB',
    thumbnailUrl: 'assets/images/projects/chat-thumb.jpg',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    liveUrl: 'https://chat-demo.example.com',
    sourceUrl: 'https://github.com/johndoe/chat-app',
    featured: false,
    category: 'Web Application',
    completedDate: new Date('2024-03-22')
  }
];
