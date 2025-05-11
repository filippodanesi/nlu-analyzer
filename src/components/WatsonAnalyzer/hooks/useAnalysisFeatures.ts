import { useState, useEffect } from 'react';

export interface WatsonFeatures {
  keywords: boolean;
  entities: boolean;
  concepts: boolean;
  relations: boolean;
  categories: boolean;
  classifications: boolean; // Support for tone analysis
  emotion: boolean; // New: Emotion analysis
  sentiment: boolean; // New: Sentiment analysis
  semantic_roles: boolean; // New: Semantic roles analysis
  syntax: boolean; // New: Syntax analysis
}

export interface WatsonLimits {
  keywords: number;
  entities: number;
  concepts: number;
  categories: number;
  semantic_roles: number; // New: Limit for semantic roles
}

export const useAnalysisFeatures = () => {
  // Features state
  const [features, setFeatures] = useState<WatsonFeatures>({
    keywords: true,
    entities: true,
    concepts: true,
    relations: false,
    categories: true,
    classifications: false, // Default disabled for tone analysis
    emotion: false, // Default disabled for emotion analysis
    sentiment: false, // Default disabled for sentiment analysis
    semantic_roles: false, // Default disabled for semantic roles
    syntax: false, // Default disabled for syntax analysis
  });
  
  // Limits state
  const [limits, setLimits] = useState<WatsonLimits>({
    keywords: 10,
    entities: 10,
    concepts: 5,
    categories: 3,
    semantic_roles: 10, // Default limit for semantic roles
  });
  
  // Language state
  const [language, setLanguage] = useState("en");
  
  // Tone model state
  const [toneModel, setToneModel] = useState("tone-classifications-en-v1");
  
  // Update the tone model based on the selected language
  useEffect(() => {
    // Tone analysis is only available for English and French
    if (language === "en") {
      setToneModel("tone-classifications-en-v1");
    } else if (language === "fr") {
      setToneModel("tone-classifications-fr-v1");
    }
  }, [language]);
  
  return {
    features,
    setFeatures,
    limits,
    setLimits,
    language,
    setLanguage,
    toneModel,
    setToneModel
  };
};
