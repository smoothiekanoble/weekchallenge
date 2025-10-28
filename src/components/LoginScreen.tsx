import { useState } from 'react';
import { Lock } from 'lucide-react';
import { WEEK_START, WEEK_END } from '../utils/dateUtils';

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
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

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
            <Lock className="w-8 h-8 text-accent-lavender" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Lock in Week</h1>
          <p className="text-gray-400">Personal space — enter to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-slate-900/50 border ${
                error ? 'border-red-500' : 'border-slate-600'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-lavender transition-all`}
              placeholder="Enter password"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">Incorrect password. Try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-accent-lavender hover:bg-purple-400 text-slate-900 font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
          >
            Enter
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {formatWeekRange()}
        </p>
      </div>
    </div>
  );
};

