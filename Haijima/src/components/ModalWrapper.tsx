// src/components/ModalWrapper.tsx
import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

type ModalWrapperProps = {
  children: ReactNode;
  onOutsideClick: () => void;
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  onOutsideClick,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOutsideClick();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onOutsideClick]);

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onOutsideClick}
      >
        {/* 👇 Remove internal box — delegate to children */}
        <div ref={modalRef} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default ModalWrapper;
