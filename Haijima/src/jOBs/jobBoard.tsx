import { useEffect, useState } from 'react';
import JobCard from './jobCard';
import JobModal from './jobModal';
import { statuses, type JOB, type JobStatus } from '../schema/types';
import { addNewJob, loadJobs, useJobStore } from './JobsTORE';
import { useSearchQuery } from '../components/searchStore';

const JobBoard = () => {
  const { query } = useSearchQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jobs = useJobStore();
  console.log('[Component] Rendering jobs:', jobs); // Add this line to debug
  useEffect(() => {
    loadJobs({ search: query }); // on initial render or search change
  }, [query]);
  const handleSaveJob = async (JoB: Omit<JOB, 'id'>) => {
    try {
      await addNewJob(JoB);
      // sends the job to backend

      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save job:', error);
      // Optionally show alert
    }
  };
  return (
    <div>
      {/* Add Job Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsModalOpen(true)}
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

      {/* Job Modal */}
      {isModalOpen && (
        <JobModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveJob}
        />
      )}
    </div>
  );
};

export default JobBoard;
