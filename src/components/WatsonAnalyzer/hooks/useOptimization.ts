
import { useState } from 'react';

/**
 * Hook to manage optimization state
 */
export const useOptimization = () => {
  const [showOptimization, setShowOptimization] = useState(true);
  
  return {
    showOptimization,
    setShowOptimization
  };
};
