// src/components/ModalWrapper.tsx
import React, { type ReactNode, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface ModalWrapperProps {
  children: ReactNode;
  onOutsideClick: () => void;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  onOutsideClick,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal if user clicks outside of modal content
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onOutsideClick();
    }
  };

  // Add event listener for outside click on mount
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return createPortal(
    <motion.div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-lg"
      >
        {children}
      </div>
    </motion.div>,
    document.body,
  );
};
