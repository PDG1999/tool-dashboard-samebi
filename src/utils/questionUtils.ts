import { Question } from '../data/questions';

/**
 * Fisher-Yates Shuffle Algorithm für echtes Durchmischen der Fragen
 * Macht es unmöglich, ein Muster zu erkennen
 */
export const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Interleave-Strategie: Fragen aus verschiedenen Kategorien werden abwechselnd präsentiert
 * Weniger zufällig als Shuffle, aber konsistenter und trotzdem schwer durchschaubar
 */
export const interleaveQuestions = (questions: Question[]): Question[] => {
  // Gruppiere Fragen nach Section
  const sections: { [key: string]: Question[] } = {};
  questions.forEach(q => {
    if (!sections[q.section]) {
      sections[q.section] = [];
    }
    sections[q.section].push(q);
  });

  // Shuffle innerhalb jeder Section
  Object.keys(sections).forEach(section => {
    sections[section] = shuffleQuestions(sections[section]);
  });

  // Interleave die Sections
  const result: Question[] = [];
  const sectionKeys = Object.keys(sections);
  let maxLength = Math.max(...Object.values(sections).map(arr => arr.length));

  for (let i = 0; i < maxLength; i++) {
    sectionKeys.forEach(key => {
      if (sections[key].length > 0) {
        result.push(sections[key].shift()!);
      }
    });
  }

  return result;
};

/**
 * Seeded Random Shuffle: Verwendet User-ID oder Session-ID als Seed
 * Jeder User bekommt eine andere, aber konsistente Reihenfolge
 */
export const seededShuffleQuestions = (questions: Question[], seed: string): Question[] => {
  // Simple seeded random number generator
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const seededRandom = () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };

  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Strategie-Auswahl: Gibt die durchmischten Fragen basierend auf der gewählten Strategie zurück
 */
export const getShuffledQuestions = (
  questions: Question[], 
  strategy: 'shuffle' | 'interleave' | 'seeded' = 'interleave',
  seed?: string
): Question[] => {
  switch (strategy) {
    case 'shuffle':
      return shuffleQuestions(questions);
    case 'interleave':
      return interleaveQuestions(questions);
    case 'seeded':
      return seed ? seededShuffleQuestions(questions, seed) : shuffleQuestions(questions);
    default:
      return questions;
  }
};
