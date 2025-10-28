import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Personal Alignment Week</h1>
          <p className="text-sm text-gray-400">Oct 28 – Nov 3, 2024</p>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

