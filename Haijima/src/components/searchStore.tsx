// SearchStore.ts
//Stores state: query, page,
import { useSyncExternalStore } from 'react';

let query = '';
let page = 1;

let lastSnapshot = { query, page };

export const getSearchSnapshot = () => {
  const nextSnapshot = { query, page };

  const changed =
    nextSnapshot.query !== lastSnapshot.query ||
    nextSnapshot.page !== lastSnapshot.page;

  if (changed) {
    lastSnapshot = nextSnapshot;
  }

  return lastSnapshot;
};
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

// Updaters
export const setSearchQuery = (val: string) => {
  query = val;
  page = 1; // Reset to first page when query changes
  notify();
};

export const setSearchPage = (val: number) => {
  page = val;
  notify();
};

// Hook
export const useSearchQuery = () =>
  useSyncExternalStore((cb) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }, getSearchSnapshot); //() => ({ query, status, page }), // <-- NEW OBJECT every time cause infinty renders
