import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Task, DayData, WeatherState, HabitState, WeekData, WeekMetadata } from '../types';
import { generateWeekDates, getDateKey, getWeekId, getDefaultWeekDates, formatWeekRange } from '../utils/dateUtils';

interface AppContextType {
  // Current week data (computed from weeks map)
  taskPool: Task[];
  weekData: Map<string, DayData>;
  weather: WeatherState;
  currentWeekId: string | null;
  currentWeekDates: Date[];
  
  // Week management
  createWeek: (startDate: Date, endDate: Date) => void;
  switchWeek: (weekId: string) => void;
  deleteWeek: (weekId: string) => void;
  getAllWeeks: () => WeekMetadata[];
  getCurrentWeekDates: () => Date[];
  
  // Task operations (operate on current week)
  addTask: (text: string) => void;
  assignTaskToDay: (taskId: string, dateKey: string) => boolean;
  toggleTaskComplete: (dateKey: string, taskId: string) => void;
  removeTaskFromDay: (dateKey: string, taskId: string) => void;
  removeTaskFromPool: (taskId: string) => void;
  updateTaskPosition: (taskId: string, position: { x: number; y: number }) => void;
  
  // Day operations (operate on current week)
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

// Migrate old localStorage format to new format
const migrateOldData = (oldData: any): { weeks: Record<string, WeekData>, currentWeekId: string } => {
  const defaultDates = getDefaultWeekDates();
  const startDate = defaultDates[0];
  const endDate = defaultDates[defaultDates.length - 1];
  const weekId = getWeekId(startDate, endDate);
  
  const weekDataObj: Record<string, DayData> = {};
  defaultDates.forEach(date => {
    const key = getDateKey(date);
    weekDataObj[key] = oldData.weekData?.[key] || createEmptyDayData(date);
  });
  
  const weekData: WeekData = {
    id: weekId,
    startDate: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
    endDate: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`,
    taskPool: oldData.taskPool || [],
    weekData: weekDataObj,
  };
  
  return {
    weeks: { [weekId]: weekData },
    currentWeekId: weekId,
  };
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [weeks, setWeeks] = useState<Record<string, WeekData>>({});
  const [currentWeekId, setCurrentWeekId] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherState>('stormy');

  // Initialize data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Check if it's the new format
        if (parsed.weeks && parsed.currentWeekId) {
          setWeeks(parsed.weeks);
          setCurrentWeekId(parsed.currentWeekId);
        } else {
          // Migrate old format
          const migrated = migrateOldData(parsed);
          setWeeks(migrated.weeks);
          setCurrentWeekId(migrated.currentWeekId);
        }
      } catch (error) {
        // Initialize with default week
        const defaultDates = getDefaultWeekDates();
        const startDate = defaultDates[0];
        const endDate = defaultDates[defaultDates.length - 1];
        const weekId = getWeekId(startDate, endDate);
        
        const weekDataObj: Record<string, DayData> = {};
        defaultDates.forEach(date => {
          weekDataObj[getDateKey(date)] = createEmptyDayData(date);
        });
        
        const defaultWeek: WeekData = {
          id: weekId,
          startDate: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
          endDate: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`,
          taskPool: [],
          weekData: weekDataObj,
        };
        
        setWeeks({ [weekId]: defaultWeek });
        setCurrentWeekId(weekId);
      }
    } else {
      // No data - create default week
      const defaultDates = getDefaultWeekDates();
      const startDate = defaultDates[0];
      const endDate = defaultDates[defaultDates.length - 1];
      const weekId = getWeekId(startDate, endDate);
      
      const weekDataObj: Record<string, DayData> = {};
      defaultDates.forEach(date => {
        weekDataObj[getDateKey(date)] = createEmptyDayData(date);
      });
      
      const defaultWeek: WeekData = {
        id: weekId,
        startDate: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
        endDate: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`,
        taskPool: [],
        weekData: weekDataObj,
      };
      
      setWeeks({ [weekId]: defaultWeek });
      setCurrentWeekId(weekId);
    }
  }, []);

  // Get current week data
  const currentWeek = useMemo(() => {
    if (!currentWeekId || !weeks[currentWeekId]) return null;
    return weeks[currentWeekId];
  }, [currentWeekId, weeks]);

  // Compute current week dates
  const currentWeekDates = useMemo(() => {
    if (!currentWeek) return [];
    const startDate = new Date(currentWeek.startDate);
    const endDate = new Date(currentWeek.endDate);
    return generateWeekDates(startDate, endDate);
  }, [currentWeek]);

  // Compute taskPool and weekData from current week
  const taskPool = useMemo(() => currentWeek?.taskPool || [], [currentWeek]);
  const weekData = useMemo(() => {
    const map = new Map<string, DayData>();
    if (currentWeek) {
      Object.entries(currentWeek.weekData).forEach(([key, value]) => {
        map.set(key, value);
      });
    }
    return map;
  }, [currentWeek]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (Object.keys(weeks).length === 0 || !currentWeekId) return;
    
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        weeks,
        currentWeekId,
      })
    );

    if (currentWeek) {
      setWeather(calculateWeather(currentWeek.taskPool.length));
    }
  }, [weeks, currentWeekId, currentWeek]);

  // Week management functions
  const createWeek = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    if (end < start) {
      throw new Error('End date must be after start date');
    }
    
    const weekId = getWeekId(start, end);
    
    // Check if week already exists
    if (weeks[weekId]) {
      // Switch to existing week instead
      setCurrentWeekId(weekId);
      return;
    }
    
    // Create new week
    const dates = generateWeekDates(start, end);
    const weekDataObj: Record<string, DayData> = {};
    dates.forEach(date => {
      weekDataObj[getDateKey(date)] = createEmptyDayData(date);
    });
    
    const newWeek: WeekData = {
      id: weekId,
      startDate: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`,
      endDate: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`,
      taskPool: [],
      weekData: weekDataObj,
    };
    
    setWeeks(prev => ({ ...prev, [weekId]: newWeek }));
    setCurrentWeekId(weekId);
  };

  const switchWeek = (weekId: string) => {
    if (weeks[weekId]) {
      setCurrentWeekId(weekId);
    }
  };

  const deleteWeek = (weekId: string) => {
    if (!weeks[weekId]) return;
    
    // Don't allow deleting if it's the only week
    if (Object.keys(weeks).length <= 1) {
      return;
    }
    
    // If deleting the current week, switch to another week first
    if (currentWeekId === weekId) {
      const otherWeeks = Object.keys(weeks).filter(id => id !== weekId);
      if (otherWeeks.length > 0) {
        setCurrentWeekId(otherWeeks[0]);
      }
    }
    
    // Remove the week
    setWeeks(prev => {
      const updated = { ...prev };
      delete updated[weekId];
      return updated;
    });
  };

  const getAllWeeks = (): WeekMetadata[] => {
    return Object.values(weeks)
      .map(week => {
        const startDate = new Date(week.startDate);
        const endDate = new Date(week.endDate);
        return {
          id: week.id,
          startDate: week.startDate,
          endDate: week.endDate,
          label: formatWeekRange(startDate, endDate),
        };
      })
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  };

  const getCurrentWeekDates = (): Date[] => {
    return currentWeekDates;
  };

  // Task operations (operate on current week)
  const addTask = (text: string) => {
    if (!currentWeekId || !currentWeek) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random()}`,
      text,
      completed: false,
    };
    
    setWeeks(prev => ({
      ...prev,
      [currentWeekId]: {
        ...prev[currentWeekId],
        taskPool: [...prev[currentWeekId].taskPool, newTask],
      },
    }));
  };

  const assignTaskToDay = (taskId: string, dateKey: string): boolean => {
    if (!currentWeekId || !currentWeek) return false;
    
    const dayData = currentWeek.weekData[dateKey];
    if (!dayData) return false;

    const task = currentWeek.taskPool.find((t: Task) => t.id === taskId);
    if (!task) return false;

    // Remove from pool and add to day
    setWeeks(prev => {
      const week = prev[currentWeekId];
      const updatedWeekData = { ...week.weekData };
      updatedWeekData[dateKey] = {
        ...dayData,
        tasks: [...dayData.tasks, task],
      };
      
      return {
        ...prev,
        [currentWeekId]: {
          ...week,
          taskPool: week.taskPool.filter((t: Task) => t.id !== taskId),
          weekData: updatedWeekData,
        },
      };
    });

    return true;
  };

  const toggleTaskComplete = (dateKey: string, taskId: string) => {
    if (!currentWeekId || !currentWeek) return;
    
    const dayData = currentWeek.weekData[dateKey];
    if (!dayData) return;

    setWeeks(prev => {
      const week = prev[currentWeekId];
      const updatedWeekData = { ...week.weekData };
      updatedWeekData[dateKey] = {
        ...dayData,
        tasks: dayData.tasks.map((task: Task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      };
      
      return {
        ...prev,
        [currentWeekId]: {
          ...week,
          weekData: updatedWeekData,
        },
      };
    });
  };

  const removeTaskFromDay = (dateKey: string, taskId: string) => {
    if (!currentWeekId || !currentWeek) return;
    
    const dayData = currentWeek.weekData[dateKey];
    if (!dayData) return;

    setWeeks(prev => {
      const week = prev[currentWeekId];
      const updatedWeekData = { ...week.weekData };
      updatedWeekData[dateKey] = {
        ...dayData,
        tasks: dayData.tasks.filter((task: Task) => task.id !== taskId),
      };
      
      return {
        ...prev,
        [currentWeekId]: {
          ...week,
          weekData: updatedWeekData,
        },
      };
    });
  };

  const removeTaskFromPool = (taskId: string) => {
    if (!currentWeekId || !currentWeek) return;
    
    setWeeks(prev => ({
      ...prev,
      [currentWeekId]: {
        ...prev[currentWeekId],
        taskPool: prev[currentWeekId].taskPool.filter((t: Task) => t.id !== taskId),
      },
    }));
  };

  const updateTaskPosition = (taskId: string, position: { x: number; y: number }) => {
    if (!currentWeekId || !currentWeek) return;
    
    setWeeks(prev => ({
      ...prev,
      [currentWeekId]: {
        ...prev[currentWeekId],
        taskPool: prev[currentWeekId].taskPool.map((t: Task) =>
          t.id === taskId ? { ...t, position } : t
        ),
      },
    }));
  };

  // Day operations (operate on current week)
  const updateDayStatus = (dateKey: string, status: '😵' | '😐' | '😌') => {
    if (!currentWeekId || !currentWeek) return;
    
    const dayData = currentWeek.weekData[dateKey];
    if (!dayData) return;

    setWeeks(prev => {
      const week = prev[currentWeekId];
      const updatedWeekData = { ...week.weekData };
      updatedWeekData[dateKey] = { ...dayData, status };
      
      return {
        ...prev,
        [currentWeekId]: {
          ...week,
          weekData: updatedWeekData,
        },
      };
    });
  };

  const updateHabits = (dateKey: string, habits: Partial<HabitState>) => {
    if (!currentWeekId || !currentWeek) return;
    
    const dayData = currentWeek.weekData[dateKey];
    if (!dayData) return;

    setWeeks(prev => {
      const week = prev[currentWeekId];
      const updatedWeekData = { ...week.weekData };
      updatedWeekData[dateKey] = {
        ...dayData,
        habits: { ...dayData.habits, ...habits } as HabitState,
      };
      
      return {
        ...prev,
        [currentWeekId]: {
          ...week,
          weekData: updatedWeekData,
        },
      };
    });
  };

  const updateReflections = (dateKey: string, reflections: Partial<DayData['reflections']>) => {
    if (!currentWeekId || !currentWeek) return;
    
    const dayData = currentWeek.weekData[dateKey];
    if (!dayData) return;

    setWeeks(prev => {
      const week = prev[currentWeekId];
      const updatedWeekData = { ...week.weekData };
      updatedWeekData[dateKey] = {
        ...dayData,
        reflections: { ...dayData.reflections, ...reflections } as DayData['reflections'],
      };
      
      return {
        ...prev,
        [currentWeekId]: {
          ...week,
          weekData: updatedWeekData,
        },
      };
    });
  };

  const updateScore = (dateKey: string, score: number) => {
    if (!currentWeekId || !currentWeek) return;
    
    const dayData = currentWeek.weekData[dateKey];
    if (!dayData) return;

    setWeeks(prev => {
      const week = prev[currentWeekId];
      const updatedWeekData = { ...week.weekData };
      updatedWeekData[dateKey] = { ...dayData, score };
      
      return {
        ...prev,
        [currentWeekId]: {
          ...week,
          weekData: updatedWeekData,
        },
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        taskPool,
        weekData,
        weather,
        currentWeekId,
        currentWeekDates,
        createWeek,
        switchWeek,
        deleteWeek,
        getAllWeeks,
        getCurrentWeekDates,
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
