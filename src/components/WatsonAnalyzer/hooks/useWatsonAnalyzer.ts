
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { calculateTextStats } from '../utils/mockDataUtils';
import { useCredentialsConfig } from './useCredentialsConfig';

export interface WatsonFeatures {
  keywords: boolean;
  entities: boolean;
  concepts: boolean;
  relations: boolean;
  categories: boolean;
  classifications: boolean; // Supporto per analisi del tono
}

export interface WatsonLimits {
  keywords: number;
  entities: number;
  concepts: number;
  categories: number;
}

export interface TextStats {
  wordCount: number;
  sentenceCount: number;
  charCount: number;
}

export const useWatsonAnalyzer = () => {
  // Ottieni la configurazione delle credenziali
  const credentials = useCredentialsConfig();
  
  // Features state
  const [features, setFeatures] = useState<WatsonFeatures>({
    keywords: true,
    entities: true,
    concepts: true,
    relations: false,
    categories: true,
    classifications: false, // Default disabilitato per l'analisi del tono
  });
  
  // Limits state
  const [limits, setLimits] = useState<WatsonLimits>({
    keywords: 10,
    entities: 10,
    concepts: 5,
    categories: 3,
  });
  
  // Language state
  const [language, setLanguage] = useState("en");
  
  // Tone model state
  const [toneModel, setToneModel] = useState("tone-classifications-en-v1");
  
  // Input state
  const [text, setText] = useState("");
  const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
  const [targetKeywords, setTargetKeywords] = useState("");
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [textStats, setTextStats] = useState<TextStats>({
    wordCount: 0,
    sentenceCount: 0,
    charCount: 0,
  });

  // Aggiorna il modello di tono in base alla lingua selezionata
  useEffect(() => {
    // L'analisi del tono è disponibile solo per inglese e francese
    if (language === "en") {
      setToneModel("tone-classifications-en-v1");
    } else if (language === "fr") {
      setToneModel("tone-classifications-fr-v1");
    }
  }, [language]);

  const handleAnalyze = async () => {
    if (!text) {
      toast({
        title: "Nessun testo fornito",
        description: "Per favore inserisci un testo da analizzare.",
        variant: "destructive",
      });
      return;
    }

    // Ottieni le credenziali correnti
    const currentApiKey = credentials.getCurrentApiKey();
    const currentUrl = credentials.getCurrentUrl();

    if (!currentApiKey) {
      toast({
        title: "API Key richiesta",
        description: "Per favore inserisci la tua API key IBM Watson NLU o abilita i segreti.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUrl) {
      toast({
        title: "URL richiesto",
        description: "Per favore fornisci un URL valido per il servizio IBM Watson NLU.",
        variant: "destructive",
      });
      return;
    }

    // Verifica per l'analisi del tono - disponibile solo per en e fr
    if (features.classifications && language !== "en" && language !== "fr") {
      toast({
        title: "Lingua non supportata",
        description: "L'analisi del tono è disponibile solo per le lingue inglese e francese.",
        variant: "destructive",
      });
      return;
    }

    // Avvia analisi
    setIsAnalyzing(true);

    // Calcola le statistiche del testo
    const stats = calculateTextStats(text);
    setTextStats(stats);

    // Prepara i parametri per la richiesta API
    const featuresParams: any = {};
    
    if (features.keywords) {
      featuresParams.keywords = { 
        limit: limits.keywords,
        sentiment: true 
      };
    }
    
    if (features.entities) {
      featuresParams.entities = { 
        limit: limits.entities,
        sentiment: true 
      };
    }
    
    if (features.concepts) {
      featuresParams.concepts = { 
        limit: limits.concepts 
      };
    }
    
    if (features.relations) {
      featuresParams.relations = {};
    }
    
    if (features.categories) {
      featuresParams.categories = { 
        limit: limits.categories 
      };
    }
    
    if (features.classifications) {
      featuresParams.classifications = {
        model: toneModel
      };
    }

    const requestData = {
      text: text,
      features: featuresParams,
      language: language
    };

    try {
      // Determina il metodo di autorizzazione in base alle variabili d'ambiente
      const authType = credentials.getAuthType();
      let headers = {
        'Content-Type': 'application/json'
      };
      
      // Aggiungi l'header di autorizzazione in base al tipo di auth
      if (authType === "iam") {
        headers['Authorization'] = `Basic ${btoa(`apikey:${currentApiKey}`)}`;
      } else {
        headers['Authorization'] = `Bearer ${currentApiKey}`;
      }

      const response = await fetch(currentUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Richiesta API fallita');
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Analisi completata",
        description: "Il testo è stato analizzato con successo.",
      });
    } catch (error) {
      console.error('Errore nell\'analizzare il testo:', error);
      toast({
        title: "Analisi fallita",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante l'analisi.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Elabora le parole chiave target in un array
  const getTargetKeywordsList = () => {
    return targetKeywords
      .split(',')
      .map(kw => kw.trim())
      .filter(Boolean);
  };

  return {
    // Passa tutti gli stati e le funzioni delle credenziali
    ...credentials,
    
    // Features e limiti
    features,
    setFeatures,
    limits,
    setLimits,
    
    // Lingua
    language,
    setLanguage,
    
    // Modello di tono
    toneModel,
    setToneModel,
    
    // Input
    text,
    setText,
    inputMethod,
    setInputMethod,
    targetKeywords,
    setTargetKeywords,
    
    // Analisi
    isAnalyzing,
    results,
    textStats,
    
    // Azioni
    handleAnalyze,
    getTargetKeywordsList,
  };
};
