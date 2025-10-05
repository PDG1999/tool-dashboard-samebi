import { TestResult, Client } from '../types/dashboard';

export const exportToPDF = (testResult: TestResult, client: Client) => {
  // In real app, this would generate a PDF using a library like jsPDF
  console.log('Exporting to PDF:', { testResult, client });
  
  // Mock PDF generation
  const pdfContent = `
    SAMEBI Berater-Report
    ====================
    
    Klient: ${client.name}
    Datum: ${new Date(testResult.completedAt).toLocaleDateString('de-DE')}
    
    RISIKO-BEWERTUNG
    ================
    Gesamt-Risiko: ${testResult.professionalScores.overall}/100
    Risikostufe: ${testResult.professionalScores.riskLevel}
    Primärer Verdacht: ${testResult.professionalScores.primaryConcern}
    
    KATEGORIE-BREAKDOWN
    ===================
    Spielsucht: ${testResult.professionalScores.gambling}/100
    Alkohol: ${testResult.professionalScores.alcohol}/100
    Substanzen: ${testResult.professionalScores.substances}/100
    Kaufsucht: ${testResult.professionalScores.shopping}/100
    Digital: ${testResult.professionalScores.digital}/100
    
    QUALITÄTS-METRIKEN
    ==================
    Konsistenz: ${testResult.professionalScores.consistency}%
    Confidence: ${testResult.professionalScores.confidence}%
    
    SESSION-NOTIZEN
    ===============
    ${testResult.sessionNotes || 'Keine Notizen vorhanden'}
    
    FOLLOW-UP
    =========
    Erforderlich: ${testResult.followUpRequired ? 'Ja' : 'Nein'}
    ${testResult.followUpDate ? `Nächster Termin: ${new Date(testResult.followUpDate).toLocaleDateString('de-DE')}` : ''}
  `;
  
  // In real app, this would trigger PDF download
  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SAMEBI-Report-${client.name}-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToExcel = (testResults: TestResult[], clients: Client[]) => {
  // In real app, this would generate Excel using a library like xlsx
  console.log('Exporting to Excel:', { testResults, clients });
  
  // Mock Excel generation
  const csvContent = [
    ['Klient', 'Datum', 'Gesamt-Risiko', 'Risikostufe', 'Primärer Verdacht', 'Spielsucht', 'Alkohol', 'Substanzen', 'Kaufsucht', 'Digital', 'Konsistenz', 'Confidence'],
    ...testResults.map(test => {
      const client = clients.find(c => c.id === test.clientId);
      return [
        client?.name || 'Unbekannt',
        new Date(test.completedAt).toLocaleDateString('de-DE'),
        test.professionalScores.overall,
        test.professionalScores.riskLevel,
        test.professionalScores.primaryConcern,
        test.professionalScores.gambling,
        test.professionalScores.alcohol,
        test.professionalScores.substances,
        test.professionalScores.shopping,
        test.professionalScores.digital,
        test.professionalScores.consistency,
        test.professionalScores.confidence,
      ];
    })
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SAMEBI-Export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportClientList = (clients: Client[]) => {
  // In real app, this would generate a formatted client list
  console.log('Exporting client list:', clients);
  
  const csvContent = [
    ['Name', 'E-Mail', 'Telefon', 'Registriert', 'Letzter Test', 'Status'],
    ...clients.map(client => [
      client.name,
      client.email || '',
      client.phone || '',
      new Date(client.createdAt).toLocaleDateString('de-DE'),
      client.lastTestAt ? new Date(client.lastTestAt).toLocaleDateString('de-DE') : 'Nie',
      client.status === 'active' ? 'Aktiv' : client.status === 'inactive' ? 'Inaktiv' : 'Archiviert',
    ])
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SAMEBI-Klienten-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateReport = (testResults: TestResult[], clients: Client[]) => {
  // In real app, this would generate a comprehensive report
  console.log('Generating comprehensive report:', { testResults, clients });
  
  const totalTests = testResults.length;
  const totalClients = clients.length;
  const highRiskTests = testResults.filter(test => test.riskLevel === 'critical' || test.riskLevel === 'high').length;
  const averageRisk = testResults.reduce((sum, test) => sum + test.professionalScores.overall, 0) / totalTests;
  
  const concernCounts = testResults.reduce((acc, test) => {
    acc[test.professionalScores.primaryConcern] = (acc[test.professionalScores.primaryConcern] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonConcern = Object.entries(concernCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unbekannt';
  
  const reportContent = `
    SAMEBI Praxis-Bericht
    =====================
    Generiert am: ${new Date().toLocaleDateString('de-DE')}
    
    ZUSAMMENFASSUNG
    ===============
    Gesamt-Tests: ${totalTests}
    Aktive Klienten: ${totalClients}
    Hochrisiko-Tests: ${highRiskTests} (${((highRiskTests / totalTests) * 100).toFixed(1)}%)
    Durchschnittliches Risiko: ${averageRisk.toFixed(1)}/100
    
    HÄUFIGSTE PROBLEME
    ==================
    ${Object.entries(concernCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([concern, count]) => `${concern}: ${count} (${((count / totalTests) * 100).toFixed(1)}%)`)
      .join('\n')}
    
    RISIKO-VERTEILUNG
    =================
    Niedrig: ${testResults.filter(t => t.riskLevel === 'low').length}
    Mittel: ${testResults.filter(t => t.riskLevel === 'moderate').length}
    Hoch: ${testResults.filter(t => t.riskLevel === 'high').length}
    Kritisch: ${testResults.filter(t => t.riskLevel === 'critical').length}
    
    EMPFEHLUNGEN
    ============
    - Fokus auf ${mostCommonConcern}-Prävention
    - ${highRiskTests > totalTests * 0.2 ? 'Erhöhte Aufmerksamkeit für Hochrisiko-Klienten erforderlich' : 'Risikoverteilung im normalen Bereich'}
    - Regelmäßige Follow-ups für kritische Fälle
  `;
  
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SAMEBI-Praxis-Bericht-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
