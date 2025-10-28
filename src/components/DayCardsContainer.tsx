import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { DayCard } from './DayCard';
import { WEEK_DATES, getDateKey } from '../utils/dateUtils';
import { Task } from '../types';

export const DayCardsContainer = () => {
  const { weekData, assignTaskToDay } = useAppContext();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [shakeCardId, setShakeCardId] = useState<string | null>(null);
  const [rejectMessage, setRejectMessage] = useState('');

  const handleDragStart = (event: DragEndEvent) => {
    const task = event.active.data.current?.task;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;

    if (over) {
      const taskId = active.id as string;
      const dateKey = over.id as string;

      const success = assignTaskToDay(taskId, dateKey);

      if (!success) {
        // Shake animation if rejected
        setShakeCardId(dateKey);
        setRejectMessage("That's tomorrow's problem.");
        setTimeout(() => {
          setShakeCardId(null);
          setRejectMessage('');
        }, 2000);
      }
    }
  };

  return (
    <div className="relative">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-min px-2">
            {WEEK_DATES.map((date) => {
              const dateKey = getDateKey(date);
              const dayData = weekData.get(dateKey);

              if (!dayData) return null;

              return (
                <motion.div
                  key={dateKey}
                  animate={
                    shakeCardId === dateKey
                      ? {
                          x: [-10, 10, -10, 10, 0],
                          transition: { duration: 0.4 },
                        }
                      : {}
                  }
                >
                  <DayCard date={date} dayData={dayData} />
                </motion.div>
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="px-4 py-2 bg-slate-700 text-white rounded-full text-sm shadow-lg">
              {activeTask.text}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Reject Message */}
      <AnimatePresence>
        {rejectMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg z-50 font-medium"
          >
            {rejectMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

