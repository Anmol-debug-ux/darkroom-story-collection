import { contact, tools } from './content';
export const profile = {
  name: 'Anmol Srivastava', role: 'AI Creative Automation Specialist', city: 'Gorakhpur, India',
  bio: 'AI artist, content creator, and B.Tech student. I bring creative ideas to life through design, AI production, and automation.',
  email: contact.email, linkedin: contact.linkedin, youtube: contact.youtube,
};
export const portfolioTools = tools.map(([name]) => name);
export const selectedWork = [
  { title: 'Success Panel', category: 'CONTENT / EDUCATION', summary: 'Student-guidance content for JEE and NEET aspirants.', points: ['Scriptwriting and educational content', 'YouTube channel for student guidance'], tags: ['Content creation', 'Scriptwriting'], href: contact.youtube, linkLabel: 'View channel' },
  { title: 'Scheme Sathi', category: 'SMART INDIA HACKATHON / 2026', summary: 'A project for Smart India Hackathon 2026.', points: ['Hackathon project', 'Built around Scheme Sathi'], tags: ['SIH 2026', 'Web project'] },
  { title: 'ESP32 Maze Robocar', category: 'HARDWARE / ROBOTICS', summary: 'An ESP32-based maze robocar project.', points: ['ESP32 hardware', 'Maze-solving robotics'], tags: ['ESP32', 'Robotics'] },
  { title: 'StudySync', category: 'WEB PROJECT', summary: 'A study-focused web project.', points: ['Student-focused project', 'Web development'], tags: ['StudySync', 'Web'] },
  { title: 'Vice Streets', category: 'GAME PROJECT', summary: 'A game project exploring interactive experiences.', points: ['Game development project', 'Interactive experience'], tags: ['Game development'] },
  { title: 'Vellum', category: 'STUDY PRODUCTS', summary: 'Study products for students.', points: ['Student-focused products', 'Educational content'], tags: ['Education', 'Products'] },
];
export const records = [
  { date: 'EDUCATION', title: 'B.Tech student', detail: 'Madan Mohan Malaviya University of Technology', label: 'Gorakhpur, India' },
  { date: '2026', title: 'Smart India Hackathon', detail: 'Scheme Sathi', label: 'Hackathon project' },
  { date: 'CREATIVE PRACTICE', title: 'AI art, content & automation', detail: 'Design, video production, and creative automation', label: 'Independent projects' },
];
export const skills = [
  { label: '01 / DESIGN', items: ['AI graphic design', 'Character design', 'Thumbnails', 'Presentation design'] },
  { label: '02 / MOTION', items: ['AI video production', 'AI avatars', '2D animation', 'Cinematic AI films'] },
  { label: '03 / SYSTEMS', items: ['Prompt engineering', 'Creative automation', 'n8n · Zapier · Make', 'Content creation'] },
];