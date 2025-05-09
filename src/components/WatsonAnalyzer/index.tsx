import React, { useState } from 'react';
import { Github, Info } from "lucide-react";
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import ApiConfigPanel from './ApiConfigPanel';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { Separator } from '@/components/ui/separator';

const WatsonAnalyzer: React.FC = () => {
  // API Configuration state
  const [apiKey, setApiKey] = useState("");
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState("us-south");
  const [instanceId, setInstanceId] = useState("");
  
  // Features state
  const [features, setFeatures] = useState({
    keywords: true,
    entities: true,
    concepts: true,
    relations: false,
    categories: true,
  });
  
  // Limits state
  const [limits, setLimits] = useState({
    keywords: 10,
    entities: 10,
    concepts: 5,
    categories: 3,
  });
  
  // Language state
  const [language, setLanguage] = useState("en");
  
  // Input state
  const [text, setText] = useState("");
  const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
  const [targetKeywords, setTargetKeywords] = useState("");
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [textStats, setTextStats] = useState({
    wordCount: 0,
    sentenceCount: 0,
    charCount: 0,
  });

  const handleAnalyze = () => {
    if (!text) {
      toast({
        title: "No text provided",
        description: "Please enter text to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey && region !== "custom") {
      toast({
        title: "API Key required",
        description: "Please enter your IBM Watson NLU API Key.",
        variant: "destructive",
      });
      return;
    }

    // Start analysis
    setIsAnalyzing(true);

    // Calculate text statistics
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const sentenceCount = (text.match(/[.!?]+/g) || []).length || 1;
    const charCount = text.length;

    setTextStats({
      wordCount,
      sentenceCount,
      charCount,
    });

    // In a real implementation, you would call the IBM Watson API here
    // For now, let's mock the API call with a timeout and sample data
    setTimeout(() => {
      // Mock response data for demonstration
      const mockResponse = {
        language: language,
        keywords: features.keywords ? [
          { text: "artificial intelligence", relevance: 0.98, sentiment: { score: 0.8 } },
          { text: "natural language processing", relevance: 0.93, sentiment: { score: 0.6 } },
          { text: "machine learning", relevance: 0.89, sentiment: { score: 0.7 } },
          { text: "data analysis", relevance: 0.84, sentiment: { score: 0.5 } },
          { text: "text mining", relevance: 0.81, sentiment: { score: 0.4 } },
          { text: "cognitive computing", relevance: 0.76, sentiment: { score: 0.6 } },
          { text: "watson", relevance: 0.72, sentiment: { score: 0.9 } },
          { text: "ibm", relevance: 0.68, sentiment: { score: 0.3 } },
          { text: "language models", relevance: 0.65, sentiment: { score: 0.2 } },
          { text: "analytics", relevance: 0.61, sentiment: { score: 0.1 } },
        ] : [],
        entities: features.entities ? [
          { text: "IBM", type: "Organization", relevance: 0.95, sentiment: { score: 0.4 } },
          { text: "Watson", type: "Person", relevance: 0.92, sentiment: { score: 0.8 } },
          { text: "Natural Language Understanding", type: "Technology", relevance: 0.90, sentiment: { score: 0.7 } },
          { text: "AI", type: "Technology", relevance: 0.87, sentiment: { score: 0.6 } },
          { text: "API", type: "Technology", relevance: 0.82, sentiment: { score: 0.3 } },
          { text: "United States", type: "Location", relevance: 0.67, sentiment: { score: 0.1 } },
          { text: "2022", type: "Date", relevance: 0.55, sentiment: { score: 0 } },
        ] : [],
        concepts: features.concepts ? [
          { text: "Artificial intelligence", relevance: 0.98 },
          { text: "Natural language processing", relevance: 0.95 },
          { text: "Machine learning", relevance: 0.92 },
          { text: "IBM Watson", relevance: 0.87 },
          { text: "Computational linguistics", relevance: 0.82 },
        ] : [],
        categories: features.categories ? [
          { label: "technology and computing/artificial intelligence", score: 0.95 },
          { label: "science/computer science", score: 0.82 },
          { label: "business and industrial/business software", score: 0.74 },
        ] : [],
        relations: features.relations ? [
          {
            type: "agentOf",
            sentence: "IBM developed Watson for natural language processing tasks.",
            score: 0.87,
            arguments: [
              { 
                text: "IBM", 
                entities: [{ type: "Organization" }] 
              },
              { 
                text: "developed", 
                entities: [{ type: "Action" }] 
              },
              { 
                text: "Watson", 
                entities: [{ type: "Technology" }] 
              }
            ]
          },
          {
            type: "partOf",
            sentence: "Natural Language Understanding is a component of Watson's AI capabilities.",
            score: 0.82,
            arguments: [
              { 
                text: "Natural Language Understanding", 
                entities: [{ type: "Technology" }] 
              },
              { 
                text: "component", 
                entities: [{ type: "Concept" }] 
              },
              { 
                text: "Watson's AI capabilities", 
                entities: [{ type: "Technology" }] 
              }
            ]
          }
        ] : []
      };

      setResults(mockResponse);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Text has been successfully analyzed.",
      });
    }, 2000);
  };

  // Process target keywords into an array
  const targetKeywordsList = targetKeywords
    .split(',')
    .map(kw => kw.trim())
    .filter(Boolean);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground font-inter">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">IBM Watson Natural Language Understanding API</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Github className="h-4 w-4" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Description */}
        <div className="container max-w-7xl mx-auto px-4 py-4 border-b border-border">
          <p className="text-sm text-muted-foreground">
            Enterprise-grade natural language processing for extracting metadata from text such as keywords, 
            entities, categories, and relationships. This tool leverages advanced linguistic analysis and 
            machine learning to identify key textual elements and provide insights about content structure.
          </p>
        </div>

        {/* Main content */}
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <ApiConfigPanel
                apiKey={apiKey}
                setApiKey={setApiKey}
                url={url}
                setUrl={setUrl}
                region={region}
                setRegion={setRegion}
                instanceId={instanceId}
                setInstanceId={setInstanceId}
                features={features}
                setFeatures={setFeatures}
                limits={limits}
                setLimits={setLimits}
                language={language}
                setLanguage={setLanguage}
              />
            </div>

            <div className="md:col-span-2 space-y-6">
              <InputPanel
                text={text}
                setText={setText}
                inputMethod={inputMethod}
                setInputMethod={setInputMethod}
                targetKeywords={targetKeywords}
                setTargetKeywords={setTargetKeywords}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
              />

              {results && (
                <ResultsPanel 
                  results={results} 
                  targetKeywords={targetKeywordsList}
                  textStats={textStats}
                />
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-8">
          <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              IBM Watson Natural Language Understanding API Explorer - v1.0.0
            </div>
            <div className="text-xs text-muted-foreground">
              Built with React & Tailwind CSS
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default WatsonAnalyzer;
