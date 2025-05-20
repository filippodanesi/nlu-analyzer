
import { useState, useEffect } from 'react';

export type AnalysisProvider = "watson" | "google";

export const useAnalysisProvider = () => {
  const [provider, setProvider] = useState<AnalysisProvider>(() => {
    return (sessionStorage.getItem('analysis_provider') as AnalysisProvider) || "watson";
  });

  // Save to sessionStorage when value changes
  useEffect(() => {
    if (provider) sessionStorage.setItem('analysis_provider', provider);
  }, [provider]);

  return {
    provider,
    setProvider,
    isWatson: provider === "watson",
    isGoogle: provider === "google"
  };
};
