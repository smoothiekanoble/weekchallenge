// Get the current week (Monday - Sunday)
const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate days until Monday (start of week)
  const daysUntilMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysUntilMonday);
  monday.setHours(0, 0, 0, 0);
  
  // Generate the 7 days of the week starting from Monday
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};

export const WEEK_DATES = getCurrentWeekDates();
export const WEEK_START = WEEK_DATES[0]; // Monday
export const WEEK_END = WEEK_DATES[6]; // Sunday

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

