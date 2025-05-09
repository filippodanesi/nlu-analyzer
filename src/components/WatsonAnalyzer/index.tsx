
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
      // Analyze input text to extract keywords
      const inputWords = text.toLowerCase().split(/\s+/).filter(Boolean);
      const uniqueWords = [...new Set(inputWords)];
      const frequentWords = getFrequentWords(text);

      // Generate mock response based on actual text input
      const mockResponse = {
        language: language,
        keywords: features.keywords ? generateMockKeywords(frequentWords) : [],
        entities: features.entities ? generateMockEntities(text) : [],
        concepts: features.concepts ? generateMockConcepts(text) : [],
        categories: features.categories ? generateMockCategories(text) : [],
        relations: features.relations ? generateMockRelations(text) : [],
      };

      setResults(mockResponse);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Text has been successfully analyzed.",
      });
    }, 2000);
  };

  // Helper functions for generating realistic mock data based on input text
  const getFrequentWords = (text: string) => {
    const words = text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/);
    
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      if (word.length > 3) { // Only consider words with more than 3 characters
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 10);
  };

  const generateMockKeywords = (words: string[]) => {
    return words.map((word, index) => {
      const relevance = 0.98 - (index * 0.04);
      const sentimentScore = (Math.random() * 1.4) - 0.2; // Between -0.2 and 1.2
      return {
        text: word,
        relevance: parseFloat(relevance.toFixed(2)),
        sentiment: { score: parseFloat(sentimentScore.toFixed(2)) }
      };
    });
  };

  const generateMockEntities = (text: string) => {
    const possibleEntities = [
      { text: "Triumph", type: "Organization" },
      { text: "bras", type: "Product" },
      { text: "straps", type: "Feature" },
      { text: "support", type: "Concept" },
      { text: "design", type: "Concept" },
      { text: "fabrics", type: "Material" },
      { text: "dresses", type: "Product" },
      { text: "tops", type: "Product" },
    ];
    
    return possibleEntities
      .filter(entity => text.toLowerCase().includes(entity.text.toLowerCase()))
      .map((entity, index) => {
        const relevance = 0.95 - (index * 0.05);
        const sentimentScore = (Math.random() * 1.2) - 0.2;
        return {
          ...entity,
          relevance: parseFloat(relevance.toFixed(2)),
          sentiment: { score: parseFloat(sentimentScore.toFixed(2)) }
        };
      });
  };

  const generateMockConcepts = (text: string) => {
    const possibleConcepts = [
      "Lingerie",
      "Fashion",
      "Apparel",
      "Clothing",
      "Undergarments",
      "Style",
      "Comfort",
      "Support"
    ];
    
    return possibleConcepts
      .slice(0, 5)
      .map((concept, index) => ({
        text: concept,
        relevance: parseFloat((0.98 - (index * 0.04)).toFixed(2))
      }));
  };

  const generateMockCategories = (text: string) => {
    const lowerText = text.toLowerCase();
    
    const categories = [];
    
    if (lowerText.includes("bra") || lowerText.includes("support") || lowerText.includes("comfortable")) {
      categories.push({
        label: "shopping/apparel/underwear",
        score: 0.95
      });
    }
    
    if (lowerText.includes("style") || lowerText.includes("design") || lowerText.includes("dress")) {
      categories.push({
        label: "style and fashion/clothing",
        score: 0.82
      });
    }

    if (lowerText.includes("comfort") || lowerText.includes("fabric") || lowerText.includes("quality")) {
      categories.push({
        label: "shopping/consumer resources/product reviews",
        score: 0.74
      });
    }
    
    return categories.length > 0 ? categories : [
      { label: "shopping/apparel/underwear", score: 0.95 }
    ];
  };

  const generateMockRelations = (text: string) => {
    if (!features.relations) return [];
    
    const relations = [];
    
    if (text.toLowerCase().includes("triumph") && text.toLowerCase().includes("bra")) {
      relations.push({
        type: "providerOf",
        sentence: "Triumph provides strapless bras designed for secure support.",
        score: 0.87,
        args: [
          { 
            text: "Triumph", 
            entities: [{ type: "Organization" }] 
          },
          { 
            text: "strapless bras", 
            entities: [{ type: "Product" }] 
          }
        ]
      });
    }
    
    if (text.toLowerCase().includes("support") && text.toLowerCase().includes("bra")) {
      relations.push({
        type: "featureOf",
        sentence: "Support is a key feature of the strapless bras.",
        score: 0.82,
        args: [
          { 
            text: "Support", 
            entities: [{ type: "Feature" }] 
          },
          { 
            text: "strapless bras", 
            entities: [{ type: "Product" }] 
          }
        ]
      });
    }
    
    return relations;
  };

  // Process target keywords into an array
  const targetKeywordsList = targetKeywords
    .split(',')
    .map(kw => kw.trim())
    .filter(Boolean);

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
