// SearchStore.ts
import { useSyncExternalStore } from 'react';

let query = '';
const listeners = new Set<() => void>();

export const setSearchQuery = (val: string) => {
  query = val;
  listeners.forEach((l) => l());
};

export const useSearchQuery = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => query,
  );
