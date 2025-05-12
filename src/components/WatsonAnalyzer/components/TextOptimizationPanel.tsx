
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  isExactKeywordMatch, 
  isPartialKeywordMatch, 
  optimizeTextWithAI 
} from "../utils/optimizationUtils";
import AIOptimizationConfig from "./AIOptimizationConfig";

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
  const [apiKey, setApiKey] = useState<string>("");
  const [aiModel, setAiModel] = useState<string>("gpt-4o-mini");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizedText, setOptimizedText] = useState<string>("");
  
  // Verifica delle parole chiave 
  const checkKeywordStatus = (keyword: string) => {
    if (!results || !results.keywords) return { exact: false, partial: false };
    
    // Check for exact matches first
    const exactMatch = results.keywords.some(kw => isExactKeywordMatch(kw.text, keyword));
    if (exactMatch) return { exact: true, partial: false };
    
    // If no exact match, check for partial matches
    const partialMatch = results.keywords.some(kw => isPartialKeywordMatch(kw.text, keyword));
    return { exact: false, partial: partialMatch };
  };
  
  // Keywords that need optimization (no exact or partial match)
  const keywordsToOptimize = targetKeywords.filter(keyword => {
    const status = checkKeywordStatus(keyword);
    return !status.exact && !status.partial;
  });
  
  // Keywords with only partial matches
  const keywordsWithPartialMatch = targetKeywords.filter(keyword => {
    const status = checkKeywordStatus(keyword);
    return !status.exact && status.partial;
  });
  
  // Keywords with exact matches
  const keywordsWithExactMatch = targetKeywords.filter(keyword => {
    const status = checkKeywordStatus(keyword);
    return status.exact;
  });
  
  // Check if optimization is needed
  const needsOptimization = keywordsToOptimize.length > 0;
  
  const handleOptimize = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key to proceed with optimization.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const optimized = await optimizeTextWithAI(
        text,
        [...keywordsToOptimize, ...keywordsWithPartialMatch],
        results,
        apiKey,
        aiModel
      );
      setOptimizedText(optimized);
      toast({
        title: "Optimization Completed",
        description: "The text has been successfully optimized.",
      });
    } catch (error) {
      console.error("Error during optimization:", error);
      toast({
        title: "Optimization Error",
        description: error instanceof Error ? error.message : "An error occurred during text optimization.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

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
              Optimize text for target keywords using OpenAI
            </CardDescription>
          </div>
          <AIOptimizationConfig 
            apiKey={apiKey} 
            setApiKey={setApiKey} 
            aiModel={aiModel} 
            setAiModel={setAiModel} 
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {targetKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {targetKeywords.map((keyword, index) => {
              const status = checkKeywordStatus(keyword);
              let badgeVariant = "default";
              let badgeClass = "";
              let indicator = "✗";
              
              if (status.exact) {
                badgeVariant = "outline";
                badgeClass = "bg-green-100 text-green-800";
                indicator = "✓";
              } else if (status.partial) {
                badgeVariant = "outline";
                badgeClass = "bg-amber-100 text-amber-800";
                indicator = "~";
              } else {
                badgeClass = "bg-red-100 text-red-800";
              }
              
              return (
                <Badge 
                  key={index} 
                  variant={badgeVariant}
                  className={badgeClass}
                >
                  {keyword} {indicator}
                </Badge>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Badge variant="outline" className="bg-green-100 text-green-800 h-5 w-5 flex items-center justify-center p-0">✓</Badge>
          <span className="mr-3">Exact match</span>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 h-5 w-5 flex items-center justify-center p-0">~</Badge>
          <span className="mr-3">Partial match</span>
          <Badge variant="default" className="bg-red-100 text-red-800 h-5 w-5 flex items-center justify-center p-0">✗</Badge>
          <span>No match</span>
        </div>

        {needsOptimization ? (
          <Alert variant="default" className="bg-red-50 text-red-800 border-red-200">
            <AlertTitle>Optimization Recommended</AlertTitle>
            <AlertDescription>
              Some of your target keywords ({keywordsToOptimize.join(', ')}) were not found in the analysis.
              AI optimization can help integrate these keywords into the text.
            </AlertDescription>
          </Alert>
        ) : keywordsWithPartialMatch.length > 0 ? (
          <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertTitle>Partial Optimization Recommended</AlertTitle>
            <AlertDescription>
              Some keywords have only partial matches. Consider optimization to improve exact keyword matching.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
            <AlertTitle>Well Optimized Text</AlertTitle>
            <AlertDescription>
              All your target keywords have exact matches in the analysis.
            </AlertDescription>
          </Alert>
        )}

        {optimizedText && (
          <Tabs defaultValue="original">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="original">Original Text</TabsTrigger>
              <TabsTrigger value="optimized">Optimized Text</TabsTrigger>
            </TabsList>
            <TabsContent value="original">
              <Textarea 
                readOnly
                value={text}
                className="min-h-[200px] font-mono text-sm"
              />
            </TabsContent>
            <TabsContent value="optimized">
              <Textarea 
                readOnly
                value={optimizedText}
                className="min-h-[200px] font-mono text-sm"
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button 
          onClick={handleOptimize}
          disabled={isOptimizing || (!needsOptimization && keywordsWithPartialMatch.length === 0) || !apiKey}
          className="flex-1"
          variant={(needsOptimization || keywordsWithPartialMatch.length > 0) ? "default" : "outline"}
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
          >
            Use Optimized Text
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TextOptimizationPanel;
