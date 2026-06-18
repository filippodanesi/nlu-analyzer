
import { useOptimizationConfig } from './optimization/useOptimizationConfig';
import { useOptimizationProcess } from './optimization/useOptimizationProcess';
import { matchKeywordInText, type KeywordMatch } from '../utils/keywordUtils';

// A target keyword is either present as a whole phrase, present partially, or absent.
export type KeywordStatus = KeywordMatch;

// Re-export the AIProvider type
export type { AIProvider } from './optimization/useOptimizationConfig';

interface UseTextOptimizationProps {
  text: string;
  results: any;
  targetKeywords: string[];
}

export const useTextOptimization = ({ text, results, targetKeywords }: UseTextOptimizationProps) => {
  // Get optimization configuration
  const config = useOptimizationConfig();

  // Get optimization process
  const optimizationProcess = useOptimizationProcess({
    text,
    results,
    targetKeywords,
    apiKey: config.apiKey,
    aiModel: config.aiModel,
    aiProvider: config.aiProvider
  });

  // The badges describe the text the user is currently acting on: the optimized
  // output once it exists, otherwise the original input. Status is measured
  // directly against that text, never against fabricated analysis data.
  const activeText = optimizationProcess.optimizedText || text;

  const checkKeywordStatus = (keyword: string): KeywordStatus =>
    matchKeywordInText(activeText, keyword);

  const keywordsToOptimize = targetKeywords.filter(kw => checkKeywordStatus(kw) === "missing");
  const keywordsWithPartialMatch = targetKeywords.filter(kw => checkKeywordStatus(kw) === "partial");

  // Optimization helps whenever a keyword is missing or only partially present.
  const needsOptimization = keywordsToOptimize.length > 0 || keywordsWithPartialMatch.length > 0;

  return {
    // Cost tracking
    costTracker: optimizationProcess.costTracker,
    lastCostRecord: optimizationProcess.lastCostRecord,

    // AI configuration
    ...config,

    // Optimization state & actions
    isOptimizing: optimizationProcess.isOptimizing,
    optimizedText: optimizationProcess.optimizedText,
    handleOptimize: optimizationProcess.handleOptimize,

    // Keywords data
    keywordsToOptimize,
    keywordsWithPartialMatch,
    needsOptimization,
    checkKeywordStatus
  };
};
