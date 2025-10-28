import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Cloud, CloudRain, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Task } from '../types';
import { getRandomPhrase, taskDropMessages } from '../utils/microcopy';

const DraggableTask = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      className="px-4 py-2 bg-slate-700/80 backdrop-blur-sm text-white rounded-full text-sm cursor-grab active:cursor-grabbing hover:bg-slate-600/80 transition-colors border border-slate-600"
    >
      {task.text}
    </motion.div>
  );
};

export const TaskWeather = () => {
  const { taskPool, addTask, weather } = useAppContext();
  const [newTaskText, setNewTaskText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
      setShowInput(false);
    }
  };

  const showMessage = () => {
    setMessage(getRandomPhrase(taskDropMessages));
    setTimeout(() => setMessage(''), 3000);
  };

  const weatherStyles = {
    stormy: 'from-weather-stormy-start to-weather-stormy-end',
    cloudy: 'from-weather-cloudy-start to-weather-cloudy-end',
    clear: 'from-weather-clear-start to-weather-clear-end',
    sunny: 'from-weather-sunny-start to-weather-sunny-end',
  };

  const weatherIcons = {
    stormy: <CloudRain className="w-8 h-8 text-blue-300" />,
    cloudy: <Cloud className="w-8 h-8 text-gray-300" />,
    clear: <Cloud className="w-8 h-8 text-sky-300" />,
    sunny: <Sun className="w-8 h-8 text-amber-300" />,
  };

  return (
    <div
      className={`relative min-h-[300px] bg-gradient-to-br ${weatherStyles[weather]} transition-all duration-[3000ms] ease-in-out p-8 rounded-2xl border border-slate-700/50`}
    >
      {/* Weather Icon */}
      <div className="absolute top-4 right-4">
        {weatherIcons[weather]}
      </div>

      {/* Rain overlay for stormy weather */}
      {weather === 'stormy' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-blue-400/30 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Task Cloud</h2>
            <p className="text-sm text-gray-300">
              {taskPool.length} {taskPool.length === 1 ? 'task' : 'tasks'} floating
            </p>
          </div>

          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          ) : (
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What's on your mind?"
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-mint border border-white/20"
                autoFocus
                onBlur={() => {
                  if (!newTaskText.trim()) setShowInput(false);
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent-mint text-slate-900 font-semibold rounded-lg hover:bg-green-300 transition-colors"
              >
                Add
              </button>
            </form>
          )}
        </div>

        {/* Task Pool */}
        <div className="flex flex-wrap gap-3 min-h-[120px]">
          <AnimatePresence mode="popLayout" onExitComplete={showMessage}>
            {taskPool.map((task) => (
              <DraggableTask key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>

        {taskPool.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-white/60"
          >
            ✨ Clear skies. No tasks in the cloud.
          </motion.div>
        )}

        {/* Encouragement Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-accent-mint text-slate-900 rounded-lg font-medium"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

