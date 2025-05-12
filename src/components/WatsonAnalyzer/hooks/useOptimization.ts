
import { useState } from 'react';

export const useOptimization = () => {
  // Stato per l'ottimizzazione
  const [showOptimization, setShowOptimization] = useState<boolean>(false);
  
  // Funzione per mostrare/nascondere il pannello di ottimizzazione
  const toggleOptimization = () => {
    setShowOptimization(!showOptimization);
  };

  return {
    showOptimization,
    toggleOptimization,
    setShowOptimization
  };
};
