
import { useCredentialsConfig } from './useCredentialsConfig';
import { useAnalysisFeatures } from './useAnalysisFeatures';
import { useInputManagement } from './useInputManagement';
import { useAnalysisExecution } from './useAnalysisExecution';
import { useAnalysisProvider } from './useAnalysisProvider';
import { useGoogleNlpConfig } from './useGoogleNlpConfig';

export const useWatsonAnalyzer = () => {
  // Get credentials configuration
  const credentials = useCredentialsConfig();
  
  // Get features and limits
  const features = useAnalysisFeatures();
  
  // Get input management
  const input = useInputManagement();

  // Get provider configuration
  const provider = useAnalysisProvider();
  
  // Get Google NLP configuration
  const googleConfig = useGoogleNlpConfig();
  
  // Get analysis execution
  const analysis = useAnalysisExecution({
    text: input.text,
    features: features.features,
    limits: features.limits,
    language: features.language,
    toneModel: features.toneModel,
    getCurrentApiKey: credentials.getCurrentApiKey,
    getCurrentUrl: credentials.getCurrentUrl,
    getAuthType: credentials.getAuthType,
    updateTextStats: input.updateTextStats,
    provider: provider.provider,
    getGoogleApiKey: googleConfig.getCurrentApiKey
  });

  return {
    // Credentials configuration
    ...credentials,
    
    // Features and limits
    features: features.features,
    setFeatures: features.setFeatures,
    limits: features.limits,
    setLimits: features.setLimits,
    
    // Language
    language: features.language,
    setLanguage: features.setLanguage,
    
    // Tone model
    toneModel: features.toneModel,
    setToneModel: features.setToneModel,
    
    // Input
    text: input.text,
    setText: input.setText,
    inputMethod: input.inputMethod,
    setInputMethod: input.setInputMethod,
    targetKeywords: input.targetKeywords,
    setTargetKeywords: input.setTargetKeywords,
    
    // Analysis
    isAnalyzing: analysis.isAnalyzing,
    results: analysis.results,
    textStats: input.textStats,
    
    // Provider
    provider: provider.provider,
    setProvider: provider.setProvider,
    
    // Google NLP
    googleApiKey: googleConfig.apiKey,
    setGoogleApiKey: googleConfig.setApiKey,
    
    // Actions
    handleAnalyze: analysis.handleAnalyze,
    getTargetKeywordsList: input.getTargetKeywordsList,
  };
};

// Re-export types for use in other components
export type { 
  WatsonFeatures, 
  WatsonLimits 
} from './useAnalysisFeatures';

export type { 
  TextStats 
} from './useInputManagement';

export type {
  AnalysisProvider
} from './useAnalysisProvider';
