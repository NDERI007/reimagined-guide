export type NavbarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export type JobStatus = 'Saved' | 'Interview' | 'Rejected';

export type JOB = {
  id: number;
  title: string;
  company: string;
  location: string;
  status: JobStatus;
};
