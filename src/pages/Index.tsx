import { useState } from 'react';
import { defaultSchedule } from '@/data/schedule';
import { Activity } from '@/types/schedule';
import { CurrentActivityBanner } from '@/components/CurrentActivityBanner';
import { ActivityCard } from '@/components/ActivityCard';
import { StatsPanel } from '@/components/StatsPanel';
import { AlarmSettings } from '@/components/AlarmSettings';
import { useCurrentActivity } from '@/hooks/useCurrentActivity';
import { useAlarms } from '@/hooks/useAlarms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Settings } from 'lucide-react';

const Index = () => {
  const [activities, setActivities] = useState<Activity[]>(defaultSchedule);
  const [alarmsEnabled, setAlarmsEnabled] = useState(true);
  
  const { currentActivity, nextActivity, progress } = useCurrentActivity(activities);
  const { audioRef } = useAlarms(activities, alarmsEnabled);

  const handleToggleAlarm = (id: string, enabled: boolean) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, alarmEnabled: enabled } : activity
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Audio element for alarm sounds */}
      <audio ref={audioRef} src="/sounds/bell.mp3" preload="auto" />

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mon Emploi du Temps
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gérez votre journée avec précision et efficacité
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="rounded-full bg-green-500/20 px-3 py-1.5 text-green-600 dark:text-green-400">
                ● Actif
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current Activity Banner */}
        <div className="mb-8">
          <CurrentActivityBanner
            activity={currentActivity}
            nextActivity={nextActivity}
            progress={progress}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              Emploi du temps
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isActive={currentActivity?.id === activity.id}
                  onToggleAlarm={handleToggleAlarm}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="mx-auto max-w-2xl">
              <StatsPanel activities={activities} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="mx-auto max-w-2xl">
              <AlarmSettings
                alarmsEnabled={alarmsEnabled}
                onToggleAlarms={setAlarmsEnabled}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
