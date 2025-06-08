// src/components/dRAG.tsx
// src/components/dRAG.tsx
import type { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

type DraggableProps = {
  id: string;
  children: ReactNode;
};

const Draggable = (props: DraggableProps) => {
  const { id, children } = props;

  console.log('✅ Draggable mounted with ID:', id); // This MUST log the correct ID

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={false}
      animate={{
        scale: isDragging ? 1.05 : 1,
        boxShadow: isDragging
          ? '0 10px 20px rgba(0,0,0,0.2)'
          : '0 2px 6px rgba(0,0,0,0.1)',
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

export default Draggable;
