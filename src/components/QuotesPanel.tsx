import { useQuotes } from '@/hooks/useQuotes';
import { useWeather } from '@/hooks/useWeather';
import { useHoroscope } from '@/hooks/useHoroscope';
import { Card } from '@/components/ui/card';
import { Quote, Cloud, Sparkles, Calendar, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const QuotesPanel = () => {
  const currentQuote = useQuotes();
  const { weather, loading: weatherLoading } = useWeather();
  const horoscope = useHoroscope();

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Date et Heure */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span className="text-lg font-medium text-foreground">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-2xl font-bold text-foreground">{timeStr}</span>
          </div>
        </div>
      </Card>

      {/* Citation */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-start gap-4">
          <Quote className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <blockquote className="text-lg font-medium italic text-foreground mb-2">
              "{currentQuote.text}"
            </blockquote>
            <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
          </div>
        </div>
      </Card>

      {/* Horoscope Taureau */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Horoscope du Taureau ♉</h3>
            <p className="text-muted-foreground">{horoscope}</p>
          </div>
        </div>
      </Card>

      {/* Météo */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Cloud className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
          <h3 className="text-lg font-semibold text-foreground">Météo</h3>
        </div>
        
        {weatherLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : weather ? (
          <>
            {/* Météo actuelle */}
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                  <p className="text-3xl font-bold text-foreground">{weather.current.temp}°C</p>
                  <p className="text-sm text-muted-foreground">{weather.current.description}</p>
                </div>
                <span className="text-5xl">{weather.current.icon}</span>
              </div>
            </div>

            {/* Prévisions 7 jours */}
            <div className="grid grid-cols-7 gap-2">
              {weather.forecast.map((day, index) => (
                <div
                  key={index}
                  className="text-center p-2 rounded-lg bg-card hover:bg-accent/10 transition-colors"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-1">{day.date}</p>
                  <span className="text-2xl block mb-1">{day.icon}</span>
                  <p className="text-sm font-bold text-foreground">{day.temp}°</p>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
};
