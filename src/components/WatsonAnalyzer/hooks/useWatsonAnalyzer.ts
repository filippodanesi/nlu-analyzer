import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { calculateTextStats } from '../utils/mockDataUtils';

export interface WatsonFeatures {
  keywords: boolean;
  entities: boolean;
  concepts: boolean;
  relations: boolean;
  categories: boolean;
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
  // API Configuration state
  const [apiKey, setApiKey] = useState("");
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState("us-south");
  const [instanceId, setInstanceId] = useState("");
  
  // Features state
  const [features, setFeatures] = useState<WatsonFeatures>({
    keywords: true,
    entities: true,
    concepts: true,
    relations: false,
    categories: true,
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

  // Costruisce l'URL completo per le chiamate API
  const buildApiUrl = () => {
    if (region === "custom") {
      return url;
    }
    
    return `https://api.${region}.natural-language-understanding.watson.cloud.ibm.com/instances/${instanceId}/v1/analyze?version=2022-04-07`;
  };

  // Prepara le opzioni per la chiamata API
  const buildRequestOptions = () => {
    // Costruzione delle feature richieste
    const featuresObj: any = {};
    
    if (features.keywords) {
      featuresObj.keywords = { limit: limits.keywords, sentiment: true };
    }
    
    if (features.entities) {
      featuresObj.entities = { limit: limits.entities, sentiment: true };
    }
    
    if (features.concepts) {
      featuresObj.concepts = { limit: limits.concepts };
    }
    
    if (features.relations) {
      featuresObj.relations = {};
    }
    
    if (features.categories) {
      featuresObj.categories = { limit: limits.categories };
    }

    // Corpo della richiesta
    const requestBody = {
      text,
      features: featuresObj,
      language
    };

    // Opzioni di fetch
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`apikey:${apiKey}`)}`,
      },
      body: JSON.stringify(requestBody),
    };
  };

  const handleAnalyze = async () => {
    if (!text) {
      toast({
        title: "Nessun testo fornito",
        description: "Inserisci il testo da analizzare.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey && region !== "custom") {
      toast({
        title: "API Key richiesta",
        description: "Inserisci la tua API Key di IBM Watson NLU.",
        variant: "destructive",
      });
      return;
    }

    // Start analysis
    setIsAnalyzing(true);

    // Calculate text statistics
    const stats = calculateTextStats(text);
    setTextStats(stats);

    try {
      // Costruisce l'URL dell'API
      const apiUrl = buildApiUrl();

      // Chiama l'API di Watson NLU
      const response = await fetch(apiUrl, buildRequestOptions());
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore API (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("IBM Watson API response:", data);
      
      // Imposta i risultati
      setResults(data);
      
      toast({
        title: "Analisi completata",
        description: "Il testo è stato analizzato con successo.",
      });
    } catch (error) {
      console.error("Error calling IBM Watson API:", error);
      
      toast({
        title: "Errore nell'analisi",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante l'analisi del testo.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Process target keywords into an array
  const getTargetKeywordsList = () => {
    return targetKeywords
      .split(',')
      .map(kw => kw.trim())
      .filter(Boolean);
  };

  return {
    // API Configuration
    apiKey,
    setApiKey,
    url,
    setUrl,
    region,
    setRegion,
    instanceId,
    setInstanceId,
    
    // Features and limits
    features,
    setFeatures,
    limits,
    setLimits,
    
    // Language
    language,
    setLanguage,
    
    // Input
    text,
    setText,
    inputMethod,
    setInputMethod,
    targetKeywords,
    setTargetKeywords,
    
    // Analysis
    isAnalyzing,
    results,
    textStats,
    
    // Actions
    handleAnalyze,
    getTargetKeywordsList,
  };
};
