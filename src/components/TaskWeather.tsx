import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Cloud, CloudRain, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Task } from '../types';

const DraggableTask = ({ task, index }: { task: Task; index: number }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  // Random styling for cloud-like appearance
  const sizes = ['text-[8px]', 'text-xs', 'text-sm'];
  const rotations = ['-rotate-3', '-rotate-2', '-rotate-1', 'rotate-0', 'rotate-1', 'rotate-2', 'rotate-3'];
  const colors = [
    'bg-slate-700/90 border-slate-600 text-white',
    'bg-blue-900/80 border-blue-800 text-white',
    'bg-white/90 border-white/60 text-slate-800',
    'bg-slate-600/90 border-slate-500 text-white',
    'bg-blue-800/80 border-blue-700 text-white',
    'bg-gray-700/90 border-gray-600 text-white',
  ];

  // Generate pseudo-random positions based on task id
  const hash = task.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const sizeClass = sizes[index % sizes.length];
  const rotateClass = rotations[hash % rotations.length];
  const colorClass = colors[hash % colors.length];

  // Generate pseudo-random but consistent base position based on hash
  const xSeed = (hash * 7) % 100;
  const ySeed = (hash * 13) % 100;
  const baseX = (xSeed / 100) * 95; // 0% to 95% of container width (in %)
  const baseY = (ySeed / 100) * 90; // 0% to 90% of container height (in %)

  // Calculate final transform: combine drag transform with saved position offset
  // Don't include transform in style if not dragging (let motion.div handle animation)
  let finalTransform: string | undefined;
  
  if (isDragging) {
    // Only apply transform during drag
    if (task.position && transform) {
      // Combine saved offset with current drag
      const dragX = transform.x || 0;
      const dragY = transform.y || 0;
      finalTransform = `translate3d(${task.position.x + dragX}px, ${task.position.y + dragY}px, 0)`;
    } else if (task.position) {
      // Just saved position
      finalTransform = `translate3d(${task.position.x}px, ${task.position.y}px, 0)`;
    } else if (transform) {
      // Just drag transform
      finalTransform = CSS.Translate.toString(transform);
    }
  } else if (task.position) {
    // Not dragging, but has saved position - apply it
    finalTransform = `translate3d(${task.position.x}px, ${task.position.y}px, 0)`;
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${baseX}%`,
    top: `${baseY}%`,
    transform: finalTransform || undefined,
    touchAction: 'none',
    zIndex: isDragging ? 50 : 1,
  };

  // Create unique animation delay for this task
  const animationDelay = (hash % 10) * 0.2;
  const animationDuration = 3 + (hash % 3);
  
  // Custom animation name based on hash for variety
  const animationName = hash % 2 === 0 ? 'float' : 'float-alt';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div
        style={{
          animationName: isDragging ? 'none' : animationName,
          animationDuration: `${animationDuration}s`,
          animationDelay: `${animationDelay}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out',
        }}
        className={`px-3 py-1.5 ${colorClass} backdrop-blur-sm rounded-full ${sizeClass} cursor-grab active:cursor-grabbing hover:scale-110 border shadow-lg ${rotateClass}`}
      >
        {task.text}
      </div>
    </div>
  );
};

export const TaskWeather = () => {
  const { taskPool, addTask, weather } = useAppContext();
  const [newTaskText, setNewTaskText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkTaskText, setBulkTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
      setShowInput(false);
    }
  };

  const handleBulkAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkTaskText.trim()) {
      // Split by comma, trim whitespace, and filter out empty strings
      const tasks = bulkTaskText
        .split(',')
        .map(task => task.trim())
        .filter(task => task.length > 0);
      
      tasks.forEach(task => addTask(task));
      
      setBulkTaskText('');
      setShowBulkInput(false);
    }
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
      className={`relative min-h-[140px] bg-gradient-to-br ${weatherStyles[weather]} transition-all duration-[3000ms] ease-in-out p-4 rounded-xl border border-slate-700/50`}
    >
      {/* Weather Icon */}
      <div className="absolute top-3 right-3">
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
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-white mb-0.5">Task Cloud</h2>
            <p className="text-xs text-gray-300">
              {taskPool.length} {taskPool.length === 1 ? 'task' : 'tasks'} floating
            </p>
          </div>

          {!showInput && !showBulkInput ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowInput(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Task
              </button>
              <button
                onClick={() => setShowBulkInput(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Bulk Add
              </button>
            </div>
          ) : showInput ? (
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What's on your mind?"
                className="px-3 py-1.5 text-sm bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-mint border border-white/20"
                autoFocus
                onBlur={() => {
                  if (!newTaskText.trim()) setShowInput(false);
                }}
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-sm bg-accent-mint text-slate-900 font-semibold rounded-lg hover:bg-green-300 transition-colors"
              >
                Add
              </button>
            </form>
          ) : (
            <form onSubmit={handleBulkAdd} className="flex gap-2">
              <input
                type="text"
                value={bulkTaskText}
                onChange={(e) => setBulkTaskText(e.target.value)}
                placeholder="task1, task2, task3..."
                className="px-3 py-1.5 text-sm bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-mint border border-white/20 min-w-[250px]"
                autoFocus
                onBlur={() => {
                  if (!bulkTaskText.trim()) setShowBulkInput(false);
                }}
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-sm bg-accent-mint text-slate-900 font-semibold rounded-lg hover:bg-green-300 transition-colors"
              >
                Add All
              </button>
            </form>
          )}
        </div>

        {/* Task Pool */}
        <div className="relative min-h-[150px] w-full">
          {taskPool.map((task, index) => (
            <DraggableTask key={task.id} task={task} index={index} />
          ))}
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
      </div>
    </div>
  );
};

