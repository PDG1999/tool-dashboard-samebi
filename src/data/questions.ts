export interface Question {
  id: string;
  section: 'time' | 'finance' | 'emotion' | 'social' | 'health';
  text: string;
  options: { value: number; label: string }[];
  screens: string[];
  threshold: number;
  reverse?: boolean;
}

export const questions: Question[] = [
  // SEKTION 1: ZEITMANAGEMENT & PRIORITÄTEN (10 Fragen)
  {
    id: "f1_1",
    section: "time",
    text: "Wie oft kommt es vor, dass Sie länger mit einer Aktivität verbringen, als Sie ursprünglich geplant hatten?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Sehr oft" }
    ],
    screens: ["control_loss", "gambling", "shopping", "digital", "all"],
    threshold: 2
  },
  {
    id: "f1_2",
    section: "time",
    text: "In den letzten 6 Monaten: Wie häufig haben Sie wichtige Termine oder Verpflichtungen wegen anderer Aktivitäten verschoben?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "1-2 Mal" },
      { value: 2, label: "3-5 Mal" },
      { value: 3, label: "6-10 Mal" },
      { value: 4, label: "Mehr als 10 Mal" }
    ],
    screens: ["neglect", "all"],
    threshold: 2
  },
  {
    id: "f1_3",
    section: "time",
    text: "Haben Sie das Gefühl, dass Sie in letzter Zeit mehr Zeit oder Intensität brauchen, um sich entspannt oder zufrieden zu fühlen?",
    options: [
      { value: 0, label: "Überhaupt nicht" },
      { value: 1, label: "Ein wenig" },
      { value: 2, label: "Einigermaßen" },
      { value: 3, label: "Ziemlich" },
      { value: 4, label: "Sehr stark" }
    ],
    screens: ["tolerance", "all"],
    threshold: 2
  },
  {
    id: "f1_4",
    section: "time",
    text: "Wie oft denken Sie an eine bestimmte Aktivität, auch wenn Sie gerade etwas anderes tun sollten?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Fast ständig" }
    ],
    screens: ["craving", "all"],
    threshold: 3
  },
  {
    id: "f1_5",
    section: "time",
    text: "In den letzten 3 Monaten: Wie oft haben Sie versucht, eine bestimmte Gewohnheit zu reduzieren, es aber nicht geschafft?",
    options: [
      { value: 0, label: "Nie versucht / kein Problem" },
      { value: 1, label: "1 Versuch" },
      { value: 2, label: "2-3 Versuche" },
      { value: 3, label: "4-5 Versuche" },
      { value: 4, label: "Mehr als 5 Versuche" }
    ],
    screens: ["failed_control", "all"],
    threshold: 2
  },
  {
    id: "f1_6",
    section: "time",
    text: "Haben Sie bemerkt, dass eine bestimmte Aktivität in Ihrem Leben wichtiger geworden ist als Dinge, die Ihnen früher wichtig waren?",
    options: [
      { value: 0, label: "Überhaupt nicht" },
      { value: 1, label: "Ein wenig" },
      { value: 2, label: "Einigermaßen" },
      { value: 3, label: "Deutlich" },
      { value: 4, label: "Sehr stark" }
    ],
    screens: ["priority_shift", "all"],
    threshold: 2
  },
  {
    id: "f1_7",
    section: "time",
    text: "Wie viel Zeit verbringen Sie täglich mit einer bestimmten Freizeitaktivität (Online, Shopping, Unterhaltung, etc.)?",
    options: [
      { value: 0, label: "Unter 30 Minuten" },
      { value: 1, label: "30-60 Minuten" },
      { value: 2, label: "1-2 Stunden" },
      { value: 3, label: "2-4 Stunden" },
      { value: 4, label: "Über 4 Stunden" }
    ],
    screens: ["time_spent", "digital", "gambling"],
    threshold: 3
  },
  {
    id: "f1_8",
    section: "time",
    text: "Wie sehr bestimmt eine bestimmte Aktivität Ihren Tagesablauf?",
    options: [
      { value: 0, label: "Gar nicht, flexible Gestaltung" },
      { value: 1, label: "Kaum" },
      { value: 2, label: "Teilweise" },
      { value: 3, label: "Ziemlich stark" },
      { value: 4, label: "Vollständig, alles dreht sich darum" }
    ],
    screens: ["structural_dominance", "all"],
    threshold: 3
  },
  {
    id: "f1_9",
    section: "time",
    text: "Wie gut gelingt es Ihnen, bewusste Pausen zu machen und abzuschalten?",
    options: [
      { value: 0, label: "Sehr gut, regelmäßige Pausen" },
      { value: 1, label: "Meistens gut" },
      { value: 2, label: "Manchmal schwierig" },
      { value: 3, label: "Oft schwierig" },
      { value: 4, label: "Fast unmöglich" }
    ],
    screens: ["regeneration_inability", "all"],
    threshold: 3
  },
  {
    id: "f1_10",
    section: "time",
    text: "Wenn Sie an eine gewohnte Aktivität denken, empfinden Sie eher Vorfreude oder eher ein Gefühl von 'Ich muss das tun'?",
    options: [
      { value: 0, label: "Reine Vorfreude, freie Wahl" },
      { value: 1, label: "Meist Vorfreude" },
      { value: 2, label: "Gemischt" },
      { value: 3, label: "Eher Zwang" },
      { value: 4, label: "Starker innerer Zwang" }
    ],
    screens: ["compulsiveness", "all"],
    threshold: 3
  },

  // SEKTION 2: FINANZIELLE GESUNDHEIT (8 Fragen)
  {
    id: "f2_1",
    section: "finance",
    text: "Gibt es Ausgaben in Ihrem Budget, die Sie lieber für sich behalten, statt sie mit Familie/Partner zu besprechen?",
    options: [
      { value: 0, label: "Nein, völlig transparent" },
      { value: 1, label: "Kleinigkeiten manchmal" },
      { value: 2, label: "Ja, einige Dinge" },
      { value: 3, label: "Ja, größere Beträge" },
      { value: 4, label: "Ja, bedeutende Summen" }
    ],
    screens: ["secrecy", "gambling", "shopping", "substances"],
    threshold: 2
  },
  {
    id: "f2_2",
    section: "finance",
    text: "Wie oft kommt es vor, dass Sie Geld ausgeben, obwohl Sie wissen, dass Sie es eigentlich nicht sollten?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Monatlich" },
      { value: 3, label: "Wöchentlich" },
      { value: 4, label: "Mehrmals pro Woche" }
    ],
    screens: ["control_loss", "shopping", "gambling"],
    threshold: 2
  },
  {
    id: "f2_3",
    section: "finance",
    text: "Haben Sie schon einmal Geld von Familie/Freunden geliehen, um finanzielle Engpässe zu überbrücken?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "1-2 Mal in meinem Leben" },
      { value: 2, label: "Gelegentlich" },
      { value: 3, label: "Mehrfach im letzten Jahr" },
      { value: 4, label: "Regelmäßig" }
    ],
    screens: ["financial_consequences", "gambling", "shopping", "substances"],
    threshold: 2
  },
  {
    id: "f2_4",
    section: "finance",
    text: "Wie oft versuchen Sie, einen finanziellen Verlust oder Fehler durch weitere Ausgaben 'wiedergutzumachen'?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Sehr selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Sehr oft" }
    ],
    screens: ["chasing", "gambling"],
    threshold: 3
  },
  {
    id: "f2_5",
    section: "finance",
    text: "In den letzten 12 Monaten: Hatten Sie finanzielle Probleme oder Lücken, die Sie nicht vollständig erklären können?",
    options: [
      { value: 0, label: "Nein, alles nachvollziehbar" },
      { value: 1, label: "Kleinere ungeklärte Lücken" },
      { value: 2, label: "Ja, einige Male" },
      { value: 3, label: "Ja, mehrfach" },
      { value: 4, label: "Ja, regelmäßig" }
    ],
    screens: ["secrecy", "financial_consequences", "gambling", "substances"],
    threshold: 2
  },
  {
    id: "f2_6",
    section: "finance",
    text: "Wie gut halten Sie sich an ein Budget oder finanzielle Vorsätze?",
    options: [
      { value: 0, label: "Sehr gut, halte mich immer dran" },
      { value: 1, label: "Meistens gut" },
      { value: 2, label: "Manchmal schwierig" },
      { value: 3, label: "Oft schwierig" },
      { value: 4, label: "Fast nie, ständig Überschreitungen" }
    ],
    screens: ["financial_control", "shopping", "gambling"],
    threshold: 3
  },
  {
    id: "f2_7",
    section: "finance",
    text: "Wie oft machen Sie sich Sorgen über Ihre finanzielle Situation?",
    options: [
      { value: 0, label: "Nie / sehr selten" },
      { value: 1, label: "Gelegentlich" },
      { value: 2, label: "Mehrmals im Monat" },
      { value: 3, label: "Mehrmals pro Woche" },
      { value: 4, label: "Täglich / ständig" }
    ],
    screens: ["financial_stress", "all"],
    threshold: 3
  },
  {
    id: "f2_8",
    section: "finance",
    text: "Wie hat sich Ihre Schulden-Situation in den letzten 12 Monaten entwickelt?",
    options: [
      { value: 0, label: "Abbau von Schulden / schuldenfrei" },
      { value: 1, label: "Stabil geblieben" },
      { value: 2, label: "Leicht gestiegen" },
      { value: 3, label: "Deutlich gestiegen" },
      { value: 4, label: "Stark gestiegen / kritisch" }
    ],
    screens: ["financial_consequences", "gambling", "shopping"],
    threshold: 3
  },

  // SEKTION 3: EMOTIONALE GESUNDHEIT (8 Fragen)
  {
    id: "f3_1",
    section: "emotion",
    text: "Wenn Sie eine gewohnte Aktivität nicht ausführen können, wie fühlen Sie sich?",
    options: [
      { value: 0, label: "Neutral, kein Problem" },
      { value: 1, label: "Leicht enttäuscht" },
      { value: 2, label: "Unruhig oder gereizt" },
      { value: 3, label: "Stark unruhig oder ängstlich" },
      { value: 4, label: "Extrem unwohl, fast panisch" }
    ],
    screens: ["withdrawal", "all"],
    threshold: 3
  },
  {
    id: "f3_2",
    section: "emotion",
    text: "Nutzen Sie bestimmte Aktivitäten, um sich besser zu fühlen, wenn Sie gestresst oder niedergeschlagen sind?",
    options: [
      { value: 0, label: "Selten, ich habe viele Bewältigungsstrategien" },
      { value: 1, label: "Manchmal" },
      { value: 2, label: "Oft" },
      { value: 3, label: "Fast immer" },
      { value: 4, label: "Es ist meine einzige Bewältigungsstrategie" }
    ],
    screens: ["emotional_dependency", "all"],
    threshold: 3
  },
  {
    id: "f3_3",
    section: "emotion",
    text: "Wie oft erleben Sie Stimmungsschwankungen, die mit bestimmten Aktivitäten zusammenhängen (z.B. Hochgefühl währenddessen, Tief danach)?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Sehr oft" }
    ],
    screens: ["emotional_dysregulation", "all"],
    threshold: 2
  },
  {
    id: "f3_4",
    section: "emotion",
    text: "Haben Sie nach bestimmten Aktivitäten Schuldgefühle oder Reue?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Sehr selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Fast immer" }
    ],
    screens: ["negative_consequences", "all"],
    threshold: 2
  },
  {
    id: "f3_5",
    section: "emotion",
    text: "Wie stabil fühlen Sie sich emotional in Ihrem Alltag?",
    options: [
      { value: 0, label: "Sehr stabil" },
      { value: 1, label: "Meistens stabil" },
      { value: 2, label: "Wechselhaft" },
      { value: 3, label: "Oft instabil" },
      { value: 4, label: "Sehr instabil" }
    ],
    screens: ["emotional_health", "comorbidity"],
    threshold: 3
  },
  {
    id: "f3_6",
    section: "emotion",
    text: "Wie würden Sie Ihr Selbstwertgefühl in letzter Zeit beschreiben?",
    options: [
      { value: 0, label: "Stark und positiv" },
      { value: 1, label: "Überwiegend gut" },
      { value: 2, label: "Schwankend" },
      { value: 3, label: "Eher niedrig" },
      { value: 4, label: "Sehr niedrig" }
    ],
    screens: ["self_worth", "comorbidity"],
    threshold: 3
  },
  {
    id: "f3_7",
    section: "emotion",
    text: "Wie oft erleben Sie Angstgefühle oder innere Unruhe?",
    options: [
      { value: 0, label: "Nie / sehr selten" },
      { value: 1, label: "Gelegentlich" },
      { value: 2, label: "Mehrmals im Monat" },
      { value: 3, label: "Mehrmals pro Woche" },
      { value: 4, label: "Täglich" }
    ],
    screens: ["anxiety", "comorbidity"],
    threshold: 3
  },
  {
    id: "f3_8",
    section: "emotion",
    text: "In den letzten 2 Wochen: Wie oft hatten Sie das Gefühl, dass Ihnen Dinge, die Sie normalerweise gerne tun, keine Freude mehr bereiten?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "An einigen Tagen" },
      { value: 2, label: "An mehr als der Hälfte der Tage" },
      { value: 3, label: "Fast täglich" },
      { value: 4, label: "Täglich" }
    ],
    screens: ["depression", "comorbidity"],
    threshold: 2
  },

  // SEKTION 4: SOZIALE BEZIEHUNGEN (7 Fragen)
  {
    id: "f4_1",
    section: "social",
    text: "Wie häufig gibt es Meinungsverschiedenheiten mit nahestehenden Personen über Ihre Freizeitgestaltung oder Gewohnheiten?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Gelegentlich" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Sehr oft" }
    ],
    screens: ["conflicts", "all"],
    threshold: 2
  },
  {
    id: "f4_2",
    section: "social",
    text: "Bevorzugen Sie es manchmal, eine Aktivität alleine auszuführen, auch wenn Sie sie mit anderen teilen könnten?",
    options: [
      { value: 0, label: "Nein, ich teile gerne" },
      { value: 1, label: "Manchmal bevorzuge ich es alleine" },
      { value: 2, label: "Oft bevorzuge ich es alleine" },
      { value: 3, label: "Fast immer alleine" },
      { value: 4, label: "Ausschließlich alleine" }
    ],
    screens: ["isolation", "all"],
    threshold: 2
  },
  {
    id: "f4_3",
    section: "social",
    text: "Wie oft kommt es vor, dass Sie Details über Ihre Freizeitaktivitäten oder Gewohnheiten für sich behalten, um Diskussionen zu vermeiden?",
    options: [
      { value: 0, label: "Nie, ich bin offen" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Regelmäßig / systematisch" }
    ],
    screens: ["secrecy", "all"],
    threshold: 2
  },
  {
    id: "f4_4",
    section: "social",
    text: "Haben Sie soziale Kontakte, Hobbys oder Aktivitäten reduziert, um mehr Zeit für bestimmte Gewohnheiten zu haben?",
    options: [
      { value: 0, label: "Nein, keine Veränderung" },
      { value: 1, label: "Ein wenig reduziert" },
      { value: 2, label: "Einige Aktivitäten aufgegeben" },
      { value: 3, label: "Viele Aktivitäten aufgegeben" },
      { value: 4, label: "Fast alle früheren Aktivitäten aufgegeben" }
    ],
    screens: ["neglect", "all"],
    threshold: 2
  },
  {
    id: "f4_5",
    section: "social",
    text: "Wie würden Sie die Qualität Ihrer engsten Beziehungen (Familie, Partner, Freunde) derzeit beschreiben?",
    options: [
      { value: 0, label: "Ausgezeichnet" },
      { value: 1, label: "Gut" },
      { value: 2, label: "Zufriedenstellend" },
      { value: 3, label: "Angespannt" },
      { value: 4, label: "Sehr problematisch" }
    ],
    screens: ["relationship_consequences", "all"],
    threshold: 3
  },
  {
    id: "f4_6",
    section: "social",
    text: "Wie gut können Sie sich auf Ihr soziales Umfeld verlassen, wenn Sie Unterstützung brauchen?",
    options: [
      { value: 0, label: "Sehr gut, starkes Netz" },
      { value: 1, label: "Gut" },
      { value: 2, label: "Einigermaßen" },
      { value: 3, label: "Kaum" },
      { value: 4, label: "Gar nicht, fühle mich isoliert" }
    ],
    screens: ["isolation", "risk_factor"],
    threshold: 3
  },
  {
    id: "f4_7",
    section: "social",
    text: "Wie ehrlich können Sie mit nahestehenden Personen über Ihre Gefühle und Sorgen sprechen?",
    options: [
      { value: 0, label: "Sehr offen und ehrlich" },
      { value: 1, label: "Meistens offen" },
      { value: 2, label: "Teilweise offen" },
      { value: 3, label: "Eher verschlossen" },
      { value: 4, label: "Sehr verschlossen" }
    ],
    screens: ["communication_deficit", "risk_factor"],
    threshold: 3
  },

  // SEKTION 5: PHYSISCHE GESUNDHEIT (7 Fragen)
  {
    id: "f5_1",
    section: "health",
    text: "Wie oft beeinträchtigen Ihre Gewohnheiten oder Aktivitäten Ihren Schlaf?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Fast jede Nacht" }
    ],
    screens: ["physical_consequences", "all"],
    threshold: 2
  },
  {
    id: "f5_2",
    section: "health",
    text: "In den letzten 6 Monaten: Wie häufig haben Sie Mahlzeiten ausgelassen oder unregelmäßig gegessen?",
    options: [
      { value: 0, label: "Fast nie, regelmäßige Mahlzeiten" },
      { value: 1, label: "Gelegentlich" },
      { value: 2, label: "Mehrmals pro Woche" },
      { value: 3, label: "Fast täglich" },
      { value: 4, label: "Täglich" }
    ],
    screens: ["self_neglect", "all"],
    threshold: 2
  },
  {
    id: "f5_3",
    section: "health",
    text: "Haben Sie Veränderungen an Ihrem Körper bemerkt, die Sie beunruhigen (Gewicht, Haut, Energie, Aussehen)?",
    options: [
      { value: 0, label: "Nein, keine bemerkenswerten Veränderungen" },
      { value: 1, label: "Kleinere Veränderungen" },
      { value: 2, label: "Einige bemerkenswerte Veränderungen" },
      { value: 3, label: "Deutliche Veränderungen" },
      { value: 4, label: "Starke, besorgniserregende Veränderungen" }
    ],
    screens: ["physical_consequences", "substances", "alcohol"],
    threshold: 3
  },
  {
    id: "f5_4",
    section: "health",
    text: "Wie oft konsumieren Sie Substanzen (Alkohol, Medikamente, andere) zur Entspannung oder zum Einschlafen?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Sehr selten" },
      { value: 2, label: "Gelegentlich" },
      { value: 3, label: "Mehrmals pro Woche" },
      { value: 4, label: "Fast täglich / täglich" }
    ],
    screens: ["substance_abuse", "alcohol"],
    threshold: 2
  },
  {
    id: "f5_5",
    section: "health",
    text: "Wie würden Sie Ihr Energie-Level im Alltag beschreiben?",
    options: [
      { value: 0, label: "Hohe Energie, vital" },
      { value: 1, label: "Gut" },
      { value: 2, label: "Durchschnittlich" },
      { value: 3, label: "Oft erschöpft" },
      { value: 4, label: "Chronisch erschöpft" }
    ],
    screens: ["physical_health", "comorbidity"],
    threshold: 3
  },
  {
    id: "f5_6",
    section: "health",
    text: "Wie oft bewegen Sie sich körperlich (Sport, Spaziergänge, etc.)?",
    options: [
      { value: 0, label: "Täglich" },
      { value: 1, label: "Mehrmals pro Woche" },
      { value: 2, label: "Einmal pro Woche" },
      { value: 3, label: "Sehr selten" },
      { value: 4, label: "Fast nie" }
    ],
    screens: ["self_neglect", "all"],
    threshold: 3
  },
  {
    id: "f5_7",
    section: "health",
    text: "Wie regelmäßig kümmern Sie sich um notwendige Arztbesuche und Gesundheits-Check-ups?",
    options: [
      { value: 0, label: "Sehr regelmäßig" },
      { value: 1, label: "Regelmäßig" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Selten" },
      { value: 4, label: "Fast nie / vernachlässige ich" }
    ],
    screens: ["self_neglect", "all"],
    threshold: 3
  }
];

export const sections = {
  time: "Zeitmanagement & Prioritäten",
  finance: "Finanzielle Gesundheit", 
  emotion: "Emotionale Stabilität",
  social: "Soziale Beziehungen",
  health: "Körperliche Gesundheit"
};

export const addictionTypes = {
  gambling: "Spielsucht / Glücksspiel",
  alcohol: "Alkohol-Missbrauch", 
  substances: "Substanz-Missbrauch",
  shopping: "Kaufsucht",
  digital: "Digital-Sucht / Social Media"
};
