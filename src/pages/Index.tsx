import { useState, useEffect } from 'react';
import { defaultSchedule } from '@/data/schedule';
import { Activity } from '@/types/schedule';
import { CurrentActivityBanner } from '@/components/CurrentActivityBanner';
import { ActivityCard } from '@/components/ActivityCard';
import { StatsPanel } from '@/components/StatsPanel';
import { AlarmSettings } from '@/components/AlarmSettings';
import { ProgressPanel } from '@/components/ProgressPanel';
import { QuotesPanel } from '@/components/QuotesPanel';
import { ActivityDialog } from '@/components/ActivityDialog';
import { useCurrentActivity } from '@/hooks/useCurrentActivity';
import { useAlarms } from '@/hooks/useAlarms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, Settings, TrendingUp, Sparkles, Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : defaultSchedule;
  });
  const [alarmsEnabled, setAlarmsEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  
  const { currentActivity, nextActivity, progress } = useCurrentActivity(activities);
  const { audioRef } = useAlarms(activities, alarmsEnabled);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const handleToggleAlarm = (id: string, enabled: boolean) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, alarmEnabled: enabled } : activity
      )
    );
  };

  const handleSaveActivity = (activity: Activity) => {
    setActivities((prev) => {
      const existing = prev.find((a) => a.id === activity.id);
      if (existing) {
        toast({ title: 'Activité modifiée', description: 'Les modifications ont été enregistrées.' });
        return prev.map((a) => (a.id === activity.id ? activity : a));
      } else {
        toast({ title: 'Activité ajoutée', description: 'La nouvelle activité a été ajoutée.' });
        return [...prev, activity].sort((a, b) => a.startTime.localeCompare(b.startTime));
      }
    });
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setDialogOpen(true);
  };

  const handleAddActivity = () => {
    setEditingActivity(undefined);
    setDialogOpen(true);
  };

  const handleDeleteActivity = (id: string) => {
    setActivityToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (activityToDelete) {
      setActivities((prev) => prev.filter((a) => a.id !== activityToDelete));
      toast({ title: 'Activité supprimée', description: 'L\'activité a été supprimée.' });
      setActivityToDelete(null);
    }
    setDeleteDialogOpen(false);
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
                Emploi du Temps THE JDN
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Bas-toi à gérer cette journée avec précision et efficacité boss !
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="rounded-full bg-green-500/20 px-3 py-1.5 text-green-600 dark:text-green-400">
                ● Actif jusqu'àààà
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
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5">
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              Emploi du temps
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Progression
            </TabsTrigger>
            <TabsTrigger value="quotes" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Citations
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
            <div className="flex justify-end">
              <Button onClick={handleAddActivity} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une activité
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <div key={activity.id} className="relative group">
                  <ActivityCard
                    activity={activity}
                    isActive={currentActivity?.id === activity.id}
                    onToggleAlarm={handleToggleAlarm}
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => handleEditActivity(activity)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="mx-auto max-w-3xl">
              <ProgressPanel activities={activities} currentActivity={currentActivity} />
            </div>
          </TabsContent>

          <TabsContent value="quotes">
            <div className="mx-auto max-w-3xl">
              <QuotesPanel />
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

      {/* Dialogs */}
      <ActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activity={editingActivity}
        onSave={handleSaveActivity}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'activité sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
