
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import ApiConfigPanel from './ApiConfigPanel';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';
import TextOptimizationPanel from './components/TextOptimizationPanel';
import { useWatsonAnalyzer } from './hooks/useWatsonAnalyzer';
import { useOptimization } from './hooks/useOptimization';
import { Link } from 'react-router-dom';

// Import refactored components
import Header from './components/Header';
import Description from './components/Description';
import Footer from './components/Footer';

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
    credentialsFileExists,
    setCredentialsFileExists,
    
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

  // Optimization hook
  const {
    showOptimization
  } = useOptimization();

  // Get target keywords list
  const targetKeywordsList = getTargetKeywordsList();

  // Handle optimized text selection
  const handleOptimizedTextSelect = (optimizedText: string) => {
    setText(optimizedText);
  };

  return (
    <ThemeProvider defaultTheme="light">
      {/* Header */}
      <Header 
        credentialsFileExists={credentialsFileExists}
      />

      {/* Description */}
      <Description />

      {/* Main content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Link 
            to="/changelog" 
            className="text-sm text-primary hover:text-primary/80 underline underline-offset-4"
          >
            Changelog v1.1.6
          </Link>
        </div>
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
              toneModel={toneModel}
              setToneModel={setToneModel}
              credentialsFileExists={credentialsFileExists}
              setCredentialsFileExists={setCredentialsFileExists}
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
              features={features}
            />

            {results && (
              <>
                <ResultsPanel 
                  results={results} 
                  targetKeywords={targetKeywordsList}
                  textStats={textStats}
                />

                <TextOptimizationPanel
                  text={text}
                  results={results}
                  targetKeywords={targetKeywordsList}
                  onOptimizedTextSelect={handleOptimizedTextSelect}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </ThemeProvider>
  );
};

export default WatsonAnalyzer;
