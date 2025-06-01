import axios from 'axios';
import type { JOB } from '../schema/types';

const ApI_URl = import.meta.env.VITE_API_URL;

export const fetchJobs = async () => {
  const response = await axios.get<JOB[]>(`${ApI_URl}/api/jobs`);
  return response.data;
};

export const addJob = async (job: Omit<JOB, 'id'>) => {
  const response = await axios.post<JOB>(`${ApI_URl}/api/jobs`, job); //<JOB>: tells TypeScript what you expect to get back (usually the full job including its new ID)
  //If you don’t pass the job, your backend has no data to save.
  return response.data; // returns the created job
};
