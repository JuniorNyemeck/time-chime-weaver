import { useState, useEffect } from 'react';

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: number;
    description: string;
    icon: string;
  }>;
}

// Mock weather data - en production, utilisez une vraie API comme OpenWeatherMap
export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      setWeather({
        current: {
          temp: 22,
          description: 'Ensoleillé',
          icon: '☀️',
        },
        forecast: [
          { date: 'Lun', temp: 23, description: 'Ensoleillé', icon: '☀️' },
          { date: 'Mar', temp: 20, description: 'Nuageux', icon: '☁️' },
          { date: 'Mer', temp: 18, description: 'Pluie', icon: '🌧️' },
          { date: 'Jeu', temp: 21, description: 'Partiellement nuageux', icon: '⛅' },
          { date: 'Ven', temp: 24, description: 'Ensoleillé', icon: '☀️' },
          { date: 'Sam', temp: 25, description: 'Ensoleillé', icon: '☀️' },
          { date: 'Dim', temp: 22, description: 'Nuageux', icon: '☁️' },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  return { weather, loading };
};
