// types.ts

export const statuses = ['Saved', 'Interview', 'Rejected'] as const;

export type JobStatus = (typeof statuses)[number];

export type JOB = {
  id: number;
  title: string;
  company: string;
  location: string;
  status: JobStatus;
};
