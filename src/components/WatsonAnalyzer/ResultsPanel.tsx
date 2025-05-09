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
import ToneTab from './components/ToneTab'; // Import the new ToneTab component

interface ResultsPanelProps {
  results: any;
  targetKeywords: string[];
  textStats: {
    wordCount: number;
    sentenceCount: number;
    charCount: number;
  };
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  targetKeywords,
  textStats,
}) => {
  const [isJsonOpen, setIsJsonOpen] = React.useState(false);

  if (!results) return null;

  // Function to check if a string contains any target keywords
  const containsTargetKeyword = (text: string) => {
    if (!text || !targetKeywords.length) return false;
    const lowerText = text.toLowerCase();
    return targetKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  };

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
        <CardDescription>
          Extracted information from your text
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Text Statistics */}
        <TextStatsCard textStats={textStats} language={results.language} />

        {/* Main Results Tabs */}
        <Tabs defaultValue="extraction" className="w-full">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="extraction">Extraction</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="tone">Tone Analysis</TabsTrigger>
            <TabsTrigger value="linguistics">Linguistics</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          {/* Extraction Tab */}
          <TabsContent value="extraction" className="pt-4">
            <ExtractionTab results={results} containsTargetKeyword={containsTargetKeyword} />
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
            {results.classifications ? (
              <ToneTab classifications={results.classifications} />
            ) : (
              <PlaceholderTab 
                message="To enable tone analysis, select the Tone Analysis option in the features panel." 
                helpText="Tone analysis is only available for English and French languages, and detects seven emotional tones in text."
              />
            )}
          </TabsContent>

          {/* Other tabs */}
          <TabsContent value="linguistics" className="pt-4">
            <PlaceholderTab 
              message="To enable linguistic analysis, select the corresponding options." 
              helpText="Linguistic analysis extracts information such as parts of speech, syntactic relationships, and grammatical functions from text."
            />
          </TabsContent>

          <TabsContent value="custom" className="pt-4">
            <PlaceholderTab 
              message="To use custom models, configure the appropriate settings." 
              helpText="Watson NLU can recognize multi-word phrases as entities or keywords. In a real implementation, you might see terms like 'natural language processing' or 'strapless bras' identified as single analysis entities."
            />
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
          IBM Watson Natural Language Understanding API Explorer
        </span>
        <span>v1.0.0</span>
      </CardFooter>
    </Card>
  );
};

export default ResultsPanel;
