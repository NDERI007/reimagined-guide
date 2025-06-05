// JobStore.tsx
import React, { useRef } from 'react'; // useRef is used to avoid re-running logic.
import type { JOB } from '../schema/types';
import { fetchJobs, addJob } from '../api/joBReq';

// Internal store and subscribers
let jobList: JOB[] = [];
let queryParams = {
  search: '',
  page: 1,
  limit: 10,
};
const subscribers = new Set<() => void>(); //A Set of functions (listeners) to call when the data changes — like setState, but manual.

// Core store methods
export const getJobs = () => jobList;

export const subscribe = (callback: () => void) => {
  //Adds a component’s re-render function (callback) to the list.

  subscribers.add(callback);
  return () => subscribers.delete(callback); //Returns an unsubscribe function to clean up when the component unmounts.
};

const notify = () => {
  console.log('[STORE] NOTIFYING SUBS');
  subscribers.forEach((callback) => callback()); //Notifies all subscribed components that the job list has changed by triggering re-renders.
};

export const loadJobs = async (params?: Partial<typeof queryParams>) => {
  queryParams = { ...queryParams, ...params };
  jobList = await fetchJobs(queryParams);
  notify();
};

const addNewJob = async (job: Omit<JOB, 'id'>) => {
  const newJob = await addJob(job);
  jobList = [...jobList, newJob];
  console.log('[Store] Job added:', jobList); // <- this should log the new state
  notify();
};

// React hook to use in components
export const useJobStore = () =>
  React.useSyncExternalStore(
    subscribe, //each component subscribes to what it needs, Only the components using useJobStore() are re-rendered.
    getJobs, //Tells react how to read the current value
    getJobs, //Used for server side rendering falback, The getServerSnapshot function provides a safe, static version of the data that React can use when rendering on the server.
    //React wasn't built for SSR setup sIf you try to access them on the server, Node.js will crash with an error like:
    //ReferenceError: window is not defined
  );

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
