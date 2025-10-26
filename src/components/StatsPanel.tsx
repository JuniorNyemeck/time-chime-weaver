import { Activity } from '@/types/schedule';
import { Card } from '@/components/ui/card';
import { useMemo } from 'react';

interface StatsPanelProps {
  activities: Activity[];
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

export const StatsPanel = ({ activities }: StatsPanelProps) => {
  const stats = useMemo(() => {
    const categoryStats: Record<string, number> = {};

    activities.forEach((activity) => {
      const [startHours, startMinutes] = activity.startTime.split(':').map(Number);
      const [endHours, endMinutes] = activity.endTime.split(':').map(Number);

      let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
      if (totalMinutes < 0) totalMinutes += 24 * 60;

      if (!categoryStats[activity.category]) {
        categoryStats[activity.category] = 0;
      }
      categoryStats[activity.category] += totalMinutes;
    });

    const totalMinutes = Object.values(categoryStats).reduce((sum, val) => sum + val, 0);

    return Object.entries(categoryStats)
      .map(([category, minutes]) => ({
        category,
        minutes,
        hours: (minutes / 60).toFixed(1),
        percentage: ((minutes / totalMinutes) * 100).toFixed(1),
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [activities]);

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-xl font-bold">📊 Statistiques journalières</h3>
      
      <div className="space-y-4">
        {stats.map(({ category, hours, percentage }) => (
          <div key={category}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                {categoryLabels[category]}
              </span>
              <span className="text-muted-foreground">
                {hours}h ({percentage}%)
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: categoryColors[category],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-secondary/50 p-4">
        <p className="text-center text-sm text-muted-foreground">
          Total : <span className="font-bold text-foreground">24 heures</span> planifiées
        </p>
      </div>
    </Card>
  );
};
