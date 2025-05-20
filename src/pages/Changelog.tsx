
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from '@/components/WatsonAnalyzer/components/Footer';

const Changelog: React.FC = () => {
  const versions = [
    {
      version: "1.1.5",
      date: "20 Maggio 2025",
      features: [
        "Risoluzione di errori di importazione in useOptimizationProcess.ts",
        "Correzione dei percorsi di importazione per i moduli di ottimizzazione",
        "Miglioramento della gestione degli errori per i modelli AI"
      ]
    },
    {
      version: "1.1.4",
      date: "19 Maggio 2025",
      features: [
        "Miglioramento dell'identificazione di entità prodotto nell'analisi del testo",
        "Perfezionamento della corrispondenza delle parole chiave nei testi ottimizzati",
        "Miglioramento del riconoscimento di entità nel testo ottimizzato"
      ]
    },
    {
      version: "1.1.3",
      date: "18 Maggio 2025",
      features: [
        "Correzione dell'errore con il modello o4-mini",
        "Aggiornamento di openAiUtils.ts per utilizzare max_completion_tokens invece di max_tokens",
        "Miglioramento dei messaggi di errore specifici per i modelli AI"
      ]
    },
    {
      version: "1.1.2",
      date: "17 Maggio 2025",
      features: [
        "Ottimizzazione dell'interfaccia utente per l'analisi dei testi",
        "Miglioramento dell'esperienza utente nel pannello dei risultati",
        "Perfezionamento del sistema di riconoscimento delle parole chiave"
      ]
    },
    {
      version: "1.1.1",
      date: "16 Maggio 2025",
      features: [
        "Aggiunta del supporto per nuove lingue nell'analisi del tono",
        "Miglioramento dell'algoritmo di elaborazione delle entità",
        "Ottimizzazione delle prestazioni nell'analisi dei testi lunghi"
      ]
    },
    {
      version: "1.1.0",
      date: "15 Maggio 2025",
      features: [
        "Aggiunta della funzionalità di ottimizzazione del testo con AI",
        "Implementazione del supporto per OpenAI e Claude",
        "Integrazione del monitoraggio dei costi per le API di AI"
      ]
    },
    {
      version: "1.0.0",
      date: "14 Maggio 2025",
      features: [
        "Versione iniziale dell'applicazione",
        "Implementazione dell'interfaccia di base per l'analisi del testo",
        "Integrazione con IBM Watson Natural Language Understanding API",
        "Supporto per l'analisi di keywords, entità, concetti e categorie"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Torna alla Home</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold">Changelog</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-5xl mx-auto px-4 py-8 flex-grow">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Roadmap e Storico degli Aggiornamenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Questo changelog tiene traccia di tutti gli aggiornamenti e le migliorie apportate a IBM Watson Natural Language Understanding Analyzer nel tempo.
            </p>
            
            <div className="space-y-8">
              {versions.map((version, index) => (
                <div key={version.version} className="relative">
                  {/* Timeline connector */}
                  {index < versions.length - 1 && (
                    <div className="absolute left-[9px] top-10 w-0.5 h-[calc(100%-24px)] bg-border"></div>
                  )}
                  
                  <div className="flex gap-4">
                    {/* Timeline bullet */}
                    <div className="relative w-5 h-5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">Versione {version.version}</h3>
                        <Badge variant="outline">{version.date}</Badge>
                      </div>
                      
                      <ul className="list-disc list-inside pl-2 space-y-1">
                        {version.features.map((feature, idx) => (
                          <li key={idx} className="text-muted-foreground">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-muted rounded-lg p-6 text-center">
          <h3 className="font-medium mb-2">Prossime funzionalità in arrivo</h3>
          <p className="text-muted-foreground">
            Stiamo lavorando a nuove funzionalità per migliorare l'esperienza di analisi e ottimizzazione del testo.
            Resta aggiornato per le prossime versioni!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Changelog;
