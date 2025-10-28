// Week of Oct 28 - Nov 3, 2024
export const WEEK_START = new Date(2024, 9, 28); // Month is 0-indexed (9 = October)
export const WEEK_END = new Date(2024, 10, 3);

export const WEEK_DATES = [
  new Date(2024, 9, 28), // Mon Oct 28
  new Date(2024, 9, 29), // Tue Oct 29
  new Date(2024, 9, 30), // Wed Oct 30
  new Date(2024, 9, 31), // Thu Oct 31
  new Date(2024, 10, 1), // Fri Nov 1
  new Date(2024, 10, 2), // Sat Nov 2
  new Date(2024, 10, 3), // Sun Nov 3
];

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

