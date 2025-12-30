// Generate all dates between startDate and endDate (inclusive)
export const generateWeekDates = (startDate: Date, endDate: Date): Date[] => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const dates: Date[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

// Generate week ID from start and end dates
export const getWeekId = (startDate: Date, endDate: Date): string => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  return `week-${startStr}-${endStr}`;
};

// Format week range for display
export const formatWeekRange = (startDate: Date, endDate: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = months[startDate.getMonth()];
  const endMonth = months[endDate.getMonth()];
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = endDate.getFullYear();
  
  if (startMonth === endMonth && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startMonth} ${startDay}–${endDay}, ${year}`;
  }
  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay}, ${startDate.getFullYear()} – ${endMonth} ${endDay}, ${year}`;
};

// Get default week dates for migration (Oct 28 - Nov 3, 2025)
export const getDefaultWeekDates = (): Date[] => {
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

