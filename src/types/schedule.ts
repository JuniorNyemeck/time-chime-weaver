export type ActivityCategory = 
  | 'work' 
  | 'language' 
  | 'chores' 
  | 'meditation' 
  | 'free-time' 
  | 'sleep' 
  | 'mystery'
  | 'meal';

export interface Activity {
  id: string;
  startTime: string; // Format: "HH:mm"
  endTime: string;
  title: string;
  emoji: string;
  category: ActivityCategory;
  description?: string;
  alarmEnabled: boolean;
  alarmSound?: string;
}

export interface DailySchedule {
  activities: Activity[];
}
