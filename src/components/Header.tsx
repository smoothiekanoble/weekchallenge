import { LogOut } from 'lucide-react';
import { WEEK_START, WEEK_END } from '../utils/dateUtils';

interface HeaderProps {
  onLogout: () => void;
}

const formatWeekRange = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = months[WEEK_START.getMonth()];
  const endMonth = months[WEEK_END.getMonth()];
  const startDay = WEEK_START.getDate();
  const endDay = WEEK_END.getDate();
  const year = WEEK_END.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
};

export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-12 py-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Challenge Week</h1>
          <p className="text-xs text-gray-400">{formatWeekRange()}</p>
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
  );
};

