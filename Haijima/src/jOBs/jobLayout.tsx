// JobLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { JobProvider, addNewJob } from '../jOBs/JobsTORE';
import Navbar from '../components/nav';
import JobModal from './jobModal';
import ModalWrapper from '../components/ModalWrapper';

const JobLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <JobProvider>
      <Navbar />
      <Outlet context={{ openModal: () => setIsModalOpen(true) }} />

      {isModalOpen && (
        <ModalWrapper onOutsideClick={() => setIsModalOpen(false)}>
          <JobModal
            onSave={(job) => {
              addNewJob(job);
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        </ModalWrapper>
      )}
    </JobProvider>
  );
};

export default JobLayout;
