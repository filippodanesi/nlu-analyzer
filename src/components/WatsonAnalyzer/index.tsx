
import React from 'react';
import { Github, Info } from "lucide-react";
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import ApiConfigPanel from './ApiConfigPanel';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useWatsonAnalyzer } from './hooks/useWatsonAnalyzer';

const WatsonAnalyzer: React.FC = () => {
  const {
    // API Configuration
    apiKey,
    setApiKey,
    url,
    setUrl,
    region,
    setRegion,
    instanceId,
    setInstanceId,
    
    // Features and limits
    features,
    setFeatures,
    limits,
    setLimits,
    
    // Language
    language,
    setLanguage,
    
    // Input
    text,
    setText,
    inputMethod,
    setInputMethod,
    targetKeywords,
    setTargetKeywords,
    
    // Analysis
    isAnalyzing,
    results,
    textStats,
    
    // Actions
    handleAnalyze,
    getTargetKeywordsList,
  } = useWatsonAnalyzer();

  // Get target keywords list
  const targetKeywordsList = getTargetKeywordsList();

  return (
    <ThemeProvider defaultTheme="light">
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
    </ThemeProvider>
  );
};

export default WatsonAnalyzer;
