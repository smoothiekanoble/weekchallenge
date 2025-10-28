import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, DayData, WeatherState, HabitState } from '../types';
import { WEEK_DATES, getDateKey } from '../utils/dateUtils';

interface AppContextType {
  taskPool: Task[];
  weekData: Map<string, DayData>;
  weather: WeatherState;
  addTask: (text: string) => void;
  assignTaskToDay: (taskId: string, dateKey: string) => boolean;
  toggleTaskComplete: (dateKey: string, taskId: string) => void;
  removeTaskFromDay: (dateKey: string, taskId: string) => void;
  removeTaskFromPool: (taskId: string) => void;
  updateTaskPosition: (taskId: string, position: { x: number; y: number }) => void;
  updateDayStatus: (dateKey: string, status: '😵' | '😐' | '😌') => void;
  updateHabits: (dateKey: string, habits: Partial<HabitState>) => void;
  updateReflections: (dateKey: string, reflections: Partial<DayData['reflections']>) => void;
  updateScore: (dateKey: string, score: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'paw_data';

const createEmptyDayData = (date: Date): DayData => ({
  date: getDateKey(date),
  status: '😐',
  tasks: [],
  habits: {
    slept: false,
    ate: false,
    trained: false,
    water: false,
    timeRespect: false,
    noScroll: false,
  },
  reflections: {
    yes: '',
    no: '',
    feelings: '',
    tomorrow: '',
  },
  score: 0,
});

const calculateWeather = (taskCount: number): WeatherState => {
  if (taskCount > 16) return 'stormy';
  if (taskCount > 8) return 'cloudy';
  if (taskCount > 0) return 'clear';
  return 'sunny';
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [taskPool, setTaskPool] = useState<Task[]>([]);
  const [weekData, setWeekData] = useState<Map<string, DayData>>(new Map());
  const [weather, setWeather] = useState<WeatherState>('stormy');

  // Initialize data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTaskPool(parsed.taskPool || []);
        
        const dataMap = new Map<string, DayData>();
        WEEK_DATES.forEach(date => {
          const key = getDateKey(date);
          dataMap.set(key, parsed.weekData?.[key] || createEmptyDayData(date));
        });
        setWeekData(dataMap);
      } catch (error) {
        initializeWeekData();
      }
    } else {
      initializeWeekData();
    }
  }, []);

  const initializeWeekData = () => {
    const dataMap = new Map<string, DayData>();
    WEEK_DATES.forEach(date => {
      dataMap.set(getDateKey(date), createEmptyDayData(date));
    });
    setWeekData(dataMap);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    const weekDataObj: Record<string, DayData> = {};
    weekData.forEach((value: DayData, key: string) => {
      weekDataObj[key] = value;
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        taskPool,
        weekData: weekDataObj,
      })
    );

    setWeather(calculateWeather(taskPool.length));
  }, [taskPool, weekData]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random()}`,
      text,
      completed: false,
    };
    setTaskPool((prev: Task[]) => [...prev, newTask]);
  };

  const assignTaskToDay = (taskId: string, dateKey: string): boolean => {
    const dayData = weekData.get(dateKey);
    if (!dayData) return false;

    const task = taskPool.find((t: Task) => t.id === taskId);
    if (!task) return false;

    // Remove from pool
    setTaskPool((prev: Task[]) => prev.filter((t: Task) => t.id !== taskId));

    // Add to day
    setWeekData((prev: Map<string, DayData>) => {
      const newMap = new Map(prev);
      const updated = { ...dayData, tasks: [...dayData.tasks, task] };
      newMap.set(dateKey, updated);
      return newMap;
    });

    return true;
  };

  const toggleTaskComplete = (dateKey: string, taskId: string) => {
    setWeekData((prev: Map<string, DayData>) => {
      const newMap = new Map(prev);
      const dayData = newMap.get(dateKey);
      if (!dayData) return prev;

      const updatedTasks = dayData.tasks.map((task: Task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      newMap.set(dateKey, { ...dayData, tasks: updatedTasks });
      return newMap;
    });
  };

  const removeTaskFromDay = (dateKey: string, taskId: string) => {
    setWeekData((prev: Map<string, DayData>) => {
      const newMap = new Map(prev);
      const dayData = newMap.get(dateKey);
      if (!dayData) return prev;

      const updatedTasks = dayData.tasks.filter((task: Task) => task.id !== taskId);
      newMap.set(dateKey, { ...dayData, tasks: updatedTasks });
      return newMap;
    });
  };

  const removeTaskFromPool = (taskId: string) => {
    setTaskPool((prev: Task[]) => prev.filter((t: Task) => t.id !== taskId));
  };

  const updateTaskPosition = (taskId: string, position: { x: number; y: number }) => {
    setTaskPool((prev: Task[]) => 
      prev.map((t: Task) => 
        t.id === taskId ? { ...t, position } : t
      )
    );
  };

  const updateDayStatus = (dateKey: string, status: '😵' | '😐' | '😌') => {
    setWeekData((prev: Map<string, DayData>) => {
      const newMap = new Map(prev);
      const dayData = newMap.get(dateKey);
      if (!dayData) return prev;
      newMap.set(dateKey, { ...dayData, status });
      return newMap;
    });
  };

  const updateHabits = (dateKey: string, habits: Partial<HabitState>) => {
    setWeekData((prev: Map<string, DayData>) => {
      const newMap = new Map(prev);
      const dayData = newMap.get(dateKey);
      if (!dayData) return prev;
      newMap.set(dateKey, {
        ...dayData,
        habits: { ...dayData.habits, ...habits } as HabitState,
      });
      return newMap;
    });
  };

  const updateReflections = (dateKey: string, reflections: Partial<DayData['reflections']>) => {
    setWeekData((prev: Map<string, DayData>) => {
      const newMap = new Map(prev);
      const dayData = newMap.get(dateKey);
      if (!dayData) return prev;
      newMap.set(dateKey, {
        ...dayData,
        reflections: { ...dayData.reflections, ...reflections } as DayData['reflections'],
      });
      return newMap;
    });
  };

  const updateScore = (dateKey: string, score: number) => {
    setWeekData((prev: Map<string, DayData>) => {
      const newMap = new Map(prev);
      const dayData = newMap.get(dateKey);
      if (!dayData) return prev;
      newMap.set(dateKey, { ...dayData, score });
      return newMap;
    });
  };

  return (
    <AppContext.Provider
      value={{
        taskPool,
        weekData,
        weather,
        addTask,
        assignTaskToDay,
        toggleTaskComplete,
        removeTaskFromDay,
        removeTaskFromPool,
        updateTaskPosition,
        updateDayStatus,
        updateHabits,
        updateReflections,
        updateScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

