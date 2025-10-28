import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { TaskWeather } from './components/TaskWeather';
import { DayCardsContainer } from './components/DayCardsContainer';
import { WeeklySummary } from './components/WeeklySummary';
import { AppProvider } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useAppContext } from './context/AppContext';

function MainContent() {
  const { assignTaskToDay, updateTaskPosition, taskPool } = useAppContext();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended:', event.active.id, 'over:', event.over?.id);
    const { active, over, delta } = event;

    if (over) {
      // Dropped on a day card
      const taskId = active.id as string;
      const dateKey = over.id as string;
      const success = assignTaskToDay(taskId, dateKey);
      console.log('Task assignment:', success ? 'success' : 'failed');
    } else if (delta) {
      // Dropped in empty space - check if within cloud container bounds
      const taskId = active.id as string;
      const task = taskPool.find(t => t.id === taskId);
      
      if (task) {
        // Get the cloud container
        const container = document.querySelector('.relative.min-h-\\[150px\\].w-full');
        
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const element = active.rect.current.translated;
          
          if (element) {
            // Check if the element is still within the container bounds
            const isWithinBounds = 
              element.left >= containerRect.left &&
              element.right <= containerRect.right &&
              element.top >= containerRect.top &&
              element.bottom <= containerRect.bottom;
            
            if (isWithinBounds) {
              // Within bounds - save the position
              const currentOffset = task.position || { x: 0, y: 0 };
              const newPosition = {
                x: currentOffset.x + delta.x,
                y: currentOffset.y + delta.y,
              };
              
              updateTaskPosition(taskId, newPosition);
              console.log('Free positioned to:', newPosition);
            } else {
              console.log('Outside container - position not saved');
            }
          }
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="max-w-5xl mx-auto px-12 py-4 space-y-4">
        {/* Task Weather Section */}
        <section>
          <TaskWeather />
        </section>

        {/* Day Cards Section */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Your Week</h2>
          <DayCardsContainer />
        </section>

        {/* Weekly Summary Section */}
        <section>
          <WeeklySummary />
        </section>
      </main>
    </DndContext>
  );
}

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
      <MainContent />
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

