import { Response } from './scoring';
import { questions } from '../data/questions';

/**
 * Identifiziert die primäre und sekundäre Suchtrichtung basierend auf den Antworten
 */

export interface AddictionDirection {
  primary: {
    type: string;
    confidence: number; // 0-100
    indicators: string[];
  };
  secondary?: {
    type: string;
    confidence: number;
    indicators: string[];
  };
  patterns: {
    substanceBased: number; // Score für stoffgebundene Süchte
    behavioralBased: number; // Score für Verhaltenssüchte
    polyaddiction: boolean; // Mehrere Süchte gleichzeitig
  };
}

// Definitions-Typen für Suchtrichtungen
export const ADDICTION_TYPES = {
  ALCOHOL: 'Alkohol',
  DRUGS: 'Drogen/Substanzen',
  GAMBLING: 'Glücksspiel',
  GAMING: 'Gaming/Internet',
  SHOPPING: 'Kaufsucht',
  WORK: 'Arbeitssucht',
  FOOD: 'Essverhalten',
  SOCIAL_MEDIA: 'Social Media',
  PORNOGRAPHY: 'Pornografie',
  MIXED: 'Mischform',
} as const;

// Indikatoren pro Suchttyp - welche Fragen-IDs deuten auf welche Sucht hin
const ADDICTION_INDICATORS = {
  ALCOHOL: ['f4_9', 'f5_3', 'f5_5', 'f1_3', 'f2_5', 'f4_2'], // Substanz-bezogen, Entzug, soziale Folgen
  DRUGS: ['f4_9', 'f5_3', 'f1_3', 'f2_4', 'f4_7'], // Substanzen, Verheimlichen, Toleranz
  GAMBLING: ['f3_8', 'f2_8', 'f1_5', 'f2_2', 'f4_5'], // Glücksspiel, Finanzen, Kontrollverlust
  GAMING: ['f3_1', 'f3_2', 'f1_7', 'f4_3', 'f5_7'], // Digital, Zeitaufwand, soziale Isolation
  SHOPPING: ['f2_8', 'f1_5', 'f2_2', 'f3_5'], // Finanzielle Probleme, Kontrollverlust, Impulsivität
  WORK: ['f1_7', 'f4_1', 'f5_1', 'f2_3'], // Zeitaufwand, Pflichten vernachlässigt, Stress
  FOOD: ['f1_5', 'f2_4', 'f5_4'], // Kontrollverlust, Verheimlichen, Körperliche Symptome
  SOCIAL_MEDIA: ['f3_1', 'f3_2', 'f1_7', 'f4_3'], // Digital, Online-Verhalten, Zeitaufwand
  PORNOGRAPHY: ['f3_3', 'f2_4', 'f1_7', 'f4_8'], // Internet-Content, Verheimlichen, Zeitaufwand
};

// Gewichtung für kritische Fragen (höhere Scores sind wichtiger)
const CRITICAL_INDICATORS = {
  'f1_5': 3, // Kontrollverlust - sehr wichtig
  'f2_4': 3, // Verheimlichen - sehr wichtig
  'f4_5': 2.5, // Soziale Folgen
  'f5_3': 2.5, // Entzugssymptome
  'f4_9': 3, // Substanzen - direkt
  'f3_8': 3, // Glücksspiel - direkt
  'f3_1': 2, // Digital
  'f2_8': 2, // Finanzielle Probleme
};

/**
 * Analysiert die Antworten und identifiziert die Suchtrichtung
 */
export const analyzeAddictionDirection = (responses: Response[]): AddictionDirection => {
  const scores: { [key: string]: number } = {};
  const indicators: { [key: string]: string[] } = {};

  // Initialisiere Scores
  Object.keys(ADDICTION_TYPES).forEach(key => {
    scores[key] = 0;
    indicators[key] = [];
  });

  // Analysiere jede Antwort
  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (!question) return;

    // Prüfe für jeden Suchttyp, ob diese Frage ein Indikator ist
    Object.entries(ADDICTION_INDICATORS).forEach(([addictionType, questionIds]) => {
      if (questionIds.includes(response.questionId)) {
        // Gewichte die Antwort (höhere Werte = stärkere Ausprägung)
        const weight = CRITICAL_INDICATORS[response.questionId as keyof typeof CRITICAL_INDICATORS] || 1;
        const answerScore = response.value * weight;
        
        scores[addictionType] += answerScore;

        // Füge Indikator hinzu, wenn die Antwort signifikant ist (≥3)
        if (response.value >= 3) {
          indicators[addictionType].push(question.text);
        }
      }
    });
  });

  // Normalisiere Scores (0-100)
  const maxPossibleScore = Math.max(...Object.values(scores));
  Object.keys(scores).forEach(key => {
    scores[key] = maxPossibleScore > 0 ? (scores[key] / maxPossibleScore) * 100 : 0;
  });

  // Sortiere nach Score
  const sortedTypes = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort(([_, a], [__, b]) => b - a);

  // Bestimme primäre und sekundäre Suchtrichtung
  const primary = sortedTypes[0];
  const secondary = sortedTypes[1];

  // Berechne Substanz vs. Verhaltensbasiert
  const substanceTypes = ['ALCOHOL', 'DRUGS'];
  const behavioralTypes = ['GAMBLING', 'GAMING', 'SHOPPING', 'WORK', 'SOCIAL_MEDIA', 'PORNOGRAPHY', 'FOOD'];

  const substanceBased = substanceTypes.reduce((sum, type) => sum + (scores[type] || 0), 0) / substanceTypes.length;
  const behavioralBased = behavioralTypes.reduce((sum, type) => sum + (scores[type] || 0), 0) / behavioralTypes.length;

  // Polysucht-Erkennung: Mehr als 2 Typen mit Score > 40
  const highScoreTypes = sortedTypes.filter(([_, score]) => score > 40);
  const polyaddiction = highScoreTypes.length > 2;

  // Bestimme finalen Typ
  let primaryType = primary ? ADDICTION_TYPES[primary[0] as keyof typeof ADDICTION_TYPES] : ADDICTION_TYPES.MIXED;
  let secondaryType = secondary && secondary[1] > 30 ? ADDICTION_TYPES[secondary[0] as keyof typeof ADDICTION_TYPES] : undefined;

  // Wenn Polysucht erkannt wird
  if (polyaddiction) {
    primaryType = ADDICTION_TYPES.MIXED;
    secondaryType = primary ? ADDICTION_TYPES[primary[0] as keyof typeof ADDICTION_TYPES] : undefined;
  }

  return {
    primary: {
      type: primaryType,
      confidence: primary ? Math.round(primary[1]) : 0,
      indicators: primary ? indicators[primary[0]] || [] : [],
    },
    secondary: secondary && secondary[1] > 30 ? {
      type: secondaryType || '',
      confidence: Math.round(secondary[1]),
      indicators: indicators[secondary[0]] || [],
    } : undefined,
    patterns: {
      substanceBased: Math.round(substanceBased),
      behavioralBased: Math.round(behavioralBased),
      polyaddiction,
    },
  };
};

/**
 * Gibt eine textuelle Beschreibung der Suchtrichtung zurück
 */
export const getAddictionDirectionDescription = (direction: AddictionDirection): string => {
  const { primary, secondary, patterns } = direction;

  if (patterns.polyaddiction) {
    return `Mischform verschiedener Suchtproblematiken mit Schwerpunkt auf ${primary.type}${secondary ? ` und ${secondary.type}` : ''}. Es liegen Hinweise auf mehrere Problembereiche vor.`;
  }

  if (secondary && secondary.confidence > 30) {
    return `Primär ${primary.type}-bezogen (${primary.confidence}% Übereinstimmung), mit sekundären Hinweisen auf ${secondary.type} (${secondary.confidence}%).`;
  }

  return `Primär ${primary.type}-bezogen mit ${primary.confidence}% Übereinstimmung der relevanten Indikatoren.`;
};

/**
 * Gibt spezifische Empfehlungen basierend auf der Suchtrichtung zurück
 */
export const getDirectionSpecificRecommendations = (direction: AddictionDirection): string[] => {
  const recommendations: string[] = [];
  const primaryType = Object.keys(ADDICTION_TYPES).find(
    key => ADDICTION_TYPES[key as keyof typeof ADDICTION_TYPES] === direction.primary.type
  );

  switch (primaryType) {
    case 'ALCOHOL':
      recommendations.push(
        'Kontaktaufnahme zu Suchtberatungsstellen mit Alkohol-Schwerpunkt',
        'Erwägung einer ambulanten oder stationären Entzugstherapie',
        'Teilnahme an Selbsthilfegruppen (z.B. Anonyme Alkoholiker)',
        'Ärztliche Abklärung körperlicher Folgeschäden'
      );
      break;
    case 'DRUGS':
      recommendations.push(
        'Dringender Kontakt zu Drogenberatungsstellen',
        'Medizinische Begleitung beim Entzug (Cave: Lebensgefahr bei abruptem Entzug)',
        'Substitutionsprogramme bei Opiatabhängigkeit erwägen',
        'Psychotherapeutische Begleitung zur Rückfallprophylaxe'
      );
      break;
    case 'GAMBLING':
      recommendations.push(
        'Spezialisierte Beratung für pathologisches Glücksspiel',
        'Finanzielle Beratung und Schuldenregulierung',
        'Spielersperren in Casinos und Online-Plattformen',
        'Kognitive Verhaltenstherapie zur Impulskontrolle'
      );
      break;
    case 'GAMING':
      recommendations.push(
        'Medienberatung und Digital-Detox Programme',
        'Verhaltenstherapie mit Fokus auf Internetsucht',
        'Tagesstruktur und alternative Freizeitaktivitäten aufbauen',
        'Soziale Reintegration und Offline-Kontakte fördern'
      );
      break;
    case 'SHOPPING':
      recommendations.push(
        'Verhaltenstherapie mit Fokus auf Kaufsucht',
        'Finanzielle Beratung und Budgetplanung',
        'Erlernen von Impulskontrolltechniken',
        'Bearbeitung zugrunde liegender emotionaler Themen'
      );
      break;
    case 'WORK':
      recommendations.push(
        'Work-Life-Balance Programme',
        'Stressmanagement und Entspannungstechniken',
        'Psychotherapie bei Burnout-Risiko',
        'Berufliche Neuorientierung oder Arbeitszeitreduktion erwägen'
      );
      break;
    case 'FOOD':
      recommendations.push(
        'Ernährungsberatung und -therapie',
        'Psychotherapie bei Essstörungen',
        'Medizinische Begleitung und körperliche Gesundheitschecks',
        'Selbsthilfegruppen für Essstörungen'
      );
      break;
    case 'SOCIAL_MEDIA':
    case 'PORNOGRAPHY':
      recommendations.push(
        'Spezialisierte Beratung für Internetsucht',
        'Verhaltenstherapie und Impulskontrolle',
        'Digital Detox und Mediennutzungsregeln',
        'Bearbeitung von Beziehungs- und Intimitätsthemen'
      );
      break;
    case 'MIXED':
      recommendations.push(
        'Umfassende Suchtdiagnostik in spezialisierter Einrichtung',
        'Ganzheitlicher Therapieansatz für multiple Suchtproblematiken',
        'Intensive therapeutische Begleitung empfohlen',
        'Prüfung einer stationären Behandlung'
      );
      break;
    default:
      recommendations.push(
        'Allgemeine Suchtberatung aufsuchen',
        'Professionelle Diagnostik zur Klärung',
        'Psychotherapeutische Unterstützung erwägen'
      );
  }

  return recommendations;
};
