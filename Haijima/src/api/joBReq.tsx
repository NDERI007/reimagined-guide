import axios from 'axios';
import type { JobStatus, JOB } from '../schema/types';

// src/api/jobReq.ts
// ------------------------------------------------------------
// Centralised API helpers for Job endpoints.
// Uses axios and TypeScript generics so the rest of the
// application (stores / hooks / components) have a single
// import path for every job‑related HTTP request.
// ------------------------------------------------------------

// 🔧 API base – fall back to localhost in dev.
// You can set VITE_API_URL=http://localhost:5000 in your .env files.
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// Axios instance so we can add interceptors later (auth, logging …)
const api = axios.create({ baseURL: API_BASE });

// ------------------------------
// Types for query parameters
// ------------------------------
export type JobQuery = {
  search?: string; // fuzzy search term
  status?: JobStatus | '' | 'All'; // filter by status; "All" / "" means no filter
  page?: number; // pagination page (1‑based)
  limit?: number; // items per page (default handled on backend)
};

// ------------------------------
// Fetch jobs with optional filters & pagination
// ------------------------------
export const fetchJobs = async (query: JobQuery = {}): Promise<JOB[]> => {
  const { data } = await api.get<JOB[]>('/api/jobs', { params: query });
  return data;
};

// ------------------------------
// Add a new job
// ------------------------------
export const addJob = async (job: Omit<JOB, 'id'>): Promise<JOB> => {
  const { data } = await api.post<JOB>('/api/jobs', job);
  return data;
};

// ------------------------------
// Update an existing job (partial updates)
// ------------------------------
export const updateJobStatus = async (id: number, job_status: JobStatus) => {
  try {
    const { data } = await axios.patch(`/api/jobs/${id}`, {
      job_status,
    });

    return data.job; // optional: return updated job object
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || 'Failed to update job status';
    console.error('[updateJobStatus]', errorMsg);
    throw new Error(errorMsg);
  }
};

// ------------------------------
// Delete a job
// ------------------------------
export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/api/jobs/${id}`);
};

// ------------------------------------------------------------
// Helper – pre‑configured limits for dropdowns / page sizes.
// ------------------------------------------------------------
export const PAGE_LIMITS = [10, 20, 50] as const;
