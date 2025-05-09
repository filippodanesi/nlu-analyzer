
import React from 'react';
import { Github, CheckCircle } from "lucide-react";
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import ApiConfigPanel from './ApiConfigPanel';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useWatsonAnalyzer } from './hooks/useWatsonAnalyzer';

// Check for environment variables presence
const hasWatsonEnvVars = !!(
  process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY || 
  process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY ||
  process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL
);

const WatsonAnalyzer: React.FC = () => {
  const {
    // API Configuration
    useSecrets,
    setUseSecrets,
    apiKey,
    setApiKey,
    url,
    setUrl,
    region,
    setRegion,
    instanceId,
    setInstanceId,
    credentialsFileExists,
    
    // Features and limits
    features,
    setFeatures,
    limits,
    setLimits,
    
    // Language
    language,
    setLanguage,
    
    // Tone model
    toneModel,
    setToneModel,
    
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
            {credentialsFileExists && (
              <div className="flex items-center text-green-500 ml-2" title="IBM Credentials File Found">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Credentials File Found</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href="https://github.com/filippodanesi/watson-insight-explorer" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Go to the GitHub repository"
            >
              <Button variant="outline" size="icon" className="rounded-full">
                <Github className="h-4 w-4" />
              </Button>
            </a>
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
          {/* Only render the API configuration panel if we're not using environment variables OR useSecrets is false */}
          <div className="md:col-span-1 space-y-6">
            {(!hasWatsonEnvVars || !useSecrets) && (
              <ApiConfigPanel
                useSecrets={useSecrets}
                setUseSecrets={setUseSecrets}
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
                toneModel={toneModel}
                setToneModel={setToneModel}
                credentialsFileExists={credentialsFileExists}
              />
            )}
            {/* If environment variables are in use, show a confirmation message */}
            {(hasWatsonEnvVars && useSecrets) || (credentialsFileExists && useSecrets) ? (
              <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-medium flex items-center">
                  API Configuration
                  {credentialsFileExists && (
                    <div className="flex items-center text-green-500 ml-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">ibm-credentials.env found</span>
                    </div>
                  )}
                </h3>
                <div className="px-4 py-3 bg-secondary text-secondary-foreground rounded-md text-sm">
                  <p>Using Watson NLU credentials from {credentialsFileExists ? 'ibm-credentials.env' : 'environment variables'}:</p>
                  <ul className="list-disc ml-5 mt-2 text-xs space-y-1">
                    <li>NATURAL_LANGUAGE_UNDERSTANDING_APIKEY</li>
                    <li>NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY</li>
                    <li>NATURAL_LANGUAGE_UNDERSTANDING_URL</li>
                    <li>NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE</li>
                  </ul>
                </div>
                {/* Still show the features configuration part */}
                <ApiConfigPanel
                  useSecrets={useSecrets}
                  setUseSecrets={setUseSecrets}
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
                  toneModel={toneModel}
                  setToneModel={setToneModel}
                  credentialsFileExists={credentialsFileExists}
                />
              </div>
            ) : null}
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
