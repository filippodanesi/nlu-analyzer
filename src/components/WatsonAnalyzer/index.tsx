import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import ApiConfigPanel from './ApiConfigPanel';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';
import { useWatsonAnalyzer } from './hooks/useWatsonAnalyzer';

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
      <Header 
        credentialsFileExists={credentialsFileExists}
      />

      {/* Description */}
      <Description />

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
              toneModel={toneModel}
              setToneModel={setToneModel}
              credentialsFileExists={credentialsFileExists}
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
      <Footer />
    </ThemeProvider>
  );
};

export default WatsonAnalyzer;
