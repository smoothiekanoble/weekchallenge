import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { Lock, CheckCircle2, Circle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DayData } from '../types';
import { formatDate, isCurrentDay, isPastDay, isFutureDay } from '../utils/dateUtils';
import { habitLabels, reflectionPlaceholders } from '../utils/microcopy';

interface DayCardProps {
  date: Date;
  dayData: DayData;
}

export const DayCard = ({ date, dayData }: DayCardProps) => {
  const {
    updateDayStatus,
    updateHabits,
    updateReflections,
    updateScore,
    toggleTaskComplete,
    removeTaskFromDay,
  } = useAppContext();

  const dateKey = dayData.date;
  const isCurrent = isCurrentDay(date);
  const isPast = isPastDay(date);
  const isFuture = isFutureDay(date);
  const isAccessible = isCurrent || isPast;

  const { setNodeRef, isOver } = useDroppable({
    id: dateKey,
    disabled: !isAccessible,
  });

  const statusEmojis: Array<'😵' | '😐' | '😌'> = ['😵', '😐', '😌'];

  const allHabitsComplete = Object.values(dayData.habits).every(v => v);

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'bg-gray-500';
    if (score <= 6) return 'bg-blue-500';
    return 'bg-amber-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-slate-800/50 backdrop-blur-sm rounded-lg border-2 transition-all min-w-[280px] max-w-[320px] ${
        isCurrent
          ? 'border-accent-amber shadow-lg shadow-accent-amber/20 animate-glow'
          : 'border-slate-00'
      } ${isOver && isAccessible ? 'ring-2 ring-accent-mint' : ''}`}
    >
      {/* Future Day Overlay */}
      {isFuture && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md rounded-lg z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-6 h-6 text-gray-500 mx-auto mb-1" />
            <p className="text-gray-400 text-xs">Locked until {formatDate(date)}</p>
          </div>
        </div>
      )}

      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-white">{formatDate(date)}</h3>
            {isCurrent && <span className="text-[10px] text-accent-amber">Today</span>}
          </div>

          {/* Status Emoji Selector */}
          <div className="flex gap-1.5">
            {statusEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => isAccessible && updateDayStatus(dateKey, emoji)}
                disabled={!isAccessible}
                className={`text-xl transition-all ${
                  dayData.status === emoji ? 'scale-110' : 'scale-100 opacity-50 hover:opacity-100'
                } ${!isAccessible && 'cursor-not-allowed'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Task Drop Zone */}
        <div
          ref={setNodeRef}
          className={`mb-3 p-2 rounded-lg border-2 border-dashed min-h-[80px] transition-colors ${
            isOver && isAccessible
              ? 'border-accent-mint bg-accent-mint/10'
              : 'border-slate-600 bg-slate-900/30'
          }`}
        >
          <p className="text-[10px] text-gray-400 mb-1.5">Tasks ({dayData.tasks.length})</p>
          <div className="space-y-1.5">
            {dayData.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-1.5 text-xs text-white group"
              >
                <button
                  onClick={() => isAccessible && toggleTaskComplete(dateKey, task.id)}
                  disabled={!isAccessible}
                  className="flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
                  )}
                </button>
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.text}
                </span>
                <button
                  onClick={() => isAccessible && removeTaskFromDay(dateKey, task.id)}
                  disabled={!isAccessible}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove task"
                >
                  <X className="w-3.5 h-3.5 text-red-400 hover:text-red-300" />
                </button>
              </div>
            ))}
          </div>
          {dayData.tasks.length === 0 && (
            <p className="text-[10px] text-gray-500 text-center py-3">
              Drag tasks here
            </p>
          )}
        </div>

        {/* Habits */}
        <div className={`mb-3 p-2 rounded-lg ${allHabitsComplete ? 'bg-amber-400/10 border border-amber-400/30' : 'bg-slate-900/30'}`}>
          <p className="text-[10px] text-gray-400 mb-1.5">Habits</p>
          <div className="space-y-1.5">
            {(Object.keys(habitLabels) as Array<keyof typeof habitLabels>).map((key) => (
              <label key={key} className="flex items-center gap-1.5 text-xs text-white cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dayData.habits[key]}
                  onChange={(e) =>
                    isAccessible && updateHabits(dateKey, { [key]: e.target.checked })
                  }
                  disabled={!isAccessible}
                  className="w-3.5 h-3.5 rounded accent-accent-mint"
                />
                <span className="group-hover:text-accent-mint transition-colors">
                  {habitLabels[key]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reflections */}
        <div className="mb-3 space-y-2">
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">
              Where I said YES to daemon:
            </label>
            <textarea
              value={dayData.reflections.yes}
              onChange={(e) =>
                isAccessible && updateReflections(dateKey, { yes: e.target.value })
              }
              disabled={!isAccessible}
              placeholder={reflectionPlaceholders.yes}
              className="w-full px-2 py-1.5 bg-slate-900/50 text-white text-xs rounded-lg border border-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-lavender placeholder-gray-600 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1">
              Reflection:
            </label>
            <textarea
              value={dayData.reflections.no}
              onChange={(e) =>
                isAccessible && updateReflections(dateKey, { no: e.target.value })
              }
              disabled={!isAccessible}
              placeholder={reflectionPlaceholders.no}
              className="w-full px-2 py-1.5 bg-slate-900/50 text-white text-xs rounded-lg border border-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-lavender placeholder-gray-600 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1">
              How I felt (3 words):
            </label>
            <input
              type="text"
              value={dayData.reflections.feelings}
              onChange={(e) =>
                isAccessible && updateReflections(dateKey, { feelings: e.target.value })
              }
              disabled={!isAccessible}
              placeholder={reflectionPlaceholders.feelings}
              className="w-full px-2 py-1.5 bg-slate-900/50 text-white text-xs rounded-lg border border-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-lavender placeholder-gray-600"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1">
              Tomorrow I care about:
            </label>
            <input
              type="text"
              value={dayData.reflections.tomorrow}
              onChange={(e) =>
                isAccessible && updateReflections(dateKey, { tomorrow: e.target.value })
              }
              disabled={!isAccessible}
              placeholder={reflectionPlaceholders.tomorrow}
              className="w-full px-2 py-1.5 bg-slate-900/50 text-white text-xs rounded-lg border border-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-lavender placeholder-gray-600"
            />
          </div>
        </div>

        {/* Score */}
        <div>
          <label className="text-[10px] text-gray-400 block mb-1">
            Alignment Score (0-10)
            <span className="ml-1 text-gray-500">Not output</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="10"
              value={dayData.score}
              onChange={(e) => isAccessible && updateScore(dateKey, parseInt(e.target.value))}
              disabled={!isAccessible}
              className="flex-1 accent-accent-amber"
            />
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white ${getScoreColor(
                dayData.score
              )}`}
            >
              {dayData.score}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

