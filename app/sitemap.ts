import type { MetadataRoute } from 'next';
import { projects } from '@/lib/data';

const BASE_URL = 'https://yourdomain.com'; // Replace with your domain

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projectRoutes,
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
