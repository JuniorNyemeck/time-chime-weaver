import { Activity } from '@/types/schedule';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';

interface ProgressPanelProps {
  activities: Activity[];
  currentActivity: Activity | null;
}

export const ProgressPanel = ({ activities, currentActivity }: ProgressPanelProps) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Calculer le nombre de tâches complétées
  const completedActivities = activities.filter((activity) => {
    const [endHour, endMinute] = activity.endTime.split(':').map(Number);
    const endTimeInMinutes = endHour * 60 + endMinute;
    return endTimeInMinutes < currentTimeInMinutes;
  }).length;

  // Calculer le pourcentage de la journée écoulée
  const dayProgress = (currentTimeInMinutes / (24 * 60)) * 100;

  // Calculer le temps total et le temps écoulé
  const totalMinutes = 24 * 60;
  const elapsedMinutes = currentTimeInMinutes;
  const remainingMinutes = totalMinutes - elapsedMinutes;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  // Statistiques par catégorie pour la journée
  const categoryStats = activities.reduce((acc, activity) => {
    const [startHour, startMinute] = activity.startTime.split(':').map(Number);
    const [endHour, endMinute] = activity.endTime.split(':').map(Number);
    
    let duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    if (duration < 0) duration += 24 * 60;

    if (!acc[activity.category]) {
      acc[activity.category] = { total: 0, completed: 0 };
    }

    acc[activity.category].total += duration;

    const endTimeInMinutes = endHour * 60 + endMinute;
    if (endTimeInMinutes < currentTimeInMinutes) {
      acc[activity.category].completed += duration;
    }

    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble de la journée */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Progression du jour</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avancement global</span>
              <span className="text-sm font-medium text-foreground">{Math.round(dayProgress)}%</span>
            </div>
            <Progress value={dayProgress} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-2xl font-bold text-foreground">{completedActivities}</p>
              </div>
              <p className="text-xs text-muted-foreground">Tâches complétées</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-2xl font-bold text-foreground">{formatTime(elapsedMinutes)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Temps écoulé</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="h-4 w-4 text-accent" />
                <p className="text-2xl font-bold text-foreground">{formatTime(remainingMinutes)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Temps restant</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progression par catégorie */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Progression par catégorie</h3>
        <div className="space-y-4">
          {Object.entries(categoryStats).map(([category, stats]) => {
            const progress = (stats.completed / stats.total) * 100;
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {category.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(stats.completed)} / {formatTime(stats.total)}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Activité en cours */}
      {currentActivity && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-lg font-semibold mb-3 text-foreground">En cours</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentActivity.emoji}</span>
            <div>
              <p className="font-medium text-foreground">{currentActivity.title}</p>
              <p className="text-sm text-muted-foreground">
                {currentActivity.startTime} - {currentActivity.endTime}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
