export type Task = {
  id: string;
  text: string;
  completed?: boolean;
};

export type HabitState = {
  slept: boolean;
  ate: boolean;
  trained: boolean;
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

