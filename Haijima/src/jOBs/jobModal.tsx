import React, { useState } from 'react';
import type { JOB, JobStatus } from '../schema/types';

const JobModal: React.FC<{
  onSave: (job: Omit<JOB, 'id'>) => void;
  onClose: () => void;
}> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [job_status, setStatus] = useState<JobStatus>('Saved');

  const handleSubmit = () => {
    // Basic validation
    if (!title.trim() || !company.trim() || !location.trim()) {
      alert('All fields are required.');
      return;
    }

    try {
      // Attempt to save the job
      onSave({ title, company, location, job_status });
      onClose();
    } catch (error) {
      console.error('Failed to save job:', error);
      alert('There was an error saving the job. Please try again.');
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Add New Job</h2>
        <input
          className="mb-2 w-full rounded border border-gray-300 p-2 focus-within:outline-emerald-400 hover:border-emerald-200"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="mb-2 w-full rounded border border-gray-300 p-2 focus-within:outline-emerald-400 hover:border-emerald-200"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          className="mb-2 w-full rounded border border-gray-300 p-2 focus-within:outline-emerald-400 hover:border-emerald-200"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className="mb-4 w-full rounded border border-gray-300 p-2 outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
        >
          <option value="Saved">Saved</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button className="rounded bg-gray-300 px-4 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="rounded bg-emerald-600 px-4 py-2 text-white"
            onClick={handleSubmit}
          >
            Add Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
