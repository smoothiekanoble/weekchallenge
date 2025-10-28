import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { WEEK_DATES, formatDateShort, getDateKey } from '../utils/dateUtils';

export const WeeklySummary = () => {
  const { weekData } = useAppContext();
  const [weekReflection, setWeekReflection] = useState({
    hardest: '',
    helped: '',
    runAgain: '',
  });

  // Calculate average score
  const scores = Array.from(weekData.values()).map((day) => day.score);
  const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-4"
    >
      <h2 className="text-lg font-bold text-white mb-3">Weekly Summary</h2>

      {/* Score Visualization */}
      <div className="mb-4">
        <div className="flex items-end justify-between gap-1.5 h-24 mb-2">
          {WEEK_DATES.map((date) => {
            const dateKey = getDateKey(date);
            const dayData = weekData.get(dateKey);
            const score = dayData?.score || 0;
            const height = (score / 10) * 100;

            return (
              <div key={dateKey} className="flex-1 flex flex-col items-center justify-end h-full">
                <motion.div
                  key={`bar-${dateKey}-${score}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-accent-amber to-accent-lavender rounded-t-lg min-h-[4px]"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] text-gray-400">
          {WEEK_DATES.map((date) => (
            <div key={date.toISOString()} className="flex-1 text-center">
              {formatDateShort(date)}
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400">Average Score</p>
          <p className="text-2xl font-bold text-accent-amber">{averageScore}</p>
        </div>
      </div>

      {/* Weekly Reflections */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Hardest part this week:</label>
          <textarea
            value={weekReflection.hardest}
            onChange={(e) => setWeekReflection({ ...weekReflection, hardest: e.target.value })}
            placeholder="say it ugly, not pretty"
            className="w-full px-2 py-2 bg-slate-900/50 text-white text-xs rounded-lg border border-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-lavender placeholder-gray-600 resize-none"
            rows={2}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">What actually helped:</label>
          <textarea
            value={weekReflection.helped}
            onChange={(e) => setWeekReflection({ ...weekReflection, helped: e.target.value })}
            placeholder="even small things count"
            className="w-full px-2 py-2 bg-slate-900/50 text-white text-xs rounded-lg border border-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-lavender placeholder-gray-600 resize-none"
            rows={2}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Would I run this again?</label>
          <div className="flex gap-2">
            {['Yes', 'No', 'Adjust'].map((option) => (
              <label key={option} className="flex items-center gap-1.5 text-white text-xs cursor-pointer">
                <input
                  type="radio"
                  name="runAgain"
                  value={option}
                  checked={weekReflection.runAgain === option}
                  onChange={(e) =>
                    setWeekReflection({ ...weekReflection, runAgain: e.target.value })
                  }
                  className="w-3.5 h-3.5 accent-accent-mint"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Encouragement Footer */}
      <div className="mt-4 pt-3 border-t border-slate-700">
        <p className="text-gray-300 italic text-center text-xs">
          Seven receipts. Hummmmmmmmm babe...
        </p>
      </div>
    </motion.div>
  );
};

