import { Activity } from '@/types/schedule';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface CurrentActivityBannerProps {
  activity: Activity | null;
  nextActivity: Activity | null;
  progress: number;
}

const categoryGradients: Record<string, string> = {
  work: 'var(--gradient-work)',
  language: 'var(--gradient-language)',
  chores: 'var(--gradient-chores)',
  meditation: 'var(--gradient-meditation)',
  'free-time': 'var(--gradient-free)',
  sleep: 'var(--gradient-sleep)',
  mystery: 'var(--gradient-mystery)',
  meal: 'var(--gradient-free)',
};

export const CurrentActivityBanner = ({ activity, nextActivity, progress }: CurrentActivityBannerProps) => {
  if (!activity) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-lg">
        <div className="text-center">
          <p className="text-muted-foreground">Aucune activité en cours</p>
          {nextActivity && (
            <p className="mt-2 text-sm text-foreground">
              Prochaine : {nextActivity.emoji} {nextActivity.title} à {nextActivity.startTime}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl"
      style={{ background: categoryGradients[activity.category] }}
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{activity.emoji}</span>
            <div>
              <h2 className="text-3xl font-bold">{activity.title}</h2>
              {activity.description && (
                <p className="mt-1 text-white/90">{activity.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">
              {activity.startTime} - {activity.endTime}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/80">{Math.round(progress)}% complété</span>
          {nextActivity && (
            <span className="text-white/80">
              Ensuite : {nextActivity.emoji} {nextActivity.title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
