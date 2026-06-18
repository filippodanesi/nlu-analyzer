
import { useOptimizationConfig } from './optimization/useOptimizationConfig';
import { useOptimizationProcess } from './optimization/useOptimizationProcess';
import { matchKeywordInText, type KeywordMatch } from '../utils/keywordUtils';

// A target keyword is either present as a whole phrase, present partially, or absent.
export type KeywordStatus = KeywordMatch;

interface UseTextOptimizationProps {
  text: string;
  results: any;
  targetKeywords: string[];
}

export const useTextOptimization = ({ text, results, targetKeywords }: UseTextOptimizationProps) => {
  const { apiKey, setApiKey, aiModel } = useOptimizationConfig();

  const { isOptimizing, optimizedText, handleOptimize } = useOptimizationProcess({
    text,
    results,
    targetKeywords,
    apiKey,
    aiModel,
  });

  // Badges describe the text the user is currently acting on: the optimized
  // output once it exists, otherwise the original input.
  const activeText = optimizedText || text;
  const checkKeywordStatus = (keyword: string): KeywordStatus => matchKeywordInText(activeText, keyword);

  const keywordsToOptimize = targetKeywords.filter(kw => checkKeywordStatus(kw) === "missing");
  const keywordsWithPartialMatch = targetKeywords.filter(kw => checkKeywordStatus(kw) === "partial");
  const needsOptimization = keywordsToOptimize.length > 0 || keywordsWithPartialMatch.length > 0;

  return {
    apiKey,
    setApiKey,
    isOptimizing,
    optimizedText,
    handleOptimize,
    keywordsToOptimize,
    keywordsWithPartialMatch,
    needsOptimization,
    checkKeywordStatus,
  };
};
