import React from 'react';
import { type JOB } from '../schema/types';

const JobCard: React.FC<{ job: JOB }> = ({ job }) => {
  const statusColor = {
    Saved: 'bg-yellow-100 text-yellow-800',
    Interview: 'bg-blue-100 text-blue-800',
    Rejected: 'bg-red-100 text-red-800',
  }[job.status];

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor}`}
        >
          {job.status}
        </span>
      </div>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-400">{job.location}</p>
    </div>
  );
};

export default JobCard;
