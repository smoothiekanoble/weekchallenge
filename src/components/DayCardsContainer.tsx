import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { DayCard } from './DayCard';
import { WEEK_DATES, getDateKey } from '../utils/dateUtils';

export const DayCardsContainer = () => {
  const { weekData } = useAppContext();

  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex gap-3 min-w-min px-1">
        {WEEK_DATES.map((date) => {
          const dateKey = getDateKey(date);
          const dayData = weekData.get(dateKey);

          if (!dayData) return null;

          return (
            <motion.div key={dateKey}>
              <DayCard date={date} dayData={dayData} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

