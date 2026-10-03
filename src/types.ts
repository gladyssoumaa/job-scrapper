export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  url: string;
  tags: string[];
  skills?: string[];
  seniority?: string;
}