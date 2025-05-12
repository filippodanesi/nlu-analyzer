import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { isKeywordInTopPositions, optimizeTextWithAI } from "../utils/optimizationUtils";
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
  const [aiModel, setAiModel] = useState<string>("gpt-4o");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizedText, setOptimizedText] = useState<string>("");
  
  // Verifica se le parole chiave target hanno bisogno di ottimizzazione
  const needsOptimization = targetKeywords.some(keyword => 
    !isKeywordInTopPositions(keyword, results?.keywords || [], 3)
  );
  
  // Parole chiave che necessitano ottimizzazione
  const keywordsToOptimize = targetKeywords.filter(keyword => 
    !isKeywordInTopPositions(keyword, results?.keywords || [], 3)
  );

  const handleOptimize = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key to proceed with optimization.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const optimized = await optimizeTextWithAI(
        text,
        keywordsToOptimize,
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
              Optimize text for target keywords
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
              const isOptimized = isKeywordInTopPositions(keyword, results?.keywords || [], 3);
              return (
                <Badge 
                  key={index} 
                  variant={isOptimized ? "outline" : "default"}
                  className={isOptimized ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}
                >
                  {keyword} {isOptimized ? "✓" : "✗"}
                </Badge>
              );
            })}
          </div>
        )}

        {needsOptimization ? (
          <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertTitle>Optimization Recommended</AlertTitle>
            <AlertDescription>
              Some of your target keywords are not among the most relevant in the analysis.
              AI optimization can help improve the relevance of these keywords in the text.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
            <AlertTitle>Well Optimized Text</AlertTitle>
            <AlertDescription>
              All your target keywords are already well positioned in the analysis.
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
          >
            Use Optimized Text
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TextOptimizationPanel;
