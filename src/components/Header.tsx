import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-12 py-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Challenge Week</h1>
          <p className="text-xs text-gray-400">Oct 28 – Nov 3, 2024</p>
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

