import { useEffect } from 'react';
import JobCard from './jobCard';

import { statuses, type JobStatus } from '../schema/types';
import { loadJobs, useJobStore } from './JobsTORE';
import { useSearchQuery } from '../components/searchStore';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useOutletContext } from 'react-router-dom';

const JobBoard = () => {
  const { query } = useSearchQuery();

  const jobs = useJobStore();
  const { openModal } = useOutletContext<{ openModal: () => void }>();
  useEffect(() => {
    loadJobs({ search: query }); // on initial render or search change
  }, [query]);
  return (
    <div>
      {/* Add Job Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={openModal}
          className="rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-500"
        >
          Add Job
        </button>
      </div>

      {/* Job Columns */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
        {statuses.map((status: JobStatus) => (
          <div key={status} className="rounded-xl bg-gray-50 p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              {status} Jobs
            </h2>
            <div className="space-y-3">
              {jobs
                .filter((job) => {
                  const q = query.trim().toLowerCase();
                  return (
                    job.job_status === status &&
                    (job.title.toLowerCase().includes(q) ||
                      job.company.toLowerCase().includes(q) ||
                      job.location.toLowerCase().includes(q))
                    //If this line was missing (or miswritten), your UI would never match location-based searches,
                    // even if the backend sent back correct data.
                  );
                })
                .map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;
