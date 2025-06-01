// JobStore.tsx
import React, { useRef } from 'react';
import type { JOB } from '../schema/types';
import { fetchJobs, addJob } from '../api/joBReq';

// Internal store and subscribers
let jobList: JOB[] = [];
const subscribers = new Set<() => void>();

// Core store methods
const getJobs = () => jobList;

const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const notify = () => {
  subscribers.forEach((callback) => callback());
};

const loadJobs = async () => {
  const data = await fetchJobs();
  jobList = data;
  notify();
};

const addNewJob = async (job: Omit<JOB, 'id'>) => {
  const newJob = await addJob(job);
  jobList = [...jobList, newJob];
  notify();
};

// React hook to use in components
export const useJobStore = () =>
  React.useSyncExternalStore(subscribe, getJobs, getJobs);

// Provider just for initial loading
export const JobProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loadedRef = useRef(false);

  React.useEffect(() => {
    if (!loadedRef.current) {
      loadJobs();
      loadedRef.current = true;
    }
  }, []);

  return <>{children}</>;
};

// Export add function separately
export { addNewJob };
