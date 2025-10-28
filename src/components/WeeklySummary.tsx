import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { WEEK_DATES, formatDateShort } from '../utils/dateUtils';

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
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Weekly Summary</h2>

      {/* Score Visualization */}
      <div className="mb-8">
        <div className="flex items-end justify-between gap-2 h-32 mb-2">
          {WEEK_DATES.map((date) => {
            const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const dayData = weekData.get(dateKey);
            const score = dayData?.score || 0;
            const height = (score / 10) * 100;

            return (
              <div key={dateKey} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: WEEK_DATES.indexOf(date) * 0.1 }}
                  className="w-full bg-gradient-to-t from-accent-amber to-accent-lavender rounded-t-lg min-h-[4px]"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          {WEEK_DATES.map((date) => (
            <div key={date.toISOString()} className="flex-1 text-center">
              {formatDateShort(date)}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">Average Score</p>
          <p className="text-4xl font-bold text-accent-amber">{averageScore}</p>
        </div>
      </div>

      {/* Weekly Reflections */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 block mb-2">Hardest part this week:</label>
          <textarea
            value={weekReflection.hardest}
            onChange={(e) => setWeekReflection({ ...weekReflection, hardest: e.target.value })}
            placeholder="say it ugly, not pretty"
            className="w-full px-4 py-3 bg-slate-900/50 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-lavender placeholder-gray-600 resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 block mb-2">What actually helped:</label>
          <textarea
            value={weekReflection.helped}
            onChange={(e) => setWeekReflection({ ...weekReflection, helped: e.target.value })}
            placeholder="even small things count"
            className="w-full px-4 py-3 bg-slate-900/50 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-lavender placeholder-gray-600 resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 block mb-2">Would I run this again?</label>
          <div className="flex gap-4">
            {['Yes', 'No', 'Adjust'].map((option) => (
              <label key={option} className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  name="runAgain"
                  value={option}
                  checked={weekReflection.runAgain === option}
                  onChange={(e) =>
                    setWeekReflection({ ...weekReflection, runAgain: e.target.value })
                  }
                  className="w-4 h-4 accent-accent-mint"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Encouragement Footer */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <p className="text-gray-300 italic text-center">
          Seven receipts. You're not lazy — you were overloaded. Now you know where the leaks are.
        </p>
      </div>
    </motion.div>
  );
};

