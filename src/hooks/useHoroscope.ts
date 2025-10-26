import { useState, useEffect } from 'react';

// Mock horoscope data
const horoscopes = [
  "Aujourd'hui est une journée parfaite pour vous concentrer sur vos objectifs personnels. Votre détermination sera récompensée.",
  "Les étoiles vous encouragent à prendre du temps pour vous. La méditation vous apportera clarté et paix intérieure.",
  "Une opportunité inattendue pourrait se présenter. Restez ouvert aux nouvelles possibilités.",
  "Votre créativité est à son apogée. C'est le moment idéal pour travailler sur vos projets artistiques.",
  "Les relations personnelles sont favorisées aujourd'hui. Prenez le temps de vous connecter avec vos proches.",
  "Votre patience sera mise à l'épreuve, mais gardez votre calme. La persévérance paie toujours.",
  "Une journée propice aux apprentissages. Votre esprit est particulièrement réceptif aux nouvelles connaissances.",
];

export const useHoroscope = () => {
  const [horoscope, setHoroscope] = useState<string>('');

  useEffect(() => {
    // Choisir un horoscope basé sur la date du jour
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % horoscopes.length;
    setHoroscope(horoscopes[index]);
  }, []);

  return horoscope;
};
