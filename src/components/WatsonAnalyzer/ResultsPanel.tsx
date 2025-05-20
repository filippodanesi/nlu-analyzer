
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileJson } from "lucide-react";

// Import custom components
import TextStatsCard from './components/TextStatsCard';
import ExtractionTab from './components/ExtractionTab';
import ClassificationTab from './components/ClassificationTab';
import PlaceholderTab from './components/PlaceholderTab';
import JsonResponseDisplay from './components/JsonResponseDisplay';
import ToneTab from './components/ToneTab';
import ExportResults from './components/ExportResults';
import { TONE_SUPPORTED_LANGUAGES } from './hooks/useAnalysisFeatures';
import type { AnalysisProvider } from './hooks/useAnalysisProvider';

interface ResultsPanelProps {
  results: any;
  targetKeywords: string[];
  textStats: {
    wordCount: number;
    sentenceCount: number;
    charCount: number;
  };
  provider: AnalysisProvider;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  targetKeywords,
  textStats,
  provider
}) => {
  const [isJsonOpen, setIsJsonOpen] = React.useState(false);

  if (!results) return null;

  // Enhanced function to check if a string contains any target keywords
  const containsTargetKeyword = (text: string) => {
    if (!text || !targetKeywords || targetKeywords.length === 0) return false;
    
    const lowerText = text.toLowerCase().trim();
    // Check if any of the target keywords are included in the text
    return targetKeywords.some(keyword => {
      const lowerKeyword = keyword.toLowerCase().trim();
      return lowerText.includes(lowerKeyword);
    });
  };

  // Check if classifications are available and language is supported
  const hasToneAnalysis = results.classifications && 
    results.classifications.length > 0 && 
    (TONE_SUPPORTED_LANGUAGES.includes(results.language) || results.language === 'en' || results.language === 'fr');

  // Determine provider name for display
  const providerName = provider === 'watson' ? 'IBM Watson NLU' : 'Google Cloud NLP';

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
            <CardDescription>
              Information extracted from text using {providerName}
            </CardDescription>
          </div>
          <ExportResults results={results} isDisabled={!results} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Text Statistics */}
        <TextStatsCard textStats={textStats} language={results.language} />

        {/* Main Results Tabs */}
        <Tabs defaultValue="extraction" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="extraction">Extraction</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="tone">Tone Analysis</TabsTrigger>
          </TabsList>

          {/* Extraction Tab */}
          <TabsContent value="extraction" className="pt-4">
            <ExtractionTab 
              results={results} 
              containsTargetKeyword={containsTargetKeyword}
              targetKeywords={targetKeywords}
            />
          </TabsContent>

          {/* Classification Tab */}
          <TabsContent value="classification" className="pt-4">
            <ClassificationTab 
              categories={results.categories || []} 
              containsTargetKeyword={containsTargetKeyword} 
            />
          </TabsContent>
          
          {/* Tone Analysis Tab */}
          <TabsContent value="tone" className="pt-4">
            {hasToneAnalysis ? (
              <ToneTab classifications={results.classifications} />
            ) : (
              <PlaceholderTab 
                message={provider === 'watson' 
                  ? "Enable tone analysis in the features panel to activate this function." 
                  : "Tone analysis is not supported by Google Cloud NLP in this integration."
                } 
                helpText={provider === 'watson'
                  ? "Tone analysis is only available for English and French languages, and detects seven emotional tones in text."
                  : "Use the IBM Watson NLU provider to access tone analysis."
                }
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Raw JSON Response */}
        <Collapsible open={isJsonOpen} onOpenChange={setIsJsonOpen}>
          <div className="flex items-center justify-between py-2">
            <h3 className="text-sm font-medium">API Response</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                <ChevronDown className={`h-4 w-4 transition-transform ${isJsonOpen ? "transform rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <JsonResponseDisplay results={results} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileJson className="h-3.5 w-3.5" />
          {providerName} Analyzer
        </span>
        <span>v1.1.7</span>
      </CardFooter>
    </Card>
  );
};

export default ResultsPanel;
