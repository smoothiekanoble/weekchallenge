// Get the current week starting from Oct 28, 2025 (Tuesday)
const getCurrentWeekDates = (): Date[] => {
  const challengeStart = new Date(2025, 9, 28); // Oct 28, 2025 (Tuesday)
  challengeStart.setHours(0, 0, 0, 0);
  
  // Generate 7 days starting from Oct 28
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(challengeStart);
    date.setDate(challengeStart.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};

export const WEEK_DATES = getCurrentWeekDates();
export const WEEK_START = WEEK_DATES[0]; // Tuesday Oct 28
export const WEEK_END = WEEK_DATES[6]; // Monday Nov 3

export const formatDate = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
};

export const formatDateShort = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isCurrentDay = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

export const isPastDay = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

export const isFutureDay = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate > today;
};

export const getDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

