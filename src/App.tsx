import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { TaskWeather } from './components/TaskWeather';
import { DayCardsContainer } from './components/DayCardsContainer';
import { WeeklySummary } from './components/WeeklySummary';
import { AppProvider } from './context/AppContext';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header onLogout={logout} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Task Weather Section */}
        <section>
          <TaskWeather />
        </section>

        {/* Day Cards Section */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Your Week</h2>
          <DayCardsContainer />
        </section>

        {/* Weekly Summary Section */}
        <section>
          <WeeklySummary />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

