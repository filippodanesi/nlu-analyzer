
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AIOptimizationConfig from "./AIOptimizationConfig";
import KeywordStatusBadge from "./optimization/KeywordStatusBadge";
import KeywordStatusLegend from "./optimization/KeywordStatusLegend";
import OptimizationGuidance from "./optimization/OptimizationAlerts";
import OptimizedTextDisplay from "./optimization/OptimizedTextDisplay";
import CostSummary from "./optimization/CostSummary";
import { useTextOptimization } from "../hooks/useTextOptimization";

interface TextOptimizationPanelProps {
  text: string;
  results: any;
  targetKeywords: string[];
  onOptimizedTextSelect: (text: string) => void;
}

const TextOptimizationPanel: React.FC<TextOptimizationPanelProps> = ({
  text,
  results,
  targetKeywords,
  onOptimizedTextSelect
}) => {
  const {
    costTracker,
    lastCostRecord,
    apiKey,
    setApiKey,
    aiModel,
    setAiModel,
    aiProvider,
    setAiProvider,
    openAIKey,
    anthropicKey,
    isOptimizing,
    optimizedText,
    keywordsToOptimize,
    keywordsWithPartialMatch,
    needsOptimization,
    handleOptimize,
    checkKeywordStatus
  } = useTextOptimization({ text, results, targetKeywords });

  const handleUseOptimized = () => {
    onOptimizedTextSelect(optimizedText);
    toast({
      title: "Text Updated",
      description: "The optimized text has been selected for analysis.",
    });
  };

  if (!results || targetKeywords.length === 0) {
    return null;
  }

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">AI Optimization</CardTitle>
            <CardDescription>
              Rewrite the text so it includes your target keywords
            </CardDescription>
          </div>
          <AIOptimizationConfig
            apiKey={apiKey}
            setApiKey={setApiKey}
            aiModel={aiModel}
            setAiModel={setAiModel}
            aiProvider={aiProvider}
            setAiProvider={setAiProvider}
            openAIKey={openAIKey}
            anthropicKey={anthropicKey}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 1. What to do next */}
        <OptimizationGuidance
          totalKeywords={targetKeywords.length}
          keywordsToOptimize={keywordsToOptimize}
          keywordsWithPartialMatch={keywordsWithPartialMatch}
          hasOptimized={!!optimizedText}
        />

        {/* 2. Per-keyword status */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {targetKeywords.map((keyword, index) => (
              <KeywordStatusBadge
                key={index}
                keyword={keyword}
                status={checkKeywordStatus(keyword)}
              />
            ))}
          </div>
          <KeywordStatusLegend />
        </div>

        {/* 3. The text */}
        <OptimizedTextDisplay
          originalText={text}
          optimizedText={optimizedText}
        />

        {/* 4. Cost (secondary) */}
        <CostSummary
          costTracker={costTracker}
          activeProvider={aiProvider}
          lastCostRecord={lastCostRecord}
        />
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button
          onClick={handleOptimize}
          disabled={isOptimizing || !needsOptimization || !apiKey}
          className="flex-1"
          variant={needsOptimization ? "default" : "outline"}
        >
          {isOptimizing ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            'Optimize Text'
          )}
        </Button>

        {optimizedText && (
          <Button
            onClick={handleUseOptimized}
            className="flex-1"
            variant="outline"
          >
            Use Optimized Text
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TextOptimizationPanel;
