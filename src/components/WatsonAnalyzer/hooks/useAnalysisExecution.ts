
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { TextStats } from './useInputManagement';
import { WatsonFeatures, WatsonLimits, TONE_SUPPORTED_LANGUAGES } from './useAnalysisFeatures';
import { analyzeTextWithGoogleNLP, mapWatsonToGoogleFeatures } from '../utils/googleNlpUtils';
import type { AnalysisProvider } from './useAnalysisProvider';

interface AnalysisExecutionProps {
  text: string;
  features: WatsonFeatures;
  limits: WatsonLimits;
  language: string;
  toneModel: string;
  getCurrentApiKey: () => string;
  getCurrentUrl: () => string;
  getAuthType: () => string;
  updateTextStats: (text: string) => TextStats;
  // New prop for provider
  provider: AnalysisProvider;
  // Google specific props
  getGoogleApiKey?: () => string;
}

export const useAnalysisExecution = ({
  text,
  features,
  limits,
  language,
  toneModel,
  getCurrentApiKey,
  getCurrentUrl,
  getAuthType,
  updateTextStats,
  provider,
  getGoogleApiKey
}: AnalysisExecutionProps) => {
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [lastAnalyzedFeatures, setLastAnalyzedFeatures] = useState<WatsonFeatures | null>(null);

  // Reset results when features change significantly from last analyzed features
  useEffect(() => {
    // Only check if we have previous results and features
    if (results && lastAnalyzedFeatures) {
      // Check if tone analysis was toggled
      const toneWasToggled = 
        features.classifications !== lastAnalyzedFeatures.classifications;
      
      // If tone analysis was toggled, we should mark that a new analysis is needed
      if (toneWasToggled) {
        console.log("Tone analysis feature was toggled, new analysis will be needed");
      }
    }
  }, [features, lastAnalyzedFeatures, results]);

  // Function to analyze text with Watson NLU API
  const analyzeWithWatson = async () => {
    // Get current credentials
    const currentApiKey = getCurrentApiKey();
    const currentUrl = getCurrentUrl();

    if (!currentApiKey) {
      toast({
        title: "API Key richiesta",
        description: "Inserisci la tua IBM Watson NLU API key o abilita i secrets.",
        variant: "destructive",
      });
      return null;
    }

    if (!currentUrl) {
      toast({
        title: "URL richiesto",
        description: "Fornisci un URL valido per il servizio IBM Watson NLU.",
        variant: "destructive",
      });
      return null;
    }

    // Prepare parameters for API request
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
    
    if (features.categories) {
      featuresParams.categories = { 
        limit: limits.categories 
      };
    }
    
    // For tone analysis, include classifications if enabled and language is supported or auto
    if (features.classifications && TONE_SUPPORTED_LANGUAGES.includes(language)) {
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
      // Determine the authentication method based on environment variables
      const authType = getAuthType();
      let headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header based on auth type
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
        throw new Error(errorData.error || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing text with Watson:', error);
      throw error;
    }
  };

  // Function to analyze text with Google NLP API
  const analyzeWithGoogle = async () => {
    if (!getGoogleApiKey) {
      toast({
        title: "Configurazione mancante",
        description: "La funzione getGoogleApiKey non è stata fornita.",
        variant: "destructive",
      });
      return null;
    }

    const googleApiKey = getGoogleApiKey();
    
    if (!googleApiKey) {
      toast({
        title: "API Key richiesta",
        description: "Inserisci la tua Google Cloud NLP API key.",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Map Watson features to Google NLP features
      const googleFeatures = mapWatsonToGoogleFeatures(features);
      
      // Call Google NLP API
      return await analyzeTextWithGoogleNLP(text, googleApiKey, googleFeatures);
    } catch (error) {
      console.error('Error analyzing text with Google NLP:', error);
      throw error;
    }
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

    // Start analysis
    setIsAnalyzing(true);

    // Calculate text statistics
    const stats = updateTextStats(text);

    try {
      let data;
      
      // Choose the appropriate analysis method based on the provider
      if (provider === "watson") {
        data = await analyzeWithWatson();
      } else if (provider === "google") {
        data = await analyzeWithGoogle();
      } else {
        throw new Error(`Provider non supportato: ${provider}`);
      }

      if (!data) {
        throw new Error("Nessun dato ricevuto dall'API");
      }

      setResults(data);
      
      // Save the features used for this analysis to track changes
      setLastAnalyzedFeatures({...features});
      
      toast({
        title: "Analisi completata",
        description: "Il testo è stato analizzato con successo.",
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analisi fallita",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante l'analisi.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    results,
    handleAnalyze
  };
};
