import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type DroppableProps = {
  id: string;
  children: ReactNode;
};

export const Droppable = ({ id, children }: DroppableProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`transition-colors duration-200 ${
        isOver ? 'bg-teal-100/40' : ''
      }`}
    >
      {children}
    </div>
  );
};
