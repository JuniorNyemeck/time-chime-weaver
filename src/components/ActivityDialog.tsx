import { useState, useEffect } from 'react';
import { Activity, ActivityCategory } from '@/types/schedule';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: Activity;
  onSave: (activity: Activity) => void;
}

const categoryEmojis: Record<ActivityCategory, string> = {
  work: '💻',
  language: '🇫🇷',
  chores: '🧹',
  meditation: '🧘',
  'free-time': '🎮',
  sleep: '😴',
  mystery: '🌀',
  meal: '🍽️',
};

export const ActivityDialog = ({ open, onOpenChange, activity, onSave }: ActivityDialogProps) => {
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: '',
    startTime: '',
    endTime: '',
    category: 'work',
    description: '',
    emoji: '💻',
    alarmEnabled: true,
  });

  useEffect(() => {
    if (activity) {
      setFormData(activity);
    } else {
      setFormData({
        title: '',
        startTime: '',
        endTime: '',
        category: 'work',
        description: '',
        emoji: '💻',
        alarmEnabled: true,
      });
    }
  }, [activity, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity: Activity = {
      id: activity?.id || Date.now().toString(),
      title: formData.title || '',
      startTime: formData.startTime || '',
      endTime: formData.endTime || '',
      category: formData.category as ActivityCategory,
      description: formData.description,
      emoji: formData.emoji || categoryEmojis[formData.category as ActivityCategory],
      alarmEnabled: formData.alarmEnabled ?? true,
    };
    onSave(newActivity);
    onOpenChange(false);
  };

  const handleCategoryChange = (category: ActivityCategory) => {
    setFormData({
      ...formData,
      category,
      emoji: categoryEmojis[category],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {activity ? 'Modifier l\'activité' : 'Nouvelle activité'}
          </DialogTitle>
          <DialogDescription>
            {activity ? 'Modifiez les détails de cette activité' : 'Ajoutez une nouvelle activité à votre emploi du temps'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">💻 Travail</SelectItem>
                  <SelectItem value="language">🇫🇷 Langues</SelectItem>
                  <SelectItem value="chores">🧹 Ménage</SelectItem>
                  <SelectItem value="meditation">🧘 Méditation</SelectItem>
                  <SelectItem value="free-time">🎮 Temps libre</SelectItem>
                  <SelectItem value="sleep">😴 Sommeil</SelectItem>
                  <SelectItem value="mystery">🌀 Mystère</SelectItem>
                  <SelectItem value="meal">🍽️ Repas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                maxLength={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {activity ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
