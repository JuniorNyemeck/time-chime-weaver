import { useEffect, useRef } from 'react';
import { Activity } from '@/types/schedule';
import { toast } from '@/hooks/use-toast';

export const useAlarms = (activities: Activity[], alarmsEnabled: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAlarmRef = useRef<string>('');

  useEffect(() => {
    if (!alarmsEnabled) return;

    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      activities.forEach((activity) => {
        if (!activity.alarmEnabled) return;

        const alarmKey = `${activity.id}-${currentTime}`;
        
        if (
          (activity.startTime === currentTime || activity.endTime === currentTime) &&
          lastAlarmRef.current !== alarmKey
        ) {
          lastAlarmRef.current = alarmKey;
          
          // Play sound
          if (audioRef.current) {
            audioRef.current.play().catch((e) => console.log('Audio play failed:', e));
          }

          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(activity.title, {
              body: activity.startTime === currentTime 
                ? `Début : ${activity.title} ${activity.emoji}` 
                : `Fin : ${activity.title} ${activity.emoji}`,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
            });
          }

          // Show toast
          toast({
            title: activity.startTime === currentTime ? '⏰ Début de l\'activité' : '✅ Fin de l\'activité',
            description: `${activity.emoji} ${activity.title}`,
          });
        }
      });
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check every second
    const interval = setInterval(checkAlarms, 1000);

    return () => clearInterval(interval);
  }, [activities, alarmsEnabled]);

  return { audioRef };
};
