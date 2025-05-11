import React, { useState, useEffect } from 'react';

export interface WatsonFeatures {
  keywords: boolean;
  entities: boolean;
  concepts: boolean;
  categories: boolean;
  classifications: boolean; // Support for tone analysis
}

export interface WatsonLimits {
  keywords: number;
  entities: number;
  concepts: number;
  categories: number;
}

export const useAnalysisFeatures = () => {
  // Features state
  const [features, setFeatures] = useState<WatsonFeatures>({
    keywords: true,
    entities: true,
    concepts: true,
    categories: true,
    classifications: false, // Default disabled for tone analysis
  });
  
  // Limits state
  const [limits, setLimits] = useState<WatsonLimits>({
    keywords: 10,
    entities: 10,
    concepts: 5,
    categories: 3,
  });
  
  // Language state
  const [language, setLanguage] = useState("auto"); // Default to auto-detect
  
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
