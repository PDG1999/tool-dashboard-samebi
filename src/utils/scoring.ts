import { questions, sections, addictionTypes } from '@/data/questions';
import { analyzeAddictionDirection, getAddictionDirectionDescription, getDirectionSpecificRecommendations, AddictionDirection } from './addictionAnalysis';

export interface Response {
  questionId: string;
  value: number;
}

export interface PublicScores {
  timeManagement: number;
  financialHealth: number;
  emotionalHealth: number;
  socialConnections: number;
  physicalHealth: number;
  overall: number;
}

export interface ProfessionalScores {
  gambling: number;
  alcohol: number;
  substances: number;
  shopping: number;
  digital: number;
  overall: number;
  primaryConcern: string;
  riskLevel: 'Niedrig' | 'Mittel' | 'Hoch' | 'Kritisch';
  consistency: number;
  confidence: number;
  addictionDirection?: AddictionDirection; // Neue detaillierte Suchtrichtung-Analyse
  directionDescription?: string; // Textuelle Beschreibung
  directionRecommendations?: string[]; // Spezifische Empfehlungen
}

// Öffentliche Scores (für Teilnehmer sichtbar)
export function calculatePublicScores(responses: Response[]): PublicScores {
  const sectionScores: Record<string, number[]> = {
    time: [],
    finance: [],
    emotion: [],
    social: [],
    health: []
  };

  // Gruppiere Antworten nach Sektionen
  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (question) {
      sectionScores[question.section].push(response.value);
    }
  });

  // Berechne Durchschnitt pro Sektion (invertiert für positive Darstellung)
  const calcSectionScore = (values: number[]): number => {
    if (values.length === 0) return 100;
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    // Invertiere: 0 = 100, 4 = 0
    return Math.round(100 - (avg * 25));
  };

  const timeManagement = calcSectionScore(sectionScores.time);
  const financialHealth = calcSectionScore(sectionScores.finance);
  const emotionalHealth = calcSectionScore(sectionScores.emotion);
  const socialConnections = calcSectionScore(sectionScores.social);
  const physicalHealth = calcSectionScore(sectionScores.health);

  const overall = Math.round(
    (timeManagement + financialHealth + emotionalHealth + socialConnections + physicalHealth) / 5
  );

  return {
    timeManagement,
    financialHealth,
    emotionalHealth,
    socialConnections,
    physicalHealth,
    overall
  };
}

// Professionelle Scores (für Berater sichtbar)
export function calculateProfessionalScores(responses: Response[]): ProfessionalScores {
  // Definiere Indikatoren für jede Sucht-Kategorie
  const indicators = {
    gambling: [
      'f1_1', 'f1_2', 'f1_4', 'f1_5', 'f1_6', 'f1_8', 'f1_10', // Zeit & Kontrolle
      'f2_1', 'f2_2', 'f2_3', 'f2_4', 'f2_5', 'f2_6', 'f2_8', // Finanzen
      'f3_1', 'f3_2', 'f3_3', 'f3_4', // Emotionen
      'f4_1', 'f4_3', 'f4_4', 'f4_5' // Sozial
    ],
    alcohol: [
      'f5_4', // Substanz-Konsum (kritisch!)
      'f1_1', 'f1_3', 'f1_5', 'f1_6', // Zeit & Kontrolle
      'f3_1', 'f3_2', 'f3_3', 'f3_4', // Emotionen
      'f4_1', 'f4_3', 'f4_4', 'f4_5', // Sozial
      'f5_1', 'f5_2', 'f5_3' // Körperlich
    ],
    substances: [
      'f5_4', 'f5_3', // Substanz-Konsum & körperliche Veränderungen (kritisch!)
      'f1_5', 'f2_1', 'f2_5', 'f3_1', 'f4_3', 'f5_2' // Andere Indikatoren
    ],
    shopping: [
      'f2_1', 'f2_2', 'f2_3', 'f2_4', 'f2_6', 'f2_8', // Finanzen
      'f1_1', 'f3_2', 'f3_4', 'f4_1' // Andere
    ],
    digital: [
      'f1_1', 'f1_4', 'f1_7', 'f3_1', 'f3_3', 'f4_2', 'f4_4', 'f5_1'
    ]
  };

  // Berechne Score für jede Kategorie
  const calculateCategoryScore = (questionIds: string[]): number => {
    let fulfilledIndicators = 0;
    let totalIndicators = questionIds.length;

    questionIds.forEach(questionId => {
      const response = responses.find(r => r.questionId === questionId);
      const question = questions.find(q => q.id === questionId);
      
      if (response && question) {
        if (response.value >= question.threshold) {
          fulfilledIndicators++;
        }
      }
    });

    return Math.round((fulfilledIndicators / totalIndicators) * 100);
  };

  const gambling = calculateCategoryScore(indicators.gambling);
  const alcohol = calculateCategoryScore(indicators.alcohol);
  const substances = calculateCategoryScore(indicators.substances);
  const shopping = calculateCategoryScore(indicators.shopping);
  const digital = calculateCategoryScore(indicators.digital);

  // Finde primäre Sorge
  const scores = [gambling, alcohol, substances, shopping, digital];
  const maxScore = Math.max(...scores);
  const maxIndex = scores.indexOf(maxScore);
  
  const categories = ['gambling', 'alcohol', 'substances', 'shopping', 'digital'];
  const primaryConcern = maxScore > 40 ? addictionTypes[categories[maxIndex] as keyof typeof addictionTypes] : 'Keine';

  // Bestimme Risiko-Level
  let riskLevel: 'Niedrig' | 'Mittel' | 'Hoch' | 'Kritisch' = 'Niedrig';
  if (maxScore > 80) riskLevel = 'Kritisch';
  else if (maxScore > 60) riskLevel = 'Hoch';
  else if (maxScore > 40) riskLevel = 'Mittel';

  // Berechne Konsistenz (Anti-Gaming)
  const consistency = calculateConsistency(responses);

  // Berechne Confidence
  const confidence = calculateConfidence(responses, maxScore);

  const overall = Math.round((gambling + alcohol + substances + shopping + digital) / 5);

  // Neue: Analysiere Suchtrichtung im Detail
  const addictionDirection = analyzeAddictionDirection(responses);
  const directionDescription = getAddictionDirectionDescription(addictionDirection);
  const directionRecommendations = getDirectionSpecificRecommendations(addictionDirection);

  return {
    gambling,
    alcohol,
    substances,
    shopping,
    digital,
    overall,
    primaryConcern,
    riskLevel,
    consistency,
    confidence,
    addictionDirection,
    directionDescription,
    directionRecommendations
  };
}

// Konsistenz-Check (Anti-Gaming)
function calculateConsistency(responses: Response[]): number {
  // Definiere Paare von Fragen, die konsistent beantwortet werden sollten
  const consistencyPairs = [
    ['f1_2', 'f1_5'], // Vernachlässigung vs. gescheiterte Kontrolle
    ['f2_1', 'f4_3'], // Finanzielle vs. Verhaltens-Heimlichkeit
    ['f3_1', 'f3_2'], // Entzug vs. emotionale Abhängigkeit
    ['f4_1', 'f4_5'], // Konflikte vs. Beziehungsqualität
  ];

  let consistentPairs = 0;
  let totalPairs = consistencyPairs.length;

  consistencyPairs.forEach(([q1, q2]) => {
    const r1 = responses.find(r => r.questionId === q1);
    const r2 = responses.find(r => r.questionId === q2);
    
    if (r1 && r2) {
      // Prüfe auf logische Konsistenz
      const diff = Math.abs(r1.value - r2.value);
      if (diff <= 2) { // Erlaubte Abweichung
        consistentPairs++;
      }
    }
  });

  return Math.round((consistentPairs / totalPairs) * 100);
}

// Confidence-Berechnung
function calculateConfidence(responses: Response[], maxScore: number): number {
  const totalQuestions = responses.length;
  const answeredQuestions = responses.filter(r => r.value !== undefined).length;
  const completionRate = (answeredQuestions / totalQuestions) * 100;
  
  // Berücksichtige auch die Stärke der Antworten
  const averageResponse = responses.reduce((sum, r) => sum + r.value, 0) / responses.length;
  const responseStrength = (averageResponse / 4) * 100; // 4 ist max value
  
  // Kombiniere Completion Rate und Response Strength
  return Math.round((completionRate * 0.7) + (responseStrength * 0.3));
}

// Hilfsfunktionen für die UI
export function getRiskColor(score: number): string {
  if (score >= 80) return 'text-red-600';
  if (score >= 60) return 'text-orange-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-green-600';
}

export function getRiskBgColor(score: number): string {
  if (score >= 80) return 'bg-red-600';
  if (score >= 60) return 'bg-orange-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
}

export function getRiskLevel(score: number): string {
  if (score >= 80) return 'Kritisch';
  if (score >= 60) return 'Hoch';
  if (score >= 40) return 'Mittel';
  return 'Niedrig';
}

export function getRecommendations(proScores: ProfessionalScores): string[] {
  const recommendations: string[] = [];
  
  if (proScores.overall > 60) {
    recommendations.push('Sofortige professionelle Hilfe empfohlen');
    recommendations.push('Krisenintervention vorbereiten');
  } else if (proScores.overall > 40) {
    recommendations.push('Vertiefende Gespräche innerhalb einer Woche');
    recommendations.push('Spezifische Abklärung zu ' + proScores.primaryConcern);
  } else {
    recommendations.push('Regelmäßige Nachfrage empfohlen');
    recommendations.push('Präventive Maßnahmen besprechen');
  }

  if (proScores.consistency < 70) {
    recommendations.push('Inkonsistente Antworten - Test wiederholen');
  }

  if (proScores.confidence < 80) {
    recommendations.push('Niedrige Confidence - direkte Nachfrage');
  }

  return recommendations;
}
