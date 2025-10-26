import { Activity } from '@/types/schedule';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Clock, Bell, BellOff } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  isActive?: boolean;
  onToggleAlarm?: (id: string, enabled: boolean) => void;
}

const categoryColors: Record<string, string> = {
  work: 'hsl(var(--work))',
  language: 'hsl(var(--language))',
  chores: 'hsl(var(--chores))',
  meditation: 'hsl(var(--meditation))',
  'free-time': 'hsl(var(--free-time))',
  sleep: 'hsl(var(--sleep))',
  mystery: 'hsl(var(--mystery))',
  meal: 'hsl(var(--free-time))',
};

const categoryLabels: Record<string, string> = {
  work: 'Travail',
  language: 'Langues',
  chores: 'Ménage',
  meditation: 'Méditation',
  'free-time': 'Temps libre',
  sleep: 'Sommeil',
  mystery: 'Mystère',
  meal: 'Repas',
};

export const ActivityCard = ({ activity, isActive, onToggleAlarm }: ActivityCardProps) => {
  const calculateDuration = () => {
    const [startHours, startMinutes] = activity.startTime.split(':').map(Number);
    const [endHours, endMinutes] = activity.endTime.split(':').map(Number);
    
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0 && minutes > 0) return `${hours}h${minutes}`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}min`;
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isActive 
          ? 'scale-105 shadow-xl ring-2 ring-primary' 
          : 'hover:shadow-lg'
      }`}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundColor: categoryColors[activity.category] }}
      />
      
      <div className="p-5 pl-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activity.emoji}</span>
            <div>
              <h3 className="font-semibold text-foreground">{activity.title}</h3>
              {activity.description && (
                <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
              )}
            </div>
          </div>
          
          <Badge 
            variant="secondary" 
            style={{ 
              backgroundColor: `${categoryColors[activity.category]}15`,
              color: categoryColors[activity.category] 
            }}
          >
            {categoryLabels[activity.category]}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{activity.startTime} - {activity.endTime}</span>
            </div>
            <span className="font-medium text-foreground">{calculateDuration()}</span>
          </div>

          {onToggleAlarm && (
            <div className="flex items-center gap-2">
              {activity.alarmEnabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                checked={activity.alarmEnabled}
                onCheckedChange={(checked) => onToggleAlarm(activity.id, checked)}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
