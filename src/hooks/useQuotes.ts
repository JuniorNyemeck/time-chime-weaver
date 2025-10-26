import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "La vie est ce qui arrive quand vous êtes occupé à faire d'autres plans.", author: "John Lennon" },
  { text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.", author: "Winston Churchill" },
  { text: "Soyez le changement que vous voulez voir dans le monde.", author: "Gandhi" },
  { text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs" },
  { text: "L'avenir appartient à ceux qui croient en la beauté de leurs rêves.", author: "Eleanor Roosevelt" },
  { text: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.", author: "Sénèque" },
  { text: "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions.", author: "Dalaï Lama" },
  { text: "La meilleure façon de prédire l'avenir est de le créer.", author: "Peter Drucker" },
  { text: "Tout ce que vous avez toujours voulu se trouve de l'autre côté de la peur.", author: "George Addair" },
  { text: "La vie est 10% ce qui vous arrive et 90% comment vous y réagissez.", author: "Charles R. Swindoll" },
  { text: "L'éducation est l'arme la plus puissante pour changer le monde.", author: "Nelson Mandela" },
  { text: "Celui qui déplace une montagne commence par déplacer de petites pierres.", author: "Confucius" },
  { text: "Le pessimiste voit la difficulté dans chaque opportunité. L'optimiste voit l'opportunité dans chaque difficulté.", author: "Winston Churchill" },
  { text: "Sois toi-même, tous les autres sont déjà pris.", author: "Oscar Wilde" },
  { text: "Deux choses sont infinies : l'univers et la bêtise humaine. Mais en ce qui concerne l'univers, je n'en ai pas encore acquis la certitude absolue.", author: "Albert Einstein" },
];

export const useQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    };

    // Initial quote
    getRandomQuote();

    // Change quote every 10 minutes (600000 ms)
    const interval = setInterval(getRandomQuote, 600000);

    return () => clearInterval(interval);
  }, []);

  return currentQuote;
};
