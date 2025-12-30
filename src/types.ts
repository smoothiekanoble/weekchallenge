export type Task = {
  id: string;
  text: string;
  completed?: boolean;
  position?: { x: number; y: number };
};

export type HabitState = {
  slept: boolean;
  ate: boolean;
  trained: boolean;
  water: boolean;
  timeRespect: boolean;
  noScroll: boolean;
};

export type DayData = {
  date: string;
  status: '😵' | '😐' | '😌';
  tasks: Task[];
  habits: HabitState;
  reflections: {
    yes: string;
    no: string;
    feelings: string;
    tomorrow: string;
  };
  score: number;
};

export type WeatherState = 'stormy' | 'cloudy' | 'clear' | 'sunny';

export type AuthSession = {
  token: string;
  expiresAt: number;
};

export type WeekData = {
  id: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  taskPool: Task[];
  weekData: Record<string, DayData>; // Map of dateKey -> DayData
};

export type WeekMetadata = {
  id: string;
  startDate: string;
  endDate: string;
  label: string; // Formatted display string
};

