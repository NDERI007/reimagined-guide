import React, { useState } from 'react';
//import JobCard from './JobCard';
//import JobModal from './JobModal';
import type {JOB, JobStatus} from '../schema/types';

type JobBoardProps {
  jobs: JOB[];
  searchQuery: string;
  statuses: JobStatus[];
}

const JobBoard: React.FC<JobBoardProps> = ({ jobs, searchQuery, statuses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveJob = async () => {
    try {
        
    } catch (error) {
        
    }
  }
  return (
    <div>
      {/* Add Job Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Job
        </button>
      </div>

      {/* Job Columns */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
        {statuses.map((status) => (
          <div key={status} className="rounded-xl bg-gray-50 p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              {status} Jobs
            </h2>
            <div className="space-y-3">
              {jobs
                .filter(
                  (job) =>
                    job.status === status &&
                    (job.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                      job.company
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())),
                )
                .map((job) => (
                  //<JobCard key={job.id} job={job} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Job Modal */}
      {isModalOpen && <JobModal onClose={() => setIsModalOpen(false)} onSave={handleSaveJob}/>}
    </div>
  );
};

export default JobBoard;
