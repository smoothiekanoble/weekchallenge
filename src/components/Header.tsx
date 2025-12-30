import { useState } from 'react';
import { LogOut, Plus, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatWeekRange } from '../utils/dateUtils';
import { WeekDatePicker } from './WeekDatePicker';

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  const { currentWeekId, getAllWeeks, switchWeek } = useAppContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeekSelector, setShowWeekSelector] = useState(false);
  
  const allWeeks = getAllWeeks();
  const currentWeek = allWeeks.find(w => w.id === currentWeekId);
  
  const currentWeekRange = currentWeek 
    ? formatWeekRange(new Date(currentWeek.startDate), new Date(currentWeek.endDate))
    : '';

  const handleWeekSelect = (weekId: string) => {
    switchWeek(weekId);
    setShowWeekSelector(false);
  };

  return (
    <>
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-12 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-white">Challenge Week</h1>
              <p className="text-xs text-gray-400">{currentWeekRange}</p>
            </div>
            
            {/* Week Selector */}
            <div className="relative">
              <button
                onClick={() => setShowWeekSelector(!showWeekSelector)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white rounded-lg border border-slate-600 transition-colors"
              >
                <span>Switch Week</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showWeekSelector ? 'rotate-180' : ''}`} />
              </button>
              
              {showWeekSelector && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowWeekSelector(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 shadow-xl z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                    {allWeeks.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-gray-400">No weeks available</div>
                    ) : (
                      allWeeks.map((week) => (
                        <button
                          key={week.id}
                          onClick={() => handleWeekSelect(week.id)}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-700/50 transition-colors ${
                            week.id === currentWeekId
                              ? 'bg-slate-700/50 text-white font-medium'
                              : 'text-gray-300'
                          }`}
                        >
                          {week.label}
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Create New Week Button */}
            <button
              onClick={() => setShowDatePicker(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent-lavender hover:bg-purple-400 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Week</span>
            </button>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>
      
      <WeekDatePicker isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} />
    </>
  );
};

