import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface AlarmSettingsProps {
  alarmsEnabled: boolean;
  onToggleAlarms: (enabled: boolean) => void;
}

const alarmSounds = [
  { id: 'bell', name: 'Cloche classique', url: '/sounds/bell.mp3' },
  { id: 'chime', name: 'Carillon doux', url: '/sounds/chime.mp3' },
  { id: 'digital', name: 'Bip digital', url: '/sounds/digital.mp3' },
  { id: 'nature', name: 'Sons de la nature', url: '/sounds/nature.mp3' },
];

export const AlarmSettings = ({ alarmsEnabled, onToggleAlarms }: AlarmSettingsProps) => {
  const [selectedSound, setSelectedSound] = useState('bell');

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch((e) => console.log('Audio play failed:', e));
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-lg font-bold">Alarmes</h3>
            <p className="text-sm text-muted-foreground">
              Notifications pour chaque activité
            </p>
          </div>
        </div>
        <Switch
          checked={alarmsEnabled}
          onCheckedChange={onToggleAlarms}
        />
      </div>

      {alarmsEnabled && (
        <div className="space-y-4 border-t pt-6">
          <Label className="text-sm font-semibold">Sonnerie par défaut</Label>
          <div className="space-y-2">
            {alarmSounds.map((sound) => (
              <div
                key={sound.id}
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                  selectedSound === sound.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id={sound.id}
                    name="sound"
                    checked={selectedSound === sound.id}
                    onChange={() => setSelectedSound(sound.id)}
                    className="h-4 w-4 text-primary"
                  />
                  <label htmlFor={sound.id} className="cursor-pointer text-sm font-medium">
                    {sound.name}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playSound(sound.url)}
                  className="gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  Tester
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600 dark:text-blue-400">
            💡 Les notifications nécessitent l'autorisation de votre navigateur. 
            Cliquez sur "Autoriser" si demandé.
          </div>
        </div>
      )}
    </Card>
  );
};
