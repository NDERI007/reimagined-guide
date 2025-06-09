import { useEffect } from 'react';
import JobCard from './jobCard';
import { statuses, type JobStatus } from '../schema/types';
import { loadJobs, useJobStore, updateJobStatusAndLocally } from './JobsTORE';
import { useSearchQuery } from '../components/searchStore';
import { useOutletContext } from 'react-router-dom';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { Droppable } from '../components/Drop';
import Draggable from '../components/dRAG';

const JobBoard = () => {
  const { query } = useSearchQuery();
  const jobs = useJobStore();
  const { openModal } = useOutletContext<{ openModal: () => void }>();

  useEffect(() => {
    loadJobs({ search: query });
  }, [query]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('DRAGGED:', { activeId: active.id });

    if (!active || !over || active.id === over.id) return;

    const jobIdsrt = active.id as string;
    const newStatus = over.id as JobStatus;
    const jobId = parseInt(jobIdsrt, 10);
    if (isNaN(jobId)) return;

    const job = jobs.find((j) => j.job_id === jobId);
    if (job && job.job_status !== newStatus) {
      try {
        await updateJobStatusAndLocally(job.job_id, newStatus);
      } catch (err) {
        console.error('Failed to update job status', err);
      }
    }
  };

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
          {statuses.map((status: JobStatus) => (
            <Droppable key={status} id={status}>
              <div className="min-h-[300px] rounded-xl bg-gray-50 p-4 shadow-sm">
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
                      );
                    })
                    .map((job) => (
                      <Draggable key={job.job_id} id={String(job.job_id)}>
                        <JobCard job={job} />
                      </Draggable>
                    ))}
                </div>
              </div>
            </Droppable>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default JobBoard;
