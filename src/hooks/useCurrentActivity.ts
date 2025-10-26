import { useState, useEffect } from 'react';
import { Activity } from '@/types/schedule';

export const useCurrentActivity = (activities: Activity[]) => {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [nextActivity, setNextActivity] = useState<Activity | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateCurrentActivity = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      let found = false;
      for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        const startMinutes = timeToMinutes(activity.startTime);
        let endMinutes = timeToMinutes(activity.endTime);

        // Handle activities that cross midnight
        if (endMinutes < startMinutes) {
          endMinutes += 24 * 60;
        }

        let adjustedCurrentMinutes = currentMinutes;
        if (currentMinutes < startMinutes && endMinutes > 24 * 60) {
          adjustedCurrentMinutes += 24 * 60;
        }

        if (adjustedCurrentMinutes >= startMinutes && adjustedCurrentMinutes < endMinutes) {
          setCurrentActivity(activity);
          setNextActivity(activities[(i + 1) % activities.length]);
          
          const duration = endMinutes - startMinutes;
          const elapsed = adjustedCurrentMinutes - startMinutes;
          setProgress((elapsed / duration) * 100);
          
          found = true;
          break;
        }
      }

      if (!found) {
        setCurrentActivity(null);
        setNextActivity(activities[0]);
        setProgress(0);
      }
    };

    updateCurrentActivity();
    const interval = setInterval(updateCurrentActivity, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [activities]);

  return { currentActivity, nextActivity, progress };
};
