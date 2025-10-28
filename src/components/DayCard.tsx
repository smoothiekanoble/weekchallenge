import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { Lock, CheckCircle2, Circle } from 'lucide-react';
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
      className={`relative bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 transition-all min-w-[320px] max-w-[380px] ${
        isCurrent
          ? 'border-accent-amber shadow-lg shadow-accent-amber/20 animate-glow'
          : 'border-slate-700'
      } ${isOver && isAccessible ? 'ring-2 ring-accent-mint' : ''}`}
    >
      {/* Future Day Overlay */}
      {isFuture && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md rounded-xl z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Locked until {formatDate(date)}</p>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{formatDate(date)}</h3>
            {isCurrent && <span className="text-xs text-accent-amber">Today</span>}
          </div>

          {/* Status Emoji Selector */}
          <div className="flex gap-2">
            {statusEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => isAccessible && updateDayStatus(dateKey, emoji)}
                disabled={!isAccessible}
                className={`text-2xl transition-all ${
                  dayData.status === emoji ? 'scale-125' : 'scale-100 opacity-50 hover:opacity-100'
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
          className={`mb-4 p-3 rounded-lg border-2 border-dashed min-h-[100px] transition-colors ${
            isOver && isAccessible
              ? 'border-accent-mint bg-accent-mint/10'
              : 'border-slate-600 bg-slate-900/30'
          }`}
        >
          <p className="text-xs text-gray-400 mb-2">Tasks ({dayData.tasks.length}/3)</p>
          <div className="space-y-2">
            {dayData.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 text-sm text-white group"
              >
                <button
                  onClick={() => isAccessible && toggleTaskComplete(dateKey, task.id)}
                  disabled={!isAccessible}
                  className="flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-accent-mint" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                  )}
                </button>
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
          {dayData.tasks.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              Drag tasks here
            </p>
          )}
        </div>

        {/* Habits */}
        <div className={`mb-4 p-3 rounded-lg ${allHabitsComplete ? 'bg-amber-400/10 border border-amber-400/30' : 'bg-slate-900/30'}`}>
          <p className="text-xs text-gray-400 mb-2">Habits</p>
          <div className="space-y-2">
            {(Object.keys(habitLabels) as Array<keyof typeof habitLabels>).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm text-white cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dayData.habits[key]}
                  onChange={(e) =>
                    isAccessible && updateHabits(dateKey, { [key]: e.target.checked })
                  }
                  disabled={!isAccessible}
                  className="w-4 h-4 rounded accent-accent-mint"
                />
                <span className="group-hover:text-accent-mint transition-colors">
                  {habitLabels[key]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reflections */}
        <div className="mb-4 space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Where I said YES to myself:
            </label>
            <textarea
              value={dayData.reflections.yes}
              onChange={(e) =>
                isAccessible && updateReflections(dateKey, { yes: e.target.value })
              }
              disabled={!isAccessible}
              placeholder={reflectionPlaceholders.yes}
              className="w-full px-3 py-2 bg-slate-900/50 text-white text-sm rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-lavender placeholder-gray-600 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Where I said NO / held a boundary:
            </label>
            <textarea
              value={dayData.reflections.no}
              onChange={(e) =>
                isAccessible && updateReflections(dateKey, { no: e.target.value })
              }
              disabled={!isAccessible}
              placeholder={reflectionPlaceholders.no}
              className="w-full px-3 py-2 bg-slate-900/50 text-white text-sm rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-lavender placeholder-gray-600 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">
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
              className="w-full px-3 py-2 bg-slate-900/50 text-white text-sm rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-lavender placeholder-gray-600"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">
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
              className="w-full px-3 py-2 bg-slate-900/50 text-white text-sm rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-lavender placeholder-gray-600"
            />
          </div>
        </div>

        {/* Score */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">
            Alignment Score (0-10)
            <span className="ml-2 text-gray-500">Not output, just alignment</span>
          </label>
          <div className="flex items-center gap-3">
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
              className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${getScoreColor(
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

